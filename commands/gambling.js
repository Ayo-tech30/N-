const gamble = async ({ sock, msg, from, sender, args, db }) => {
    if (args.length === 0 || isNaN(args[0])) {
        return await sock.sendMessage(from, {
            text: '╭━━𖣔 𝗘𝗥𝗥𝗢𝗥 𖣔━━╮\n│\n│  ❌ Please provide amount!\n│  Usage: .gamble <amount>\n│\n╰━━━━━━━━━━━━━━━━━━━╯'
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
            text: '╭━━𖣔 𝗘𝗥𝗥𝗢𝗥 𖣔━━╮\n│\n│  ❌ Insufficient balance!\n│\n╰━━━━━━━━━━━━━━━━━━━╯'
        }, { quoted: msg });
    }

    const win = Math.random() > 0.5;
    
    if (win) {
        await userRef.update({ wallet: userData.wallet + amount });
        await sock.sendMessage(from, {
            text: `╭━━𖣔 𝗚𝗔𝗠𝗕𝗟𝗘 𝗪𝗜𝗡 𖣔━━╮
│
│  🎉 You Won!
│  💰 Profit: +${amount} coins
│  💰 New Balance: ${userData.wallet + amount}
│
╰━━━━━━━━━━━━━━━━━━━╯`
        }, { quoted: msg });
    } else {
        await userRef.update({ wallet: userData.wallet - amount });
        await sock.sendMessage(from, {
            text: `╭━━𖣔 𝗚𝗔𝗠𝗕𝗟𝗘 𝗟𝗢𝗦𝗦 𖣔━━╮
│
│  😢 You Lost!
│  💸 Loss: -${amount} coins
│  💰 New Balance: ${userData.wallet - amount}
│
╰━━━━━━━━━━━━━━━━━━━╯`
        }, { quoted: msg });
    }
};

const slots = async ({ sock, msg, from, sender, args, db }) => {
    if (args.length === 0 || isNaN(args[0])) {
        return await sock.sendMessage(from, {
            text: '╭━━𖣔 𝗘𝗥𝗥𝗢𝗥 𖣔━━╮\n│\n│  ❌ Please provide amount!\n│  Usage: .slots <amount>\n│\n╰━━━━━━━━━━━━━━━━━━━╯'
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
            text: '╭━━𖣔 𝗘𝗥𝗥𝗢𝗥 𖣔━━╮\n│\n│  ❌ Insufficient balance!\n│\n╰━━━━━━━━━━━━━━━━━━━╯'
        }, { quoted: msg });
    }

    const symbols = ['🍒', '🍋', '🍊', '🍇', '💎', '7️⃣'];
    const slot1 = symbols[Math.floor(Math.random() * symbols.length)];
    const slot2 = symbols[Math.floor(Math.random() * symbols.length)];
    const slot3 = symbols[Math.floor(Math.random() * symbols.length)];

    let multiplier = 0;
    if (slot1 === slot2 && slot2 === slot3) {
        if (slot1 === '7️⃣') multiplier = 10;
        else if (slot1 === '💎') multiplier = 5;
        else multiplier = 3;
    } else if (slot1 === slot2 || slot2 === slot3 || slot1 === slot3) {
        multiplier = 1.5;
    }

    const winnings = Math.floor(amount * multiplier) - amount;
    
    await userRef.update({ wallet: userData.wallet + winnings });

    await sock.sendMessage(from, {
        text: `╭━━𖣔 𝗦𝗟𝗢𝗧𝗦 𖣔━━╮
│
│  🎰 [ ${slot1} ${slot2} ${slot3} ]
│
│  ${winnings > 0 ? '🎉 Winner!' : winnings === 0 ? '😐 No Win' : '😢 Lost!'}
│  💰 ${winnings > 0 ? '+' : ''}${winnings} coins
│  💰 New Balance: ${userData.wallet + winnings}
│
╰━━━━━━━━━━━━━━━━━━━╯`
    }, { quoted: msg });
};

