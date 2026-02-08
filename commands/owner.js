const { jidNormalizedUser } = require('@whiskeysockets/baileys');

const mode = async ({ sock, msg, from, sender, args, db, isOwner }) => {
    if (!isOwner) {
        return await sock.sendMessage(from, {
            text: '╭━━𖣔 𝗘𝗥𝗥𝗢𝗥 𖣔━━╮\n│\n│  ❌ Owner only command!\n│\n╰━━━━━━━━━━━━━━━━━━━╯'
        }, { quoted: msg });
    }

    if (args.length === 0) {
        return await sock.sendMessage(from, {
            text: '╭━━𖣔 𝗘𝗥𝗥𝗢𝗥 𖣔━━╮\n│\n│  ❌ Usage: .mode <private/public>\n│\n╰━━━━━━━━━━━━━━━━━━━╯'
        }, { quoted: msg });
    }

    const newMode = args[0].toLowerCase();
    
    if (newMode !== 'private' && newMode !== 'public') {
        return await sock.sendMessage(from, {
            text: '╭━━𖣔 𝗘𝗥𝗥𝗢𝗥 𖣔━━╮\n│\n│  ❌ Mode must be private or public!\n│\n╰━━━━━━━━━━━━━━━━━━━╯'
        }, { quoted: msg });
    }

    await db.collection('settings').doc('bot').set({ mode: newMode }, { merge: true });

    await sock.sendMessage(from, {
        text: `╭━━𖣔 𝗕𝗢𝗧 𝗠𝗢𝗗𝗘 𖣔━━╮
│
│  ✅ Mode changed to ${newMode.toUpperCase()}!
│  ${newMode === 'private' ? '🔒 Bot will only respond to owner' : '🌍 Bot will respond to everyone'}
│
╰━━━━━━━━━━━━━━━━━━━╯`
    }, { quoted: msg });
};

const addmod = async ({ sock, msg, from, sender, args, db, isOwner }) => {
    if (!isOwner) {
        return await sock.sendMessage(from, {
            text: '╭━━𖣔 𝗘𝗥𝗥𝗢𝗥 𖣔━━╮\n│\n│  ❌ Owner only command!\n│\n╰━━━━━━━━━━━━━━━━━━━╯'
        }, { quoted: msg });
    }

    const mentioned = msg.message?.extendedTextMessage?.contextInfo?.mentionedJid;
    if (!mentioned || mentioned.length === 0) {
        return await sock.sendMessage(from, {
            text: '╭━━𖣔 𝗘𝗥𝗥𝗢𝗥 𖣔━━╮\n│\n│  ❌ Please mention a user!\n│  Usage: .addmod @user\n│\n╰━━━━━━━━━━━━━━━━━━━╯'
        }, { quoted: msg });
    }

    const userToAdd = mentioned[0];
    const modsRef = db.collection('settings').doc('mods');
    const modsDoc = await modsRef.get();
    const modsData = modsDoc.exists ? modsDoc.data() : { list: [], guardians: [] };
    
    if (modsData.list.includes(userToAdd)) {
        return await sock.sendMessage(from, {
            text: '╭━━𖣔 𝗘𝗥𝗥𝗢𝗥 𖣔━━╮\n│\n│  ❌ User is already a mod!\n│\n╰━━━━━━━━━━━━━━━━━━━╯'
        }, { quoted: msg });
    }

    modsData.list.push(userToAdd);
    await modsRef.set(modsData, { merge: true });

    await sock.sendMessage(from, {
        text: '╭━━𖣔 𝗠𝗢𝗗 𝗔𝗗𝗗𝗘𝗗 𖣔━━╮\n│\n│  ✅ User added as moderator!\n│\n╰━━━━━━━━━━━━━━━━━━━╯'
    }, { quoted: msg });
};

