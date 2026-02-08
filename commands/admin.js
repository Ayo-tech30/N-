const { jidNormalizedUser } = require('@whiskeysockets/baileys');

const promote = async ({ sock, msg, from, isGroup, isBotAdmin, isUserAdmin, isMod, isGuardian }) => {
    if (!isGroup) {
        return await sock.sendMessage(from, {
            text: '╭━━𖣔 𝗘𝗥𝗥𝗢𝗥 𖣔━━╮\n│\n│  ❌ This command is for groups only!\n│\n╰━━━━━━━━━━━━━━━━━━━╯'
        }, { quoted: msg });
    }

    if (!isBotAdmin && !isUserAdmin && !isMod && !isGuardian) {
        return await sock.sendMessage(from, {
            text: '╭━━𖣔 𝗘𝗥𝗥𝗢𝗥 𖣔━━╮\n│\n│  ❌ You need admin privileges!\n│\n╰━━━━━━━━━━━━━━━━━━━╯'
        }, { quoted: msg });
    }

    const mentioned = msg.message?.extendedTextMessage?.contextInfo?.mentionedJid;
    if (!mentioned || mentioned.length === 0) {
        return await sock.sendMessage(from, {
            text: '╭━━𖣔 𝗘𝗥𝗥𝗢𝗥 𖣔━━╮\n│\n│  ❌ Please mention a user!\n│  Usage: .promote @user\n│\n╰━━━━━━━━━━━━━━━━━━━╯'
        }, { quoted: msg });
    }

    try {
        await sock.groupParticipantsUpdate(from, mentioned, 'promote');
        await sock.sendMessage(from, {
            text: '╭━━𖣔 𝗣𝗥𝗢𝗠𝗢𝗧𝗘𝗗 𖣔━━╮\n│\n│  ✅ User promoted to admin!\n│\n╰━━━━━━━━━━━━━━━━━━━╯'
        }, { quoted: msg });
    } catch (error) {
        await sock.sendMessage(from, {
            text: '╭━━𖣔 𝗘𝗥𝗥𝗢𝗥 𖣔━━╮\n│\n│  ❌ Failed to promote user!\n│  Make sure bot has admin rights.\n│\n╰━━━━━━━━━━━━━━━━━━━╯'
        }, { quoted: msg });
    }
};

const demote = async ({ sock, msg, from, isGroup, isBotAdmin, isUserAdmin, isMod, isGuardian }) => {
    if (!isGroup) {
        return await sock.sendMessage(from, {
            text: '╭━━𖣔 𝗘𝗥𝗥𝗢𝗥 𖣔━━╮\n│\n│  ❌ This command is for groups only!\n│\n╰━━━━━━━━━━━━━━━━━━━╯'
        }, { quoted: msg });
    }

    if (!isBotAdmin && !isUserAdmin && !isMod && !isGuardian) {
        return await sock.sendMessage(from, {
            text: '╭━━𖣔 𝗘𝗥𝗥𝗢𝗥 𖣔━━╮\n│\n│  ❌ You need admin privileges!\n│\n╰━━━━━━━━━━━━━━━━━━━╯'
        }, { quoted: msg });
    }

    const mentioned = msg.message?.extendedTextMessage?.contextInfo?.mentionedJid;
    if (!mentioned || mentioned.length === 0) {
        return await sock.sendMessage(from, {
            text: '╭━━𖣔 𝗘𝗥𝗥𝗢𝗥 𖣔━━╮\n│\n│  ❌ Please mention a user!\n│  Usage: .demote @user\n│\n╰━━━━━━━━━━━━━━━━━━━╯'
        }, { quoted: msg });
    }

    try {
        await sock.groupParticipantsUpdate(from, mentioned, 'demote');
        await sock.sendMessage(from, {
            text: '╭━━𖣔 𝗗𝗘𝗠𝗢𝗧𝗘𝗗 𖣔━━╮\n│\n│  ✅ User demoted from admin!\n│\n╰━━━━━━━━━━━━━━━━━━━╯'
        }, { quoted: msg });
    } catch (error) {
        await sock.sendMessage(from, {
            text: '╭━━𖣔 𝗘𝗥𝗥𝗢𝗥 𖣔━━╮\n│\n│  ❌ Failed to demote user!\n│\n╰━━━━━━━━━━━━━━━━━━━╯'
        }, { quoted: msg });
    }
};