const coinflip = async ({ sock, msg, from, sender, args, db }) => {
    if (args.length < 2) {
        return await sock.sendMessage(from, {
            text: '╭━━𖣔 𝗘𝗥𝗥𝗢𝗥 𖣔━━╮\n│\n│  ❌ Usage: .coinflip <amount> <heads/tails>\n│\n╰━━━━━━━━━━━━━━━━━━━╯'
        }, { quoted: msg });
    }

    const amount = parseInt(args[0]);
    const choice = args[1].toLowerCase();

    if (isNaN(amount) || amount <= 0) {
        return await sock.sendMessage(from, {
            text: '╭━━𖣔 𝗘𝗥𝗥𝗢𝗥 𖣔━━╮\n│\n│  ❌ Invalid amount!\n│\n╰━━━━━━━━━━━━━━━━━━━╯'
        }, { quoted: msg });
    }

    if (choice !== 'heads' && choice !== 'tails') {
        return await sock.sendMessage(from, {
            text: '╭━━𖣔 𝗘𝗥𝗥𝗢𝗥 𖣔━━╮\n│\n│  ❌ Choose heads or tails!\n│\n╰━━━━━━━━━━━━━━━━━━━╯'
        }, { quoted: msg });
    }

    const userRef = db.collection('users').doc(sender);
    const userDoc = await userRef.get();
    const userData = userDoc.data();

    if (userData.wallet < amount) {
        return await sock.sendMessage(from, {
            text: '╭━━𖣔 𝗘𝗥𝗥𝗢𝗥 𖣔━━╮\n│\n│  ❌ Insufficient balance!\n│\n╰━━━━━━━━━━━━━━━━━━━╯'
        }, { quoted: msg });
    }

    const result = Math.random() > 0.5 ? 'heads' : 'tails';
    const win = result === choice;

    if (win) {
        await userRef.update({ wallet: userData.wallet + amount });
        await sock.sendMessage(from, {
            text: `╭━━𖣔 𝗖𝗢𝗜𝗡𝗙𝗟𝗜𝗣 𖣔━━╮
│
│  🪙 Result: ${result.toUpperCase()}
│  🎉 You Won!
│  💰 Profit: +${amount} coins
│  💰 New Balance: ${userData.wallet + amount}
│
╰━━━━━━━━━━━━━━━━━━━╯`
        }, { quoted: msg });
    } else {
        await userRef.update({ wallet: userData.wallet - amount });
        await sock.sendMessage(from, {
            text: `╭━━𖣔 𝗖𝗢𝗜𝗡𝗙𝗟𝗜𝗣 𖣔━━╮
│
│  🪙 Result: ${result.toUpperCase()}
│  😢 You Lost!
│  💸 Loss: -${amount} coins
│  💰 New Balance: ${userData.wallet - amount}
│
╰━━━━━━━━━━━━━━━━━━━╯`
        }, { quoted: msg });
    }
};

const dice = async ({ sock, msg, from, sender, args, db }) => {
    if (args.length === 0 || isNaN(args[0])) {
        return await sock.sendMessage(from, {
            text: '╭━━𖣔 𝗘𝗥𝗥𝗢𝗥 𖣔━━╮\n│\n│  ❌ Please provide amount!\n│  Usage: .dice <amount>\n│\n╰━━━━━━━━━━━━━━━━━━━╯'
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
            text: '╭━━𖣔 𝗘𝗥𝗥𝗢𝗥 𖣔━━╮\n│\n│  ❌ Insufficient balance!\n│\n╰━━━━━━━━━━━━━━━━━━━╯'
        }, { quoted: msg });
    }

    const roll = Math.floor(Math.random() * 6) + 1;
    const win = roll >= 4; // Win on 4, 5, or 6

    if (win) {
        const winnings = Math.floor(amount * 1.5);
        await userRef.update({ wallet: userData.wallet + winnings - amount });
        await sock.sendMessage(from, {
            text: `╭━━𖣔 𝗗𝗜𝗖𝗘 𖣔━━╮
│
│  🎲 You rolled: ${roll}
│  🎉 You Won!
│  💰 Profit: +${winnings - amount} coins
│  💰 New Balance: ${userData.wallet + winnings - amount}
│
╰━━━━━━━━━━━━━━━━━━━╯`
        }, { quoted: msg });
    } else {
        await userRef.update({ wallet: userData.wallet - amount });
        await sock.sendMessage(from, {
            text: `╭━━𖣔 𝗗𝗜𝗖𝗘 𖣔━━╮
│
│  🎲 You rolled: ${roll}
│  😢 You Lost!
│  💸 Loss: -${amount} coins
│  💰 New Balance: ${userData.wallet - amount}
│
╰━━━━━━━━━━━━━━━━━━━╯`
        }, { quoted: msg });
    }
};

// Stub functions for other gambling games
const roulette = async ({ sock, msg, from }) => {
    await sock.sendMessage(from, { text: '⏳ Coming Soon...' }, { quoted: msg });
};

const blackjack = async ({ sock, msg, from }) => {
    await sock.sendMessage(from, { text: '⏳ Coming Soon...' }, { quoted: msg });
};

const lottery = async ({ sock, msg, from }) => {
    await sock.sendMessage(from, { text: '⏳ Coming Soon...' }, { quoted: msg });
};

const jackpot = async ({ sock, msg, from }) => {
    await sock.sendMessage(from, { text: '⏳ Coming Soon...' }, { quoted: msg });
};

const crash = async ({ sock, msg, from }) => {
    await sock.sendMessage(from, { text: '⏳ Coming Soon...' }, { quoted: msg });
};

const race = async ({ sock, msg, from }) => {
    await sock.sendMessage(from, { text: '⏳ Coming Soon...' }, { quoted: msg });
};

const wheel = async ({ sock, msg, from }) => {
    await sock.sendMessage(from, { text: '⏳ Coming Soon...' }, { quoted: msg });
};

const poker = async ({ sock, msg, from }) => {
    await sock.sendMessage(from, { text: '⏳ Coming Soon...' }, { quoted: msg });
};

const mines = async ({ sock, msg, from }) => {
    await sock.sendMessage(from, { text: '⏳ Coming Soon...' }, { quoted: msg });
};

const plinko = async ({ sock, msg, from }) => {
    await sock.sendMessage(from, { text: '⏳ Coming Soon...' }, { quoted: msg });
};

const limbo = async ({ sock, msg, from }) => {
    await sock.sendMessage(from, { text: '⏳ Coming Soon...' }, { quoted: msg });
};

module.exports = {
    gamble,
    slots,
    roulette,
    blackjack,
    coinflip,
    dice,
    lottery,
    jackpot,
    crash,
    race,
    wheel,
    poker,
    mines,
    plinko,
    limbo
};