const removemod = async ({ sock, msg, from, sender, args, db, isOwner }) => {
    if (!isOwner) {
        return await sock.sendMessage(from, {
            text: '╭━━𖣔 𝗘𝗥𝗥𝗢𝗥 𖣔━━╮\n│\n│  ❌ Owner only command!\n│\n╰━━━━━━━━━━━━━━━━━━━╯'
        }, { quoted: msg });
    }

    const mentioned = msg.message?.extendedTextMessage?.contextInfo?.mentionedJid;
    if (!mentioned || mentioned.length === 0) {
        return await sock.sendMessage(from, {
            text: '╭━━𖣔 𝗘𝗥𝗥𝗢𝗥 𖣔━━╮\n│\n│  ❌ Please mention a user!\n│  Usage: .removemod @user\n│\n╰━━━━━━━━━━━━━━━━━━━╯'
        }, { quoted: msg });
    }

    const userToRemove = mentioned[0];
    const modsRef = db.collection('settings').doc('mods');
    const modsDoc = await modsRef.get();
    const modsData = modsDoc.exists ? modsDoc.data() : { list: [], guardians: [] };
    
    if (!modsData.list.includes(userToRemove)) {
        return await sock.sendMessage(from, {
            text: '╭━━𖣔 𝗘𝗥𝗥𝗢𝗥 𖣔━━╮\n│\n│  ❌ User is not a mod!\n│\n╰━━━━━━━━━━━━━━━━━━━╯'
        }, { quoted: msg });
    }

    modsData.list = modsData.list.filter(m => m !== userToRemove);
    await modsRef.set(modsData, { merge: true });

    await sock.sendMessage(from, {
        text: '╭━━𖣔 𝗠𝗢𝗗 𝗥𝗘𝗠𝗢𝗩𝗘𝗗 𖣔━━╮\n│\n│  ✅ User removed from moderators!\n│\n╰━━━━━━━━━━━━━━━━━━━╯'
    }, { quoted: msg });
};

const addguardian = async ({ sock, msg, from, sender, args, db, isOwner }) => {
    if (!isOwner) {
        return await sock.sendMessage(from, {
            text: '╭━━𖣔 𝗘𝗥𝗥𝗢𝗥 𖣔━━╮\n│\n│  ❌ Owner only command!\n│\n╰━━━━━━━━━━━━━━━━━━━╯'
        }, { quoted: msg });
    }

    const mentioned = msg.message?.extendedTextMessage?.contextInfo?.mentionedJid;
    if (!mentioned || mentioned.length === 0) {
        return await sock.sendMessage(from, {
            text: '╭━━𖣔 𝗘𝗥𝗥𝗢𝗥 𖣔━━╮\n│\n│  ❌ Please mention a user!\n│  Usage: .addguardian @user\n│\n╰━━━━━━━━━━━━━━━━━━━╯'
        }, { quoted: msg });
    }

    const userToAdd = mentioned[0];
    const modsRef = db.collection('settings').doc('mods');
    const modsDoc = await modsRef.get();
    const modsData = modsDoc.exists ? modsDoc.data() : { list: [], guardians: [] };
    
    if (modsData.guardians.includes(userToAdd)) {
        return await sock.sendMessage(from, {
            text: '╭━━𖣔 𝗘𝗥𝗥𝗢𝗥 𖣔━━╮\n│\n│  ❌ User is already a guardian!\n│\n╰━━━━━━━━━━━━━━━━━━━╯'
        }, { quoted: msg });
    }

    modsData.guardians.push(userToAdd);
    await modsRef.set(modsData, { merge: true });

    await sock.sendMessage(from, {
        text: '╭━━𖣔 𝗚𝗨𝗔𝗥𝗗𝗜𝗔𝗡 𝗔𝗗𝗗𝗘𝗗 𖣔━━╮\n│\n│  ✅ User added as guardian!\n│\n╰━━━━━━━━━━━━━━━━━━━╯'
    }, { quoted: msg });
};

