# Quest Cards 🎴

**Choose your adventure, earn your reward!**

A family challenge app that reimagines allowance as adventure. Kids pick challenges from themed packs, complete them, and earn rewards. Built for parents who want to encourage growth, agency, and intentional play.

![Status](https://img.shields.io/badge/status-MVP-yellow)
![Platform](https://img.shields.io/badge/platform-Web-blue)

## 🎯 What Is This?

Instead of passive allowance or boring chore charts, Quest Cards gives kids **agency**:

1. **Browse** challenge packs (Art, Life Skills, Brain Games, etc.)
2. **Pick** a quest that sounds fun
3. **Complete** the challenge in real life
4. **Earn** the reward when a parent verifies

It's the "challenge card" metaphor made digital — like trading cards, but for growth.

## 🚀 Quick Start

```bash
# Clone the repo
git clone https://github.com/zedkingsley/quest-cards.git
cd quest-cards/app

# Install dependencies
npm install

# Run development server
npm run dev

# Open http://localhost:3000
```

## 📱 Features (MVP)

- ✅ Add kid profiles with fun avatars
- ✅ Browse 4 challenge packs (34 total challenges)
- ✅ Start a quest and mark it complete
- ✅ Parent verification flow
- ✅ Track rewards earned
- ✅ Responsive design (works on phone, tablet, desktop)
- ✅ Local storage persistence

## 🗂️ Challenge Packs

| Pack | Challenges | Focus |
|------|------------|-------|
| ⭐ Starter Pack | 10 | Mixed easy wins |
| 🎨 Art Adventures | 8 | Creative projects |
| 🌟 Life Skills | 8 | Practical learning |
| 🧠 Brain Games | 8 | Puzzles & learning |

## 🛠️ Tech Stack

- **Framework**: Next.js 14 (App Router)
- **Language**: TypeScript
- **Styling**: Tailwind CSS
- **Storage**: localStorage (Supabase-ready architecture)
- **Deployment**: Vercel-ready

## 📁 Project Structure

```
quest-cards/
├── app/                    # Next.js app
│   └── src/
│       ├── app/           # Pages
│       ├── components/    # UI components
│       └── lib/           # Data layer, types, packs
├── docs/                  # Design documents
│   ├── PRODUCT.md        # Product definition
│   └── DATA-MODEL.md     # Database schema
├── packs/                 # Challenge pack JSON files
└── DECISIONS.md          # Build decisions log
```

## 🗺️ Roadmap

### Phase 1: MVP ✅
- Basic challenge flow
- Local storage
- 4 starter packs

### Phase 2: Polish
- Custom challenge creation
- More packs (Adventure, Mindset, etc.)
- Photo proof option
- Supabase backend (multi-device sync)

### Phase 3: Social
- Family sharing
- Friend challenges ("Dare" mode)
- Public challenge board

### Phase 4: Platform
- Pack marketplace
- Points economy
- Creator tools

## 🤝 Contributing

This is a personal project, but ideas are welcome! Open an issue to discuss.

## 📄 License

MIT

---

Built with ❤️ for adventurous families.
