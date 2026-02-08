const { default: makeWASocket, useMultiFileAuthState, DisconnectReason, fetchLatestBaileysVersion, makeCacheableSignalKeyStore, makeInMemoryStore } = require('@whiskeysockets/baileys');
const pino = require('pino');
const readline = require('readline');
const { Boom } = require('@hapi/boom');
const fs = require('fs-extra');
const path = require('path');

// Import handlers
const { handleMessage } = require('./handlers/messageHandler');

const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
});

const question = (text) => new Promise((resolve) => rl.question(text, resolve));

let sock;
let lastMessageTimestamp = Date.now();

async function startBot() {
    const { state, saveCreds } = await useMultiFileAuthState('./auth_info');
    const { version } = await fetchLatestBaileysVersion();

    const logger = pino({ 
        level: 'silent' // Suppresses connection errors
    });

    sock = makeWASocket({
        version,
        logger,
        printQRInTerminal: false,
        auth: {
            creds: state.creds,
            keys: makeCacheableSignalKeyStore(state.keys, logger),
        },
        browser: ['Nexora Violet', 'Chrome', '121.0.0'],
        markOnlineOnConnect: true,
        generateHighQualityLinkPreview: true,
        syncFullHistory: false,
        defaultQueryTimeoutMs: undefined,
        getMessage: async (key) => {
            return { conversation: '' };
        }
    });

    // Handle pairing code
    if (!sock.authState.creds.registered) {
        const phoneNumber = await question('\n╭━━𖣔 𝗡𝗘𝗫𝗢𝗥𝗔 𝗩𝗜𝗢𝗟𝗘𝗧 𖣔━━╮\n│ Enter WhatsApp Number:\n│ (with country code, e.g., 1234567890)\n╰━━━━━━━━━━━━━━━━━━━╯\n\n➤ ');
        
        const code = await sock.requestPairingCode(phoneNumber.trim());
        console.log(`\n╭━━𖣔 𝗣𝗔𝗜𝗥𝗜𝗡𝗚 𝗖𝗢𝗗𝗘 𖣔━━╮`);
        console.log(`│`);
        console.log(`│  🔐 Code: ${code}`);
        console.log(`│`);
        console.log(`╰━━━━━━━━━━━━━━━━━━━╯\n`);
    }

    sock.ev.on('creds.update', saveCreds);

    sock.ev.on('connection.update', async (update) => {
        const { connection, lastDisconnect } = update;

        if (connection === 'close') {
            const shouldReconnect = (lastDisconnect?.error instanceof Boom)
                ? lastDisconnect.error.output.statusCode !== DisconnectReason.loggedOut
                : true;

            if (shouldReconnect) {
                console.log('🔄 Reconnecting...');
                setTimeout(() => startBot(), 3000);
            } else {
                console.log('❌ Connection closed. Please delete auth_info folder and restart.');
            }
        } else if (connection === 'open') {
            console.log('\n╭━━𖣔 𝗡𝗘𝗫𝗢𝗥𝗔 𝗩𝗜𝗢𝗟𝗘𝗧 𖣔━━╮');
            console.log('│');
            console.log('│  ✅ Bot Connected!');
            console.log('│  🤖 Bot Name: Violet');
            console.log('│  👑 Owner: Kynx');
            console.log('│  🔥 Database: Firebase');
            console.log('│  ⚡ Status: Online');
            console.log('│');
            console.log('╰━━━━━━━━━━━━━━━━━━━╯\n');
            
            // Update last message timestamp when bot comes online
            lastMessageTimestamp = Date.now();
        }
    });

    sock.ev.on('messages.upsert', async ({ messages, type }) => {
        if (type !== 'notify') return;

        const msg = messages[0];
        if (!msg.message) return;

        // Ignore messages sent before bot came online
        const messageTimestamp = msg.messageTimestamp * 1000;
        if (messageTimestamp < lastMessageTimestamp) return;

        await handleMessage(sock, msg);
    });

    return sock;
}

// Handle graceful shutdown
process.on('SIGINT', () => {
    console.log('\n👋 Bot shutting down...');
    process.exit(0);
});

// Start the bot
startBot().catch(err => console.error('Error:', err));

module.exports = { sock };
