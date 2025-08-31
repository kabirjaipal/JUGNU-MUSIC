<div align="center">

# JUGNU MUSIC — Discord Music Bot 🎵

[![Stars](https://img.shields.io/github/stars/kabirjaipal/JUGNU-MUSIC?style=flat-square)](https://github.com/kabirjaipal/JUGNU-MUSIC/stargazers)
[![Forks](https://img.shields.io/github/forks/kabirjaipal/JUGNU-MUSIC?style=flat-square)](https://github.com/kabirjaipal/JUGNU-MUSIC/fork)
[![Issues](https://img.shields.io/github/issues/kabirjaipal/JUGNU-MUSIC?style=flat-square)](https://github.com/kabirjaipal/JUGNU-MUSIC/issues)
[![License](https://img.shields.io/badge/license-MIT-green?style=flat-square)](LICENSE)
[![Node](https://img.shields.io/badge/node-%E2%89%A518.17-43853D?logo=node.js&style=flat-square)](https://nodejs.org/)

High‑quality Discord music bot powered by DisTube and discord.js v14 — YouTube, Spotify, SoundCloud, filters, autoplay, 24/7, request channel, lyrics, and more.

</div>

## Features

- YouTube, Spotify, and SoundCloud playback
- Slash commands and message commands
- 24/7 voice channel + autoresume
- Rich queue controls: skip, seek, loop, shuffle, move, remove, jump, filters
- Lyrics lookup, request channel system, DJ role
- Works on Replit/VPS, uses DisTube + discord.js v14

---

## Installation

1) Install latest LTS [Node.js](https://nodejs.org/) (>= 18.17) and [Python](https://www.python.org/downloads/).

2) Clone or download the repository.

3) Install dependencies:

```powershell
npm install
```

4) Configure the bot in `settings/config.js` and `.env`.

### _Modify - config.js_

```javascript
{
  TOKEN: "BOT_TOKEN",
  PREFIX: "BOT_PREFIX",
  mongodb : "MONGO_URL"
}
```

### _Modify - .env_

Rename `.env.example` to `.env` and configure the following keys:

```env
# Discord
TOKEN=
PREFIX=

# Database (optional if using JSON storage)
MONGO_URL=

# Slash commands
# Comma-separated list of guild IDs (for faster, per-guild registration)
GUILD_ID=
# Set to true to register commands globally (may take up to 1 hour to propagate)
SLASH_GLOBAL=false

# Web server
PORT=3000

# Reduce noisy update checks from ytsr/ytdl
YTSR_NO_UPDATE=true
YTDL_NO_UPDATE=true

# Voice diagnostics (optional; set true to print a dependency report on startup)
VOICE_DEBUG_REPORT=false
```

Notes:
- If you want global slash commands, set `SLASH_GLOBAL=true`. Otherwise, keep `GUILD_ID` set (you can provide multiple IDs separated by commas) for instant per‑guild updates.
- `MONGO_URL` enables MongoDB storage via JoshDB’s Mongo provider; if omitted, JSON storage is used.

5) Optional native optimizations (Windows/macOS/Linux):

```powershell
npm install @discordjs/opus zlib-sync@latest erlpack@latest
```

6) Start the bot:

```powershell
npm start
```

Dev mode with auto-reload:

```powershell
npm run dev
```

## Dashboard

[Dashboard setup guide](https://github.com/kabirsingh2004/JUGNU-Dashboard/blob/main/README.md)

## Feedback & Support

If you have any feedback or need assistance, please join our [Discord Server](https://discord.gg/FuKfAREn9f).

## Contributing

Contributions are welcome! Please open an issue or PR. For larger changes, start a discussion first.

## Security

Please report vulnerabilities privately via [GitHub Security Advisories](https://github.com/kabirjaipal/JUGNU-MUSIC/security/advisories) or email.

## License

This project is licensed under the [MIT License](LICENSE).

### Thanks for using JUGNU MUSIC! If this helps you, please ⭐ the repo and consider a fork.

Your support is appreciated! 🌟