const removeguardian = async ({ sock, msg, from, sender, args, db, isOwner }) => {
    if (!isOwner) {
        return await sock.sendMessage(from, {
            text: '╭━━𖣔 𝗘𝗥𝗥𝗢𝗥 𖣔━━╮\n│\n│  ❌ Owner only command!\n│\n╰━━━━━━━━━━━━━━━━━━━╯'
        }, { quoted: msg });
    }

    const mentioned = msg.message?.extendedTextMessage?.contextInfo?.mentionedJid;
    if (!mentioned || mentioned.length === 0) {
        return await sock.sendMessage(from, {
            text: '╭━━𖣔 𝗘𝗥𝗥𝗢𝗥 𖣔━━╮\n│\n│  ❌ Please mention a user!\n│  Usage: .removeguardian @user\n│\n╰━━━━━━━━━━━━━━━━━━━╯'
        }, { quoted: msg });
    }

    const userToRemove = mentioned[0];
    const modsRef = db.collection('settings').doc('mods');
    const modsDoc = await modsRef.get();
    const modsData = modsDoc.exists ? modsDoc.data() : { list: [], guardians: [] };
    
    if (!modsData.guardians.includes(userToRemove)) {
        return await sock.sendMessage(from, {
            text: '╭━━𖣔 𝗘𝗥𝗥𝗢𝗥 𖣔━━╮\n│\n│  ❌ User is not a guardian!\n│\n╰━━━━━━━━━━━━━━━━━━━╯'
        }, { quoted: msg });
    }

    modsData.guardians = modsData.guardians.filter(g => g !== userToRemove);
    await modsRef.set(modsData, { merge: true });

    await sock.sendMessage(from, {
        text: '╭━━𖣔 𝗚𝗨𝗔𝗥𝗗𝗜𝗔𝗡 𝗥𝗘𝗠𝗢𝗩𝗘𝗗 𖣔━━╮\n│\n│  ✅ User removed from guardians!\n│\n╰━━━━━━━━━━━━━━━━━━━╯'
    }, { quoted: msg });
};

const mods = async ({ sock, msg, from, db, OWNER }) => {
    const modsRef = db.collection('settings').doc('mods');
    const modsDoc = await modsRef.get();
    const modsData = modsDoc.exists ? modsDoc.data() : { list: [], guardians: [] };
    
    let modsText = `╭━━𖣔 𝗠𝗢𝗗𝗦 & 𝗚𝗨𝗔𝗥𝗗𝗜𝗔𝗡𝗦 𖣔━━╮
│
│  👑 𝗢𝘄𝗻𝗲𝗿:
│  ᯽ @${OWNER.split('@')[0]}
│\n`;

    if (modsData.list.length > 0) {
        modsText += `│  🛡️ 𝗠𝗼𝗱𝗲𝗿𝗮𝘁𝗼𝗿𝘀:\n`;
        modsData.list.forEach(mod => {
            modsText += `│  ᯽ @${mod.split('@')[0]}\n`;
        });
        modsText += `│\n`;
    } else {
        modsText += `│  🛡️ 𝗠𝗼𝗱𝗲𝗿𝗮𝘁𝗼𝗿𝘀: None\n│\n`;
    }

    if (modsData.guardians.length > 0) {
        modsText += `│  ⚔️ 𝗚𝘂𝗮𝗿𝗱𝗶𝗮𝗻𝘀:\n`;
        modsData.guardians.forEach(guardian => {
            modsText += `│  ᯽ @${guardian.split('@')[0]}\n`;
        });
    } else {
        modsText += `│  ⚔️ 𝗚𝘂𝗮𝗿𝗱𝗶𝗮𝗻𝘀: None\n`;
    }

    modsText += `╰━━━━━━━━━━━━━━━━━━━╯`;

    const mentions = [OWNER, ...modsData.list, ...modsData.guardians];

    await sock.sendMessage(from, {
        text: modsText,
        mentions: mentions
    }, { quoted: msg });
};

module.exports = {
    mode,
    addmod,
    removemod,
    addguardian,
    removeguardian,
    mods
};
