const moment = require('moment-timezone');

const accbal = async ({ sock, msg, from, sender, args, db }) => {
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
    
    const balText = `╭━━𖣔 𝗕𝗔𝗟𝗔𝗡𝗖𝗘 𖣔━━╮
│
│  💰 Wallet: ${userData.wallet || 0} coins
│  🏦 Bank: ${userData.bank || 0} coins
│  💎 Total: ${(userData.wallet || 0) + (userData.bank || 0)} coins
│
╰━━━━━━━━━━━━━━━━━━━╯`;

    await sock.sendMessage(from, { text: balText }, { quoted: msg });
};

const deposit = async ({ sock, msg, from, sender, args, db }) => {
    if (args.length === 0 || isNaN(args[0])) {
        return await sock.sendMessage(from, {
            text: '╭━━𖣔 𝗘𝗥𝗥𝗢𝗥 𖣔━━╮\n│\n│  ❌ Please provide amount!\n│  Usage: .deposit <amount>\n│\n╰━━━━━━━━━━━━━━━━━━━╯'
        }, { quoted: msg });
    }

    const amount = parseInt(args[0]);
    const userRef = db.collection('users').doc(sender);
    const userDoc = await userRef.get();
    const userData = userDoc.data();

    if (amount <= 0) {
        return await sock.sendMessage(from, {
            text: '╭━━𖣔 𝗘𝗥𝗥𝗢𝗥 𖣔━━╮\n│\n│  ❌ Amount must be positive!\n│\n╰━━━━━━━━━━━━━━━━━━━╯'
        }, { quoted: msg });
    }

    if (userData.wallet < amount) {
        return await sock.sendMessage(from, {
            text: '╭━━𖣔 𝗘𝗥𝗥𝗢𝗥 𖣔━━╮\n│\n│  ❌ Insufficient wallet balance!\n│\n╰━━━━━━━━━━━━━━━━━━━╯'
        }, { quoted: msg });
    }

    await userRef.update({
        wallet: userData.wallet - amount,
        bank: (userData.bank || 0) + amount
    });

    await sock.sendMessage(from, {
        text: `╭━━𖣔 𝗗𝗘𝗣𝗢𝗦𝗜𝗧 𖣔━━╮
│
│  ✅ Deposited ${amount} coins
│  💰 New Wallet: ${userData.wallet - amount}
│  🏦 New Bank: ${(userData.bank || 0) + amount}
│
╰━━━━━━━━━━━━━━━━━━━╯`
    }, { quoted: msg });
};

const withdraw = async ({ sock, msg, from, sender, args, db }) => {
    if (args.length === 0 || isNaN(args[0])) {
        return await sock.sendMessage(from, {
            text: '╭━━𖣔 𝗘𝗥𝗥𝗢𝗥 𖣔━━╮\n│\n│  ❌ Please provide amount!\n│  Usage: .withdraw <amount>\n│\n╰━━━━━━━━━━━━━━━━━━━╯'
        }, { quoted: msg });
    }

    const amount = parseInt(args[0]);
    const userRef = db.collection('users').doc(sender);
    const userDoc = await userRef.get();
    const userData = userDoc.data();

    if (amount <= 0) {
        return await sock.sendMessage(from, {
            text: '╭━━𖣔 𝗘𝗥𝗥𝗢𝗥 𖣔━━╮\n│\n│  ❌ Amount must be positive!\n│\n╰━━━━━━━━━━━━━━━━━━━╯'
        }, { quoted: msg });
    }

    if ((userData.bank || 0) < amount) {
        return await sock.sendMessage(from, {
            text: '╭━━𖣔 𝗘𝗥𝗥𝗢𝗥 𖣔━━╮\n│\n│  ❌ Insufficient bank balance!\n│\n╰━━━━━━━━━━━━━━━━━━━╯'
        }, { quoted: msg });
    }

    await userRef.update({
        wallet: userData.wallet + amount,
        bank: userData.bank - amount
    });

    await sock.sendMessage(from, {
        text: `╭━━𖣔 𝗪𝗜𝗧𝗛𝗗𝗥𝗔𝗪 𖣔━━╮
│
│  ✅ Withdrew ${amount} coins
│  💰 New Wallet: ${userData.wallet + amount}
│  🏦 New Bank: ${userData.bank - amount}
│
╰━━━━━━━━━━━━━━━━━━━╯`
    }, { quoted: msg });
};

const daily = async ({ sock, msg, from, sender, db }) => {
    const userRef = db.collection('users').doc(sender);
    const userDoc = await userRef.get();
    const userData = userDoc.data();

    const now = Date.now();
    const lastDaily = userData.lastDaily || 0;
    const cooldown = 24 * 60 * 60 * 1000; // 24 hours

    if (now - lastDaily < cooldown) {
        const timeLeft = cooldown - (now - lastDaily);
        const hours = Math.floor(timeLeft / (60 * 60 * 1000));
        const minutes = Math.floor((timeLeft % (60 * 60 * 1000)) / (60 * 1000));
        
        return await sock.sendMessage(from, {
            text: `╭━━𖣔 𝗖𝗢𝗢𝗟𝗗𝗢𝗪𝗡 𖣔━━╮
│
│  ⏰ Daily reward claimed!
│  ⏳ Next in: ${hours}h ${minutes}m
│
╰━━━━━━━━━━━━━━━━━━━╯`
        }, { quoted: msg });
    }

    const reward = 500 + Math.floor(Math.random() * 500);
    
    await userRef.update({
        wallet: userData.wallet + reward,
        lastDaily: now
    });

    await sock.sendMessage(from, {
        text: `╭━━𖣔 𝗗𝗔𝗜𝗟𝗬 𝗥𝗘𝗪𝗔𝗥𝗗 𖣔━━╮
│
│  ✅ Daily reward claimed!
│  💰 Received: ${reward} coins
│  💰 New Balance: ${userData.wallet + reward}
│
╰━━━━━━━━━━━━━━━━━━━╯`
    }, { quoted: msg });
};

