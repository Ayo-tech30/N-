const fs = require('fs-extra');
const path = require('path');

const mycards = async ({ sock, msg, from, sender, db }) => {
    const userRef = db.collection('users').doc(sender);
    const userDoc = await userRef.get();
    const userData = userDoc.data();
    
    const cards = userData.cards || [];
    
    if (cards.length === 0) {
        return await sock.sendMessage(from, {
            text: '╭━━𖣔 𝗠𝗬 𝗖𝗔𝗥𝗗𝗦 𖣔━━╮\n│\n│  🎴 You have no cards!\n│  Use .rollcard to get cards\n│\n╰━━━━━━━━━━━━━━━━━━━╯'
        }, { quoted: msg });
    }

    let cardText = `╭━━𖣔 𝗠𝗬 𝗖𝗔𝗥𝗗𝗦 𖣔━━╮\n│\n│  🎴 Total Cards: ${cards.length}\n│\n`;
    
    cards.forEach((card, index) => {
        cardText += `│  ${index + 1}. ${card.name} (${card.rarity})\n`;
    });
    
    cardText += `│\n╰━━━━━━━━━━━━━━━━━━━╯`;

    await sock.sendMessage(from, { text: cardText }, { quoted: msg });
};

const rollcard = async ({ sock, msg, from, sender, db, isGroup, messageType }) => {
    if (!isGroup) {
        return await sock.sendMessage(from, {
            text: '╭━━𖣔 𝗘𝗥𝗥𝗢𝗥 𖣔━━╮\n│\n│  ❌ This command is for groups only!\n│\n╰━━━━━━━━━━━━━━━━━━━╯'
        }, { quoted: msg });
    }

    // Check if group has card spawning enabled
    const groupRef = db.collection('groups').doc(from);
    const groupDoc = await groupRef.get();
    const groupData = groupDoc.exists ? groupDoc.data() : {};
    
    if (!groupData.cardsEnabled) {
        return await sock.sendMessage(from, {
            text: '╭━━𖣔 𝗘𝗥𝗥𝗢𝗥 𖣔━━╮\n│\n│  ❌ Card spawning is disabled!\n│  Admin use: .cards on\n│\n╰━━━━━━━━━━━━━━━━━━━╯'
        }, { quoted: msg });
    }

    // If user uploaded an image with the command, use that as a card
    if (messageType === 'imageMessage') {
        try {
            const buffer = await sock.downloadMediaMessage(msg);
            
            // Generate random card properties
            const rarities = ['Common', 'Rare', 'Epic', 'Legendary'];
            const rarity = rarities[Math.floor(Math.random() * rarities.length)];
            const cardId = Date.now().toString();
            
            const card = {
                id: cardId,
                name: `Card-${cardId.slice(-6)}`,
                rarity: rarity,
                value: rarity === 'Common' ? 100 : rarity === 'Rare' ? 500 : rarity === 'Epic' ? 2000 : 5000,
                image: buffer.toString('base64')
            };

            // Save card to group's spawned cards
            await groupRef.update({
                currentCard: card,
                cardSpawnTime: Date.now()
            });

            await sock.sendMessage(from, {
                image: buffer,
                caption: `╭━━𖣔 𝗖𝗔𝗥𝗗 𝗦𝗣𝗔𝗪𝗡𝗘𝗗 𖣔━━╮
│
│  🎴 ${card.name}
│  ⭐ Rarity: ${card.rarity}
│  💰 Value: ${card.value}
│
│  Use .get ${card.id} to claim!
│
╰━━━━━━━━━━━━━━━━━━━╯`
            }, { quoted: msg });

        } catch (error) {
            console.error('Error processing card image:', error);
            await sock.sendMessage(from, {
                text: '╭━━𖣔 𝗘𝗥𝗥𝗢𝗥 𖣔━━╮\n│\n│  ❌ Failed to process card image!\n│\n╰━━━━━━━━━━━━━━━━━━━╯'
            }, { quoted: msg });
        }
    } else {
        // Random card spawn without image
        const rarities = ['Common', 'Rare', 'Epic', 'Legendary'];
        const rarity = rarities[Math.floor(Math.random() * rarities.length)];
        const cardId = Date.now().toString();
        
        const card = {
            id: cardId,
            name: `Card-${cardId.slice(-6)}`,
            rarity: rarity,
            value: rarity === 'Common' ? 100 : rarity === 'Rare' ? 500 : rarity === 'Epic' ? 2000 : 5000
        };

        await groupRef.update({
            currentCard: card,
            cardSpawnTime: Date.now()
        });

        await sock.sendMessage(from, {
            text: `╭━━𖣔 𝗖𝗔𝗥𝗗 𝗦𝗣𝗔𝗪𝗡𝗘𝗗 𖣔━━╮
│
│  🎴 ${card.name}
│  ⭐ Rarity: ${card.rarity}
│  💰 Value: ${card.value}
│
│  Use .get ${card.id} to claim!
│
╰━━━━━━━━━━━━━━━━━━━╯`
        }, { quoted: msg });
    }
};

