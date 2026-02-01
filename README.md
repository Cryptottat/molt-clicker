<p align="center">
  <img src="public/gh.png" alt="Claw Clicker Banner" width="100%">
</p>

<h1 align="center">🦀 CLAW CLICKER 🦀</h1>

<p align="center">
  <strong>The most addictive idle clicker game on the blockchain!</strong><br>
  Click claws. Get rich. Touch grass later.
</p>

<p align="center">
  <a href="https://clawclicker.fun">🎮 Play Now</a> •
  <a href="https://x.com/clawclicker">𝕏 Twitter</a> •
  <a href="https://github.com/clawclicker/clawclicker">📦 GitHub</a>
</p>

---

## 🎯 What is Claw Clicker?

Claw Clicker is a **Cookie Clicker-style idle game** with a crab/lobster theme. Click the giant claw, earn claws, buy upgrades, and watch your empire grow! 

Features:
- 🦞 **Satisfying click mechanics** with particle effects & sounds
- 🏖️ **Claw Beach** - Watch your claws walk around and merge into bigger units
- 🛒 **Upgrade Shop** - Production, Automation, Multipliers, Decor & Special items
- 👻 **Phantom Wallet Integration** - Connect for a +5% production bonus
- 🎵 **Chill background music** with YouTube integration
- 📱 **Responsive design** - Play on any device
- 💾 **Auto-save** - Your progress is saved to localStorage
- 🐦 **Share on X** - Flex your claw count with a screenshot

---

## 🛠️ Tech Stack

| Tech | Purpose |
|------|---------|
| ⚛️ **React 18** | UI Components & State Management |
| ⚡ **Vite** | Lightning-fast dev server & build |
| 🎨 **Tailwind CSS** | Utility-first styling with pixel art theme |
| 👻 **Phantom Wallet** | Solana wallet integration |
| 🎵 **YouTube IFrame API** | Background music player |
| 🔊 **Web Audio API** | Click & merge sound effects |
| 📸 **html2canvas** | Screenshot generation for sharing |

---

## 🚀 Quick Start

```bash
# Clone the repo
git clone https://github.com/clawclicker/clawclicker.git
cd clawclicker

# Install dependencies
npm install

# Start dev server
npm run dev

# Build for production
npm run build
```

---

## 🍴 Fork It & Make It Yours!

Want to create your own clicker game? **Go ahead and fork this repo!**

Here's what you can easily customize:

| File | What to Change |
|------|----------------|
| `src/components/Game.jsx` | Upgrade costs, CPS values, game balance |
| `public/claw.png` | Small claw/favicon image |
| `public/clawbig.png` | Main clicker image |
| `tailwind.config.js` | Colors, fonts, animations |
| `src/index.css` | Custom styles & pixel art effects |

### Ideas for your fork:
- 🍕 Pizza Clicker
- 🚀 Rocket Clicker  
- 🐕 Doge Clicker
- 💎 Diamond Clicker
- 🌙 Moon Clicker

The code is modular and well-commented. Have fun with it!

---

## 📁 Project Structure

```
claw-clicker/
├── public/
│   ├── claw.png          # Small claw icon
│   ├── clawbig.png       # Main clicker image
│   └── gh.png            # GitHub banner
├── src/
│   ├── components/
│   │   ├── Game.jsx          # Main game logic & state
│   │   ├── ClickerArea.jsx   # Click handler & particles
│   │   ├── BeachArea.jsx     # Claw beach visualization
│   │   ├── UpgradeShop.jsx   # Shop UI & categories
│   │   ├── WalletConnect.jsx # Phantom wallet integration
│   │   ├── TwitterShare.jsx  # X share functionality
│   │   └── StatsDisplay.jsx  # Stats component
│   ├── App.jsx
│   ├── main.jsx
│   └── index.css
├── index.html
├── tailwind.config.js
├── vite.config.js
└── package.json
```

---

## 🎮 Game Mechanics

### Upgrade Categories

| Category | Description |
|----------|-------------|
| 🦐 **Production** | Auto-generates CPS (Claws Per Second) |
| 🤖 **Automation** | Bonus claws per click |
| ✨ **Multipliers** | Multiply your click power or production |
| 🌿 **Decor** | Decorative items with small bonuses |
| 🌟 **Special** | End-game powerful upgrades |

### Claw Merging

Claws on the beach automatically merge:
- 10 × 1-unit claws → 1 × 10-unit claw
- 10 × 10-unit claws → 1 × 100-unit claw
- And so on... 🦀➡️🦞➡️🦈

---

## 🤝 Contributing

Found a bug? Have a cool idea? PRs are welcome!

1. Fork the repo
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

---

## 📜 License

MIT License - Do whatever you want with it! Just have fun. 🦀

---

<p align="center">
  <strong>Made with 🦀 and mass amounts of clicking</strong><br>
  <a href="https://clawclicker.fun">clawclicker.fun</a>
</p>
