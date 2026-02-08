// Image commands - Coming soon stubs

const sticker = async ({ sock, msg, from }) => {
    await sock.sendMessage(from, { 
        text: '╭━━𖣔 𝗦𝗧𝗜𝗖𝗞𝗘𝗥 𖣔━━╮\n│\n│  ⏳ Sticker Maker Coming Soon...\n│\n╰━━━━━━━━━━━━━━━━━━━╯' 
    }, { quoted: msg });
};

const blur = async ({ sock, msg, from }) => {
    await sock.sendMessage(from, { 
        text: '╭━━𖣔 𝗕𝗟𝗨𝗥 𖣔━━╮\n│\n│  ⏳ Blur Filter Coming Soon...\n│\n╰━━━━━━━━━━━━━━━━━━━╯' 
    }, { quoted: msg });
};

const removebg = async ({ sock, msg, from }) => {
    await sock.sendMessage(from, { 
        text: '╭━━𖣔 𝗥𝗘𝗠𝗢𝗩𝗘 𝗕𝗚 𖣔━━╮\n│\n│  ⏳ Background Remover Coming Soon...\n│\n╰━━━━━━━━━━━━━━━━━━━╯' 
    }, { quoted: msg });
};

module.exports = {
    sticker,
    blur,
    removebg
};
