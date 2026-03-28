# Suno Lyric Architect

[中文文档](README.zh-CN.md)

A visual editor for crafting structured lyrics for [Suno](https://suno.com) AI music generation. Supports Suno V5 Meta Tags, drag-and-drop song structure, and a bilingual (English / Chinese) interface.

## Features

- **Block-based editor** - Organize lyrics into sections like `[Verse]`, `[Chorus]`, `[Bridge]`, etc.
- **Rich tag system** - Apply Structure, Vocal, Mood, Instrument, and Genre tags via drag-and-drop or click
- **Global song settings** - Set song-wide style and meta tags
- **Template save/load** - Save and reuse song structures as templates
- **Live preview** - Preview the final formatted output before copying to Suno
- **One-click copy** - Copy the full tagged lyrics to clipboard
- **Bilingual UI** - Switch between English and Chinese interface

## Getting Started

**Prerequisites:** Node.js

```bash
# Install dependencies
npm install

# Start dev server
npm run dev
```

The app runs at `http://localhost:3000`.

## Build

```bash
npm run build
npm run preview
```

## Tech Stack

- React 19
- TypeScript
- Vite
- Lucide Icons
