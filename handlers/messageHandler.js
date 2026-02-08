const { db } = require('../firebase');
const { jidNormalizedUser } = require('@whiskeysockets/baileys');

// Import all command handlers
const mainCommands = require('../commands/main');
const profileCommands = require('../commands/profile');
const adminCommands = require('../commands/admin');
const cardCommands = require('../commands/cards');
const economyCommands = require('../commands/economy');
const gamblingCommands = require('../commands/gambling');
const searchCommands = require('../commands/search');
const imageCommands = require('../commands/image');
const funCommands = require('../commands/fun');
const downloadCommands = require('../commands/download');
const ownerCommands = require('../commands/owner');

const OWNER = '2349049460676@s.whatsapp.net';
const PREFIX = '.';

async function handleMessage(sock, msg) {
    try {
        const messageType = Object.keys(msg.message)[0];
        const from = msg.key.remoteJid;
        const sender = jidNormalizedUser(msg.key.participant || msg.key.remoteJid);
        const isGroup = from.endsWith('@g.us');
        
        let body = '';
        
        if (messageType === 'conversation') {
            body = msg.message.conversation;
        } else if (messageType === 'extendedTextMessage') {
            body = msg.message.extendedTextMessage.text;
        } else if (messageType === 'imageMessage') {
            body = msg.message.imageMessage.caption || '';
        } else if (messageType === 'videoMessage') {
            body = msg.message.videoMessage.caption || '';
        }

        if (!body.startsWith(PREFIX)) return;

        const args = body.slice(PREFIX.length).trim().split(/ +/);
        const command = args.shift().toLowerCase();

        // Get bot mode
        const botData = await db.collection('settings').doc('bot').get();
        const botMode = botData.exists ? botData.data().mode || 'public' : 'public';

        // Check if bot is in private mode
        if (botMode === 'private' && sender !== OWNER) {
            return; // Silently ignore commands from non-owners in private mode
        }

        // Check if user is registered (except for register command)
        if (command !== 'register' && command !== 'reg' && command !== 'menu') {
            const userRef = db.collection('users').doc(sender);
            const userDoc = await userRef.get();
            
            if (!userDoc.exists) {
                return await sock.sendMessage(from, {
                    text: '╭━━𖣔 𝗡𝗢𝗧 𝗥𝗘𝗚𝗜𝗦𝗧𝗘𝗥𝗘𝗗 𖣔━━╮\n│\n│  ❌ You need to register first!\n│  Use: .register or .reg\n│\n╰━━━━━━━━━━━━━━━━━━━╯'
                }, { quoted: msg });
            }
        }

        // Get group metadata if in group
        let groupMetadata = null;
        let isBotAdmin = false;
        let isUserAdmin = false;
        let groupAdmins = [];
        
        if (isGroup) {
            groupMetadata = await sock.groupMetadata(from);
            groupAdmins = groupMetadata.participants
                .filter(p => p.admin === 'admin' || p.admin === 'superadmin')
                .map(p => p.id);
            
            // Check if the paired WhatsApp number (bot's number) is admin
            const botJid = jidNormalizedUser(sock.user.id);
            isBotAdmin = groupAdmins.includes(botJid);
            isUserAdmin = groupAdmins.includes(sender);
        }

        // Check if user is owner, mod, or guardian
        const isOwner = sender === OWNER;
        const modsDoc = await db.collection('settings').doc('mods').get();
        const mods = modsDoc.exists ? modsDoc.data().list || [] : [];
        const guardians = modsDoc.exists ? modsDoc.data().guardians || [] : [];
        const isMod = mods.includes(sender);
        const isGuardian = guardians.includes(sender);

        const context = {
            sock,
            msg,
            from,
            sender,
            args,
            isGroup,
            groupMetadata,
            isBotAdmin,
            isUserAdmin,
            isOwner,
            isMod,
            isGuardian,
            PREFIX,
            OWNER,
            db,
            messageType
        };

        // Route to appropriate command handler
        if (mainCommands[command]) {
            await mainCommands[command](context);
        } else if (profileCommands[command]) {
            await profileCommands[command](context);
        } else if (adminCommands[command]) {
            await adminCommands[command](context);
        } else if (cardCommands[command]) {
            await cardCommands[command](context);
        } else if (economyCommands[command]) {
            await economyCommands[command](context);
        } else if (gamblingCommands[command]) {
            await gamblingCommands[command](context);
        } else if (searchCommands[command]) {
            await searchCommands[command](context);
        } else if (imageCommands[command]) {
            await imageCommands[command](context);
        } else if (funCommands[command]) {
            await funCommands[command](context);
        } else if (downloadCommands[command]) {
            await downloadCommands[command](context);
        } else if (ownerCommands[command]) {
            await ownerCommands[command](context);
        }

    } catch (error) {
        console.error('Error handling message:', error);
    }
}

module.exports = { handleMessage };
