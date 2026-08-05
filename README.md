<div align="center">

# ⚽ Football Career Sim

**A managerial style football career simulator — live the life of a legend, one season at a time.**

From a raw 16-year-old talent to a 40-year-old icon: pick your nationality, choose your role on the pitch,
and write your own story through simmed seasons, random events, transfers, and loans.

<br />

![React](https://img.shields.io/badge/React-18.3-61DAFB?logo=react&logoColor=white&style=for-the-badge)
![Vite](https://img.shields.io/badge/Vite-7-646CFF?logo=vite&logoColor=white&style=for-the-badge)
![Tailwind](https://img.shields.io/badge/Tailwind_CSS-3.4-06B6D4?logo=tailwindcss&logoColor=white&style=for-the-badge)
![JavaScript](https://img.shields.io/badge/JavaScript-ES2022-F7DF1E?logo=javascript&logoColor=black&style=for-the-badge)
![Status](https://img.shields.io/badge/status-active-30d158?style=for-the-badge)
![Saves](https://img.shields.io/badge/saves-localStorage-0d1117?style=for-the-badge)

**No accounts. No servers. No crypto. Just football.** 🎮

<br />

<!--
📸 Add your screenshots here:
![Dashboard](public/screenshots/dashboard.png)
![Player creation](public/screenshots/create-player.png)
-->

</div>

---

## ✨ Why you'll love it

- 🎯 **Season-based engine** — no tedious match-by-match clicking. Choose your move, watch a whole season unfold.
- 🌱 **A living "Gen" (OVR)** — your rating grows with an S-curve as you age, peaks in your prime, and declines after 31.
- 🎲 **24 role-specific events** — hat-tricks, penalty saves, dressing-room bust-ups, and rare injuries that actually cost you rating.
- 🧠 **Stats that make sense** — goals, assists, cleansheets and saves are all correlated to your rating with a smoothstep formula. No random noise without reason.
- 🏟️ **Real football world** — 66 clubs, 10 leagues, 41 nationalities, real flags and club logos.
- 📱 **Responsive UI** — clean dark "manpage" aesthetic, optimized for desktop and mobile.
- 💾 **Auto-save** — your whole career lives in `localStorage`. Close the tab, come back, pick up exactly where you left off.

---

## 🎮 The Cycle

```
                 ┌──────────────────────────────┐
                 │      SEASON SIMULATED         │
                 │  matches · goals · assists ·  │
                 │  clean sheets · events · gen  │
                 └──────────────┬───────────────┘
                                │
   create player                ▼
  (name · flag · role) ──►  season summary  +  next move
                                │
                                ▼
               stay  ──  transfer/sign  ──  loan
```

Every choice on the Market instantly advances your career by 1 (or 2) seasons, then hands you the decision again:
**stay, sign, or go on loan.** Careers start at 16 and end at 40 — a maximum of 24 seasons of glory.

---

## 🌡️ The Gen (OVR rating)

The big number in the circle. Your player's true quality:

| Age | What happens |
|-----|--------------|
| **16 – 25** | 📈 Random growth: **+1 to +4** per season |
| **26 – 30** | 🧘 Prime: no forced growth, rating moves only via events |
| **31 – 40** | 📉 Decline: random **-1 to -3** per season |

- Starts at **50**, sealed at **99**
- 🔥 **Positive events**: +2 to +5 Gen
- 🚑 **Injuries** (the only negative that hurts): -1 to -3 Gen
- Everything else (red cards, bad form, manager criticism) touches **hidden internal stats only** — never the Gen

### Math behind the magic

Performance is correlated to Gen with a smooth **S-curve**:

```text
t = (Gen - 50) / 49            clamped to [0, 1]
factor = 1 + t² · (3 - 2t)     smoothstep
stat = role_base · factor · noise
```

| Gen | Factor | Effect |
|-----|--------|--------|
| 50  | 1.00   | baseline |
| 70  | ~1.36  | solid |
| 80  | ~1.67  | peak push |
| 99  | 2.00   | double production 💪 |

Each stat rolls its **own noise (±25%)**, so a season can bring few goals but plenty of assists.
Goalkeepers concede **less** when their rating is high — the factor divides instead of multiplying.

### 🏟️ Team strength matters

Your club's level scales your production — the same player scores far more at a top club than at a minnow:

| Club requirement (OVR) | Production factor |
|------------------------|:-----------------:|
| 80+ (top clubs)        | **×1.25**          |
| 70+ (strong clubs)     | **×1.05**          |
| 50 (rest of clubs)     | **×0.75**          |

Goals, assists, saves and clean sheets scale up (or down); keepers at big clubs also concede **less**.
Loans count too — the club you actually play for decides your factor.

### 📉 No guaranteed glory

Even at a top club, roughly **1 in 5 seasons** comes out flat for outfield players: production drops to
50–65% for that year. A big transfer raises your ceiling — it doesn't remove your off days. Goalkeepers are exempt.
No stat has a floor: even defenders can draw a blank.

### Base rating coefficients (Gen 50)

| Role | Goals | Assists |
|------|:-----:|:-------:|
| ST          | 16 | 5  |
| LW / RW     | 10 | 12 |
| CAM         | 8  | 11 |
| CM          | 6  | 9  |
| CDM         | 5  | 5  |
| CB          | 7  | 1  |
| LB / RB     | 6  | 7  |
| GK          | 0  | 0  |

Plus, keepers track **Saves** (base 70/season) and **Clean sheets** (base 9/season), and play 18–34 matches a season like everyone else.

---

## 🗂️ Roles & Visible Stats

The classic 20 hidden stats power the engine, but on screen you only see what matters for your position:

| Role band | Visible stats |
|-----------|----------------|
| 🧤 **GK** | Matches · Saves · Clean sheets · Goals conceded |
| 🦵 **Outfield** (ST, LW, RW, CAM, CM, CDM, CB, LB, RB) | Matches · Goals · Assists |

---

## 🏆 Career Features

### Seasons
- Career runs **16 → 40** (24 seasons max)
- Choose at creation: advance **1 or 2 seasons** per decision
- At 2-per-go, seasons are simulated together and merged into a single summary

### Transfers & Loans
- Clubs have **Gen requirements**: 50+ most clubs, 70+ strong clubs, 80+ top clubs
- A **loan** lasts one season: you play at the borrowed club (badge in the header) and auto-return to your parent club
- No team yet? The Market offers **3 contract options** to kick-start your career

### Dashboard
- **Club History** — every club with logo, league, and season span (current marked `NOW`)
- **Career Recap** — career totals, best season, and the full season-by-season table
- **Market** — your 3 choices for next season (`stay` / `sign` / `loan`)

### Career End
At 40, the final summary opens: final Gen, career totals, best season, and every club you wore the shirt for.
Hit **Restart** and do it all over again. 🔁

---

## 🎲 Random Events (24)

Role-aware events so your journey always feels real:

- **Attackers** (ST, LW, RW): winning goals, hat-tricks, missed penalties…
- **Midfield / Defense** (CAM, CM, CDM, CB, LB, RB): magic assists, auto-goals, bookings…
- **Goalkeepers** (GK): penalty saves, clean sheets…
- **Shared** (11): training, injuries, manager criticism, interviews, tactical switches…

Injuries — the only Gen-killers — are **rare** (~25% chance an event is one). Each season rolls automatically; you never press a button to trigger them. Perfect for that "hmm, maybe next season" feeling. 😅

---

## 🕹️ Quick Start

```bash
npm install          # install dependencies
npm.cmd run dev      # start dev server (Windows: use npm.cmd — npm.ps1 is blocked)
npm.cmd run build    # production build
npm.cmd run preview  # preview the build
```

Then open **http://localhost:5173** — your career awaits. 🏟️

---

## 🧱 Tech Stack

| Layer     | Tech |
|-----------|------|
| UI        | [React 18](https://react.dev) |
| Styling   | [Tailwind CSS 3](https://tailwindcss.com) |
| Build     | [Vite 7](https://vitejs.dev) |
| Persistence | `localStorage` (`football_career_sim_v1`) |
| Data      | Static JS modules (no backend) |

## 📁 Project Structure

```
src/
├── components/
│   ├── PlayerCreation.jsx    # 3-step wizard: name, nationality, role (SVG pitch)
│   ├── PlayerDashboard.jsx   # Dashboard: profile, recap, seasons, Market, modals
│   └── TeamSwitcher.jsx      # Club catalog with Gen requirements
├── data/
│   ├── nationalities.js      # 41 nationalities + flag URLs
│   ├── roles.js              # 10 roles, 20 internal stats, OVR calc
│   ├── teams.js              # 66 clubs / 10 leagues + real logo URLs
│   └── events.js             # 24 events split by role band
├── utils/
│   ├── gen.js                # Pure S-curve genFactor + season noise
│   └── storage.js            # localStorage save / load / clear
├── App.jsx                   # Career state & creation ⇄ dashboard routing
├── main.jsx                  # Entry point
└── index.css                 # Tailwind + custom components
```

---

## 🌐 Data Sources

- **Flags** — [flagpedia.net](https://flagpedia.net) · `https://flagpedia.net/data/flags/normal/{code}.png`
- **Club logos** — [football-logos.cc](https://football-logos.cc) · `https://assets.football-logos.cc/logos/{country}/{size}/{slug}.{hash}.png`
- **Logo fallback** — inline SVG placeholder when a request fails gracefully

---

## 🛡️ Security Notes

- Content-Security-Policy locks scripts, styles, fonts, and images to trusted origins
- Zero network calls to the player — everything is local and deterministic
- Clean `npm audit` (0 vulnerabilities)

---

<div align="center">

Made with ⚽ and ☕ · **Football Career Sim**

</div>