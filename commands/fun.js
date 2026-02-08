// Fun commands

const match = async ({ sock, msg, from, sender, args }) => {
    let target = sender;
    
    if (msg.message?.extendedTextMessage?.contextInfo?.mentionedJid?.length > 0) {
        target = msg.message.extendedTextMessage.contextInfo.mentionedJid[0];
    }

    const percentage = Math.floor(Math.random() * 101);
    
    await sock.sendMessage(from, {
        text: `╭━━𖣔 𝗠𝗔𝗧𝗖𝗛 𝗠𝗘𝗧𝗘𝗥 𖣔━━╮
│
│  💘 Match Score: ${percentage}%
│  ${percentage > 70 ? '🔥 Perfect Match!' : percentage > 40 ? '😊 Good Match' : '😅 Not So Great'}
│
╰━━━━━━━━━━━━━━━━━━━╯`
    }, { quoted: msg });
};

const roast = async ({ sock, msg, from }) => {
    const roasts = [
        "You're like a software update. Whenever I see you, I think 'Not now.'",
        "I'd agree with you, but then we'd both be wrong.",
        "You're not stupid; you just have bad luck thinking.",
        "If I wanted to hear from someone like you, I'd watch a tutorial on what NOT to do.",
        "You bring everyone so much joy... when you leave the room."
    ];

    const roast = roasts[Math.floor(Math.random() * roasts.length)];

    await sock.sendMessage(from, {
        text: `╭━━𖣔 𝗥𝗢𝗔𝗦𝗧 𖣔━━╮
│
│  🔥 ${roast}
│
╰━━━━━━━━━━━━━━━━━━━╯`
    }, { quoted: msg });
};

const simp = async ({ sock, msg, from }) => {
    const percentage = Math.floor(Math.random() * 101);
    
    await sock.sendMessage(from, {
        text: `╭━━𖣔 𝗦𝗜𝗠𝗣 𝗠𝗘𝗧𝗘𝗥 𖣔━━╮
│
│  💕 Simp Level: ${percentage}%
│  ${percentage > 70 ? '🚨 Ultimate Simp!' : percentage > 40 ? '😳 Moderate Simp' : '😎 Not a Simp'}
│
╰━━━━━━━━━━━━━━━━━━━╯`
    }, { quoted: msg });
};

module.exports = {
    match,
    roast,
    simp
};
