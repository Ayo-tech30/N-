const { jidNormalizedUser } = require('@whiskeysockets/baileys');

const profile = async ({ sock, msg, from, sender, args, db }) => {
    let targetUser = sender;
    
    // Check if user mentioned someone
    if (msg.message?.extendedTextMessage?.contextInfo?.mentionedJid?.length > 0) {
        targetUser = msg.message.extendedTextMessage.contextInfo.mentionedJid[0];
    }

    const userRef = db.collection('users').doc(targetUser);
    const userDoc = await userRef.get();

    if (!userDoc.exists) {
        return await sock.sendMessage(from, {
            text: '╭━━𖣔 𝗘𝗥𝗥𝗢𝗥 𖣔━━╮\n│\n│  ❌ User not registered!\n│\n╰━━━━━━━━━━━━━━━━━━━╯'
        }, { quoted: msg });
    }

    const userData = userDoc.data();
    const profileText = `╭━━𖣔 𝗣𝗥𝗢𝗙𝗜𝗟𝗘 𖣔━━╮
│
│  👤 Name: ${userData.name}
│  🎂 Age: ${userData.age}
│  💬 Bio: ${userData.bio}
│  💰 Wallet: ${userData.wallet}
│  🏦 Bank: ${userData.bank}
│  🎴 Cards: ${userData.cards?.length || 0}
│  📊 Level: ${userData.level}
│  ⭐ XP: ${userData.xp}
│
╰━━━━━━━━━━━━━━━━━━━╯`;

    await sock.sendMessage(from, { text: profileText }, { quoted: msg });
};

const setprofile = async ({ sock, msg, from, sender, db, messageType }) => {
    if (messageType !== 'imageMessage') {
        return await sock.sendMessage(from, {
            text: '╭━━𖣔 𝗘𝗥𝗥𝗢𝗥 𖣔━━╮\n│\n│  ❌ Please send an image!\n│  Use: Send image with caption .setprofile\n│\n╰━━━━━━━━━━━━━━━━━━━╯'
        }, { quoted: msg });
    }

    await sock.sendMessage(from, {
        text: '╭━━𖣔 𝗣𝗥𝗢𝗙𝗜𝗟𝗘 𝗨𝗣𝗗𝗔𝗧𝗘𝗗 𖣔━━╮\n│\n│  ✅ Profile picture updated!\n│\n╰━━━━━━━━━━━━━━━━━━━╯'
    }, { quoted: msg });
};

const setprofilequote = async ({ sock, msg, from, sender, args, db }) => {
    if (args.length === 0) {
        return await sock.sendMessage(from, {
            text: '╭━━𖣔 𝗘𝗥𝗥𝗢𝗥 𖣔━━╮\n│\n│  ❌ Please provide a quote!\n│  Usage: .setprofilequote <text>\n│\n╰━━━━━━━━━━━━━━━━━━━╯'
        }, { quoted: msg });
    }

    const quote = args.join(' ');
    const userRef = db.collection('users').doc(sender);
    
    await userRef.update({ bio: quote });

    await sock.sendMessage(from, {
        text: `╭━━𖣔 𝗕𝗜𝗢 𝗨𝗣𝗗𝗔𝗧𝗘𝗗 𖣔━━╮
│
│  ✅ Bio updated!
│  💬 New Bio: ${quote}
│
╰━━━━━━━━━━━━━━━━━━━╯`
    }, { quoted: msg });
};

const setage = async ({ sock, msg, from, sender, args, db }) => {
    if (args.length === 0 || isNaN(args[0])) {
        return await sock.sendMessage(from, {
            text: '╭━━𖣔 𝗘𝗥𝗥𝗢𝗥 𖣔━━╮\n│\n│  ❌ Please provide a valid age!\n│  Usage: .setage <number>\n│\n╰━━━━━━━━━━━━━━━━━━━╯'
        }, { quoted: msg });
    }

    const age = parseInt(args[0]);
    if (age < 1 || age > 120) {
        return await sock.sendMessage(from, {
            text: '╭━━𖣔 𝗘𝗥𝗥𝗢𝗥 𖣔━━╮\n│\n│  ❌ Age must be between 1-120!\n│\n╰━━━━━━━━━━━━━━━━━━━╯'
        }, { quoted: msg });
    }

    const userRef = db.collection('users').doc(sender);
    await userRef.update({ age });

    await sock.sendMessage(from, {
        text: `╭━━𖣔 𝗔𝗚𝗘 𝗨𝗣𝗗𝗔𝗧𝗘𝗗 𖣔━━╮
│
│  ✅ Age updated!
│  🎂 New Age: ${age}
│
╰━━━━━━━━━━━━━━━━━━━╯`
    }, { quoted: msg });
};

const setname = async ({ sock, msg, from, sender, args, db }) => {
    if (args.length === 0) {
        return await sock.sendMessage(from, {
            text: '╭━━𖣔 𝗘𝗥𝗥𝗢𝗥 𖣔━━╮\n│\n│  ❌ Please provide a name!\n│  Usage: .setname <name>\n│\n╰━━━━━━━━━━━━━━━━━━━╯'
        }, { quoted: msg });
    }

    const name = args.join(' ');
    const userRef = db.collection('users').doc(sender);
    
    await userRef.update({ name });

    await sock.sendMessage(from, {
        text: `╭━━𖣔 𝗡𝗔𝗠𝗘 𝗨𝗣𝗗𝗔𝗧𝗘𝗗 𖣔━━╮
│
│  ✅ Name updated!
│  👤 New Name: ${name}
│
╰━━━━━━━━━━━━━━━━━━━╯`
    }, { quoted: msg });
};

module.exports = {
    p: profile,
    profile,
    setprofile,
    setp: setprofile,
    setprofilequote,
    setage,
    setname
};
