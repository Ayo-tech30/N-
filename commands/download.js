// Download commands - Coming soon stubs

const play = async ({ sock, msg, from }) => {
    await sock.sendMessage(from, { 
        text: '╭━━𖣔 𝗣𝗟𝗔𝗬 𖣔━━╮\n│\n│  ⏳ Music Player Coming Soon...\n│\n╰━━━━━━━━━━━━━━━━━━━╯' 
    }, { quoted: msg });
};

const instagram = async ({ sock, msg, from }) => {
    await sock.sendMessage(from, { 
        text: '╭━━𖣔 𝗜𝗡𝗦𝗧𝗔𝗚𝗥𝗔𝗠 𖣔━━╮\n│\n│  ⏳ Instagram Downloader Coming Soon...\n│\n╰━━━━━━━━━━━━━━━━━━━╯' 
    }, { quoted: msg });
};

const tiktok = async ({ sock, msg, from }) => {
    await sock.sendMessage(from, { 
        text: '╭━━𖣔 𝗧𝗜𝗞𝗧𝗢𝗞 𖣔━━╮\n│\n│  ⏳ TikTok Downloader Coming Soon...\n│\n╰━━━━━━━━━━━━━━━━━━━╯' 
    }, { quoted: msg });
};

module.exports = {
    play,
    instagram,
    tiktok
};