const weekly = async ({ sock, msg, from, sender, db }) => {
    const userRef = db.collection('users').doc(sender);
    const userDoc = await userRef.get();
    const userData = userDoc.data();

    const now = Date.now();
    const lastWeekly = userData.lastWeekly || 0;
    const cooldown = 7 * 24 * 60 * 60 * 1000; // 7 days

    if (now - lastWeekly < cooldown) {
        const timeLeft = cooldown - (now - lastWeekly);
        const days = Math.floor(timeLeft / (24 * 60 * 60 * 1000));
        const hours = Math.floor((timeLeft % (24 * 60 * 60 * 1000)) / (60 * 60 * 1000));
        
        return await sock.sendMessage(from, {
            text: `╭━━𖣔 𝗖𝗢𝗢𝗟𝗗𝗢𝗪𝗡 𖣔━━╮
│
│  ⏰ Weekly reward claimed!
│  ⏳ Next in: ${days}d ${hours}h
│
╰━━━━━━━━━━━━━━━━━━━╯`
        }, { quoted: msg });
    }

    const reward = 2500 + Math.floor(Math.random() * 2500);
    
    await userRef.update({
        wallet: userData.wallet + reward,
        lastWeekly: now
    });

    await sock.sendMessage(from, {
        text: `╭━━𖣔 𝗪𝗘𝗘𝗞𝗟𝗬 𝗥𝗘𝗪𝗔𝗥𝗗 𖣔━━╮
│
│  ✅ Weekly reward claimed!
│  💰 Received: ${reward} coins
│  💰 New Balance: ${userData.wallet + reward}
│
╰━━━━━━━━━━━━━━━━━━━╯`
    }, { quoted: msg });
};

const monthly = async ({ sock, msg, from, sender, db }) => {
    const userRef = db.collection('users').doc(sender);
    const userDoc = await userRef.get();
    const userData = userDoc.data();

    const now = Date.now();
    const lastMonthly = userData.lastMonthly || 0;
    const cooldown = 30 * 24 * 60 * 60 * 1000; // 30 days

    if (now - lastMonthly < cooldown) {
        const timeLeft = cooldown - (now - lastMonthly);
        const days = Math.floor(timeLeft / (24 * 60 * 60 * 1000));
        
        return await sock.sendMessage(from, {
            text: `╭━━𖣔 𝗖𝗢𝗢𝗟𝗗𝗢𝗪𝗡 𖣔━━╮
│
│  ⏰ Monthly reward claimed!
│  ⏳ Next in: ${days} days
│
╰━━━━━━━━━━━━━━━━━━━╯`
        }, { quoted: msg });
    }

    const reward = 10000 + Math.floor(Math.random() * 10000);
    
    await userRef.update({
        wallet: userData.wallet + reward,
        lastMonthly: now
    });

    await sock.sendMessage(from, {
        text: `╭━━𖣔 𝗠𝗢𝗡𝗧𝗛𝗟𝗬 𝗥𝗘𝗪𝗔𝗥𝗗 𖣔━━╮
│
│  ✅ Monthly reward claimed!
│  💰 Received: ${reward} coins
│  💰 New Balance: ${userData.wallet + reward}
│
╰━━━━━━━━━━━━━━━━━━━╯`
    }, { quoted: msg });
};

const work = async ({ sock, msg, from, sender, db }) => {
    const userRef = db.collection('users').doc(sender);
    const userDoc = await userRef.get();
    const userData = userDoc.data();

    const now = Date.now();
    const lastWork = userData.lastWork || 0;
    const cooldown = 60 * 60 * 1000; // 1 hour

    if (now - lastWork < cooldown) {
        const timeLeft = cooldown - (now - lastWork);
        const minutes = Math.floor(timeLeft / (60 * 1000));
        
        return await sock.sendMessage(from, {
            text: `╭━━𖣔 𝗖𝗢𝗢𝗟𝗗𝗢𝗪𝗡 𖣔━━╮
│
│  ⏰ You already worked!
│  ⏳ Next in: ${minutes} minutes
│
╰━━━━━━━━━━━━━━━━━━━╯`
        }, { quoted: msg });
    }

    const jobs = ['Developer', 'Designer', 'Writer', 'Trader', 'Chef', 'Driver'];
    const job = jobs[Math.floor(Math.random() * jobs.length)];
    const reward = 100 + Math.floor(Math.random() * 200);
    
    await userRef.update({
        wallet: userData.wallet + reward,
        lastWork: now
    });

    await sock.sendMessage(from, {
        text: `╭━━𖣔 𝗪𝗢𝗥𝗞 𝗥𝗘𝗪𝗔𝗥𝗗 𖣔━━╮
│
│  💼 Job: ${job}
│  💰 Earned: ${reward} coins
│  💰 New Balance: ${userData.wallet + reward}
│
╰━━━━━━━━━━━━━━━━━━━╯`
    }, { quoted: msg });
};

// Stub functions
const send = async ({ sock, msg, from }) => {
    await sock.sendMessage(from, { text: '⏳ Coming Soon...' }, { quoted: msg });
};

const inv = async ({ sock, msg, from }) => {
    await sock.sendMessage(from, { text: '⏳ Coming Soon...' }, { quoted: msg });
};

const rob = async ({ sock, msg, from }) => {
    await sock.sendMessage(from, { text: '⏳ Coming Soon...' }, { quoted: msg });
};

module.exports = {
    accbal,
    deposit,
    withdraw,
    send,
    daily,
    weekly,
    monthly,
    inv,
    work,
    rob
};