const kick = async ({ sock, msg, from, isGroup, isBotAdmin, isUserAdmin, isMod, isGuardian }) => {
    if (!isGroup) {
        return await sock.sendMessage(from, {
            text: '╭━━𖣔 𝗘𝗥𝗥𝗢𝗥 𖣔━━╮\n│\n│  ❌ This command is for groups only!\n│\n╰━━━━━━━━━━━━━━━━━━━╯'
        }, { quoted: msg });
    }

    if (!isBotAdmin && !isUserAdmin && !isMod && !isGuardian) {
        return await sock.sendMessage(from, {
            text: '╭━━𖣔 𝗘𝗥𝗥𝗢𝗥 𖣔━━╮\n│\n│  ❌ You need admin privileges!\n│\n╰━━━━━━━━━━━━━━━━━━━╯'
        }, { quoted: msg });
    }

    const mentioned = msg.message?.extendedTextMessage?.contextInfo?.mentionedJid;
    if (!mentioned || mentioned.length === 0) {
        return await sock.sendMessage(from, {
            text: '╭━━𖣔 𝗘𝗥𝗥𝗢𝗥 𖣔━━╮\n│\n│  ❌ Please mention a user!\n│  Usage: .kick @user\n│\n╰━━━━━━━━━━━━━━━━━━━╯'
        }, { quoted: msg });
    }

    try {
        await sock.groupParticipantsUpdate(from, mentioned, 'remove');
        await sock.sendMessage(from, {
            text: '╭━━𖣔 𝗞𝗜𝗖𝗞𝗘𝗗 𖣔━━╮\n│\n│  ✅ User has been removed!\n│\n╰━━━━━━━━━━━━━━━━━━━╯'
        }, { quoted: msg });
    } catch (error) {
        await sock.sendMessage(from, {
            text: '╭━━𖣔 𝗘𝗥𝗥𝗢𝗥 𖣔━━╮\n│\n│  ❌ Failed to kick user!\n│\n╰━━━━━━━━━━━━━━━━━━━╯'
        }, { quoted: msg });
    }
};

const tagall = async ({ sock, msg, from, args, isGroup, groupMetadata, isBotAdmin, isUserAdmin, isMod, isGuardian }) => {
    if (!isGroup) {
        return await sock.sendMessage(from, {
            text: '╭━━𖣔 𝗘𝗥𝗥𝗢𝗥 𖣔━━╮\n│\n│  ❌ This command is for groups only!\n│\n╰━━━━━━━━━━━━━━━━━━━╯'
        }, { quoted: msg });
    }

    if (!isBotAdmin && !isUserAdmin && !isMod && !isGuardian) {
        return await sock.sendMessage(from, {
            text: '╭━━𖣔 𝗘𝗥𝗥𝗢𝗥 𖣔━━╮\n│\n│  ❌ You need admin privileges!\n│\n╰━━━━━━━━━━━━━━━━━━━╯'
        }, { quoted: msg });
    }

    const message = args.join(' ') || 'Attention Everyone!';
    const participants = groupMetadata.participants.map(p => p.id);

    let tagText = `╭━━𖣔 𝙂𝙍𝙊𝙐𝙋 𝙏𝘼𝙂 𖣔━━╮
│                       
│  📢 𝘼𝙉𝙉𝙊𝙐𝙉𝘾𝙀𝙈𝙀𝙉𝙏
│  
│  💬 𝙈𝙚𝙨𝙨𝙖𝙜𝙚:
│  ${message}
│
╰━━━━━━━━━━━━━━━━━━━╯

👥 𝙏𝘼𝙂𝙂𝙀𝘿 𝙈𝙀𝙈𝘽𝙀𝙍𝙎
━━━━━━━━━━━━━━━\n`;

    participants.forEach(p => {
        tagText += `᯽ @${p.split('@')[0]}\n`;
    });

    tagText += `━━━━━━━━━━━━━━━\n\n💜 𝙏𝙤𝙩𝙖𝙡: ${participants.length} 𝙈𝙚𝙢𝙗𝙚𝙧𝙨 𝙏𝙖𝙜𝙜𝙚𝙙`;

    await sock.sendMessage(from, {
        text: tagText,
        mentions: participants
    }, { quoted: msg });
};

const hidetag = async ({ sock, msg, from, args, isGroup, groupMetadata, isBotAdmin, isUserAdmin, isMod, isGuardian }) => {
    if (!isGroup) {
        return await sock.sendMessage(from, {
            text: '╭━━𖣔 𝗘𝗥𝗥𝗢𝗥 𖣔━━╮\n│\n│  ❌ This command is for groups only!\n│\n╰━━━━━━━━━━━━━━━━━━━╯'
        }, { quoted: msg });
    }

    if (!isBotAdmin && !isUserAdmin && !isMod && !isGuardian) {
        return await sock.sendMessage(from, {
            text: '╭━━𖣔 𝗘𝗥𝗥𝗢𝗥 𖣔━━╮\n│\n│  ❌ You need admin privileges!\n│\n╰━━━━━━━━━━━━━━━━━━━╯'
        }, { quoted: msg });
    }

    const message = args.join(' ') || 'Hidden Tag';
    const participants = groupMetadata.participants.map(p => p.id);

    await sock.sendMessage(from, {
        text: message,
        mentions: participants
    }, { quoted: msg });
};

