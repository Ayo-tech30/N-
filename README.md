# 🌟 Nexora Violet WhatsApp Bot

A powerful WhatsApp bot with extensive features including economy, gambling, cards, admin tools, and more!

## 📋 Features

### 🎯 Main Features
- User Registration System
- Economy System (Wallet & Bank)
- Card Collection & Trading
- Gambling Games
- Profile Management
- Group Administration
- Mod & Guardian System
- Private/Public Mode

### 🎮 Commands Overview
- **Main**: menu, ping, alive, afk, register, leaderboard, market
- **Profile**: profile, setprofile, setname, setage, setprofilequote
- **Admin**: promote, demote, kick, tagall, hidetag, delete, groupinfo
- **Cards**: mycards, get, rollcard, cards (enable/disable spawning)
- **Economy**: accbal, deposit, withdraw, daily, weekly, monthly, work
- **Gambling**: gamble, slots, coinflip, dice, and more
- **Fun**: match, roast, simp
- **Owner**: mode, addmod, removemod, addguardian, mods

## 🚀 Setup Instructions

### 1. Install Dependencies
```bash
npm install
```

### 2. Configure Firebase
1. Go to [Firebase Console](https://console.firebase.google.com/)
2. Create a new project or use existing one
3. Go to Project Settings > Service Accounts
4. Click "Generate New Private Key"
5. Copy the JSON content
6. Open `firebase.js` and paste your Firebase credentials

Replace this section in `firebase.js`:
```javascript
const serviceAccount = {
  "type": "service_account",
  "project_id": "your-project-id",
  "private_key_id": "your-private-key-id",
  "private_key": "-----BEGIN PRIVATE KEY-----\nYOUR_PRIVATE_KEY_HERE\n-----END PRIVATE KEY-----\n",
  "client_email": "your-service-account@your-project.iam.gserviceaccount.com",
  "client_id": "your-client-id",
  "auth_uri": "https://accounts.google.com/o/oauth2/auth",
  "token_uri": "https://oauth2.googleapis.com/token",
  "auth_provider_x509_cert_url": "https://www.googleapis.com/oauth2/v1/certs",
  "client_x509_cert_url": "your-cert-url"
};
```

Also update the database URL:
```javascript
databaseURL: "https://your-project-id.firebaseio.com"
```

### 3. Enable Firestore
1. In Firebase Console, go to Firestore Database
2. Click "Create Database"
3. Choose "Start in production mode" or "Start in test mode"
4. Select a location and enable

### 4. Run the Bot
```bash
npm start
```

### 5. Pairing Process
1. When you run the bot, it will ask for your WhatsApp number
2. Enter your number with country code (e.g., 1234567890)
3. You'll receive an 8-digit pairing code
4. Open WhatsApp on your phone
5. Go to: Linked Devices > Link a Device
6. Tap "Link with phone number instead"
7. Enter the pairing code shown in terminal

## 🎴 Card Spawning Feature

### How to Use:
1. Enable card spawning in a group: `.cards on`
2. Upload an image with caption `.rollcard` to spawn a custom card
3. Or use `.rollcard` without image for random card
4. Members can claim cards using `.get <card-id>`

## 👑 Owner Features

### Default Owner Number
The owner number is set to: `2349049460676`

To change the owner number, edit this line in `handlers/messageHandler.js`:
```javascript
const OWNER = 'YOUR_NUMBER@s.whatsapp.net';
```

### Owner Commands
- `.mode private` - Bot only responds to owner
- `.mode public` - Bot responds to everyone
- `.addmod @user` - Add moderator
- `.removemod @user` - Remove moderator
- `.addguardian @user` - Add guardian
- `.removeguardian @user` - Remove guardian
- `.mods` - View all mods and guardians

## 🔧 Admin Privileges

When your paired WhatsApp number is admin in a group:
- The bot automatically has admin privileges
- You can use admin commands even without mentioning the bot
- No "bot needs admin" errors

## 📱 Bot Modes

- **Public Mode**: Bot responds to all registered users
- **Private Mode**: Bot only responds to owner

## 🎯 Registration

Users must register before using most commands:
```
.register or .reg
```

## ⚠️ Important Notes

1. **Replit Users**: Connection error messages are suppressed to avoid spam
2. **Message Filtering**: Bot ignores messages sent before it came online
3. **Group Responses**: In groups, bot only responds if tagged or if command is used
4. **Firebase**: Make sure to add your Firebase credentials before starting

## 📁 Project Structure

```
nexora-bot/
├── index.js                 # Main bot file
├── firebase.js             # Firebase configuration
├── package.json            # Dependencies
├── handlers/
│   └── messageHandler.js   # Message routing
└── commands/
    ├── main.js            # Main commands
    ├── profile.js         # Profile commands
    ├── admin.js           # Admin commands
    ├── cards.js           # Card commands
    ├── economy.js         # Economy commands
    ├── gambling.js        # Gambling commands
    ├── search.js          # Search commands
    ├── image.js           # Image commands
    ├── fun.js             # Fun commands
    ├── download.js        # Download commands
    └── owner.js           # Owner commands
```

## 🐛 Troubleshooting

### Bot not responding?
- Make sure you're registered (`.register`)
- Check if bot is in private mode
- Verify Firebase is configured correctly

### Card spawning not working?
- Make sure cards are enabled: `.cards on`
- Check if you're in a group
- Verify you have admin privileges

### Database errors?
- Check Firebase credentials
- Make sure Firestore is enabled
- Verify database URL is correct

## 📝 License

MIT License - Feel free to modify and use!

## 👨‍💻 Developer

Created by Kynx

---

💜 **Violet by Kynx** - Powered by Firebase & Baileys