const getCard = async ({ sock, msg, from, sender, args, db, isGroup }) => {
    if (!isGroup) {
        return await sock.sendMessage(from, {
            text: '╭━━𖣔 𝗘𝗥𝗥𝗢𝗥 𖣔━━╮\n│\n│  ❌ This command is for groups only!\n│\n╰━━━━━━━━━━━━━━━━━━━╯'
        }, { quoted: msg });
    }

    if (args.length === 0) {
        return await sock.sendMessage(from, {
            text: '╭━━𖣔 𝗘𝗥𝗥𝗢𝗥 𖣔━━╮\n│\n│  ❌ Please provide card ID!\n│  Usage: .get <id>\n│\n╰━━━━━━━━━━━━━━━━━━━╯'
        }, { quoted: msg });
    }

    const cardId = args[0];
    const groupRef = db.collection('groups').doc(from);
    const groupDoc = await groupRef.get();
    
    if (!groupDoc.exists || !groupDoc.data().currentCard) {
        return await sock.sendMessage(from, {
            text: '╭━━𖣔 𝗘𝗥𝗥𝗢𝗥 𖣔━━╮\n│\n│  ❌ No card available!\n│\n╰━━━━━━━━━━━━━━━━━━━╯'
        }, { quoted: msg });
    }

    const currentCard = groupDoc.data().currentCard;
    
    if (currentCard.id !== cardId) {
        return await sock.sendMessage(from, {
            text: '╭━━𖣔 𝗘𝗥𝗥𝗢𝗥 𖣔━━╮\n│\n│  ❌ Invalid card ID!\n│\n╰━━━━━━━━━━━━━━━━━━━╯'
        }, { quoted: msg });
    }

    // Add card to user's collection
    const userRef = db.collection('users').doc(sender);
    const userDoc = await userRef.get();
    const userData = userDoc.data();
    const cards = userData.cards || [];
    
    cards.push(currentCard);
    await userRef.update({ cards });

    // Clear current card
    await groupRef.update({ currentCard: null });

    await sock.sendMessage(from, {
        text: `╭━━𖣔 𝗖𝗔𝗥𝗗 𝗖𝗟𝗔𝗜𝗠𝗘𝗗 𖣔━━╮
│
│  ✅ Card claimed successfully!
│  🎴 ${currentCard.name}
│  ⭐ Rarity: ${currentCard.rarity}
│  💰 Value: ${currentCard.value}
│
╰━━━━━━━━━━━━━━━━━━━╯`
    }, { quoted: msg });
};

const enableCards = async ({ sock, msg, from, isGroup, isBotAdmin, isUserAdmin, isMod, isGuardian, args, db }) => {
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

    const mode = args[0]?.toLowerCase();
    
    if (mode !== 'on' && mode !== 'off') {
        return await sock.sendMessage(from, {
            text: '╭━━𖣔 𝗘𝗥𝗥𝗢𝗥 𖣔━━╮\n│\n│  ❌ Usage: .cards <on/off>\n│\n╰━━━━━━━━━━━━━━━━━━━╯'
        }, { quoted: msg });
    }

    const groupRef = db.collection('groups').doc(from);
    await groupRef.set({ cardsEnabled: mode === 'on' }, { merge: true });

    await sock.sendMessage(from, {
        text: `╭━━𖣔 𝗖𝗔𝗥𝗗𝗦 𝗦𝗘𝗧𝗧𝗜𝗡𝗚 𖣔━━╮
│
│  ✅ Cards ${mode === 'on' ? 'enabled' : 'disabled'}!
│
╰━━━━━━━━━━━━━━━━━━━╯`
    }, { quoted: msg });
};

// Stub functions
const deck = async ({ sock, msg, from }) => {
    await sock.sendMessage(from, { text: '⏳ Coming Soon...' }, { quoted: msg });
};

const givecard = async ({ sock, msg, from }) => {
    await sock.sendMessage(from, { text: '⏳ Coming Soon...' }, { quoted: msg });
};

const sellcard = async ({ sock, msg, from }) => {
    await sock.sendMessage(from, { text: '⏳ Coming Soon...' }, { quoted: msg });
};

const auction = async ({ sock, msg, from }) => {
    await sock.sendMessage(from, { text: '⏳ Coming Soon...' }, { quoted: msg });
};

const bid = async ({ sock, msg, from }) => {
    await sock.sendMessage(from, { text: '⏳ Coming Soon...' }, { quoted: msg });
};

module.exports = {
    mycards,
    get: getCard,
    deck,
    givecard,
    sellcard,
    auction,
    bid,
    rollcard,
    cards: enableCards
};