const deleteMsg = async ({ sock, msg, from, isGroup, isBotAdmin, isUserAdmin, isMod, isGuardian }) => {
    if (!isGroup) {
        return await sock.sendMessage(from, {
            text: '╭━━𖣔 𝗘𝗥𝗥𝗢𝗥 𖣔━━╮\n│\n│  ❌ This command is for groups only!\n│\n╰━━━━━━━━━━━━━━━━━━━╯'
        }, { quoted: msg });
    }

    if (!isBotAdmin && !isUserAdmin && !isMod && !isGuardian) {
        return await sock.sendMessage(from, {
            text: '╭━━𖣔 𝗘𝗥𝗥𝗢𝗥 𖣔━━╮\n│\n│  ❌ You need admin privileges!\n│\n╰━━━━━━━━━━━━━━━━━━━╯'
        }, { quoted: msg });
    }

    if (!msg.message.extendedTextMessage) {
        return await sock.sendMessage(from, {
            text: '╭━━𖣔 𝗘𝗥𝗥𝗢𝗥 𖣔━━╮\n│\n│  ❌ Reply to a message to delete it!\n│\n╰━━━━━━━━━━━━━━━━━━━╯'
        }, { quoted: msg });
    }

    try {
        const quotedMsg = msg.message.extendedTextMessage.contextInfo;
        await sock.sendMessage(from, { delete: quotedMsg.stanzaId });
    } catch (error) {
        await sock.sendMessage(from, {
            text: '╭━━𖣔 𝗘𝗥𝗥𝗢𝗥 𖣔━━╮\n│\n│  ❌ Failed to delete message!\n│\n╰━━━━━━━━━━━━━━━━━━━╯'
        }, { quoted: msg });
    }
};

const groupinfo = async ({ sock, msg, from, isGroup, groupMetadata }) => {
    if (!isGroup) {
        return await sock.sendMessage(from, {
            text: '╭━━𖣔 𝗘𝗥𝗥𝗢𝗥 𖣔━━╮\n│\n│  ❌ This command is for groups only!\n│\n╰━━━━━━━━━━━━━━━━━━━╯'
        }, { quoted: msg });
    }

    const admins = groupMetadata.participants.filter(p => p.admin === 'admin' || p.admin === 'superadmin');
    
    const infoText = `╭━━𖣔 𝗚𝗥𝗢𝗨𝗣 𝗜𝗡𝗙𝗢 𖣔━━╮
│
│  📛 Name: ${groupMetadata.subject}
│  👥 Members: ${groupMetadata.participants.length}
│  👑 Admins: ${admins.length}
│  📝 Description:
│  ${groupMetadata.desc || 'No description'}
│
╰━━━━━━━━━━━━━━━━━━━╯`;

    await sock.sendMessage(from, { text: infoText }, { quoted: msg });
};

// Stub functions for other admin commands
const mute = async ({ sock, msg, from }) => {
    await sock.sendMessage(from, { text: '⏳ Coming Soon...' }, { quoted: msg });
};

const unmute = async ({ sock, msg, from }) => {
    await sock.sendMessage(from, { text: '⏳ Coming Soon...' }, { quoted: msg });
};

const warn = async ({ sock, msg, from }) => {
    await sock.sendMessage(from, { text: '⏳ Coming Soon...' }, { quoted: msg });
};

const warncount = async ({ sock, msg, from }) => {
    await sock.sendMessage(from, { text: '⏳ Coming Soon...' }, { quoted: msg });
};

const resetwarn = async ({ sock, msg, from }) => {
    await sock.sendMessage(from, { text: '⏳ Coming Soon...' }, { quoted: msg });
};

const welcome = async ({ sock, msg, from }) => {
    await sock.sendMessage(from, { text: '⏳ Coming Soon...' }, { quoted: msg });
};

const goodbye = async ({ sock, msg, from }) => {
    await sock.sendMessage(from, { text: '⏳ Coming Soon...' }, { quoted: msg });
};

const antilink = async ({ sock, msg, from }) => {
    await sock.sendMessage(from, { text: '⏳ Coming Soon...' }, { quoted: msg });
};

module.exports = {
    promote,
    demote,
    kick,
    tagall,
    hidetag,
    delete: deleteMsg,
    groupinfo,
    mute,
    unmute,
    warn,
    warncount,
    resetwarn,
    welcome,
    goodbye,
    antilink
};
