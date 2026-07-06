<div align="center">

<img src="images/logo.png" alt="SIFT Logo" width="150"/>

# 🔎 SIFT

### Stop Searching. Start Learning.

**SIFT cuts through Resource FOMO** — the hours students lose comparing playlists, courses, blogs, and roadmaps — and hands them the one resource that actually fits how they learn.

[![Made with HTML5](https://img.shields.io/badge/HTML5-E34F26?style=for-the-badge&logo=html5&logoColor=white)](#)
[![Made with CSS3](https://img.shields.io/badge/CSS3-1572B6?style=for-the-badge&logo=css3&logoColor=white)](#)
[![Made with JavaScript](https://img.shields.io/badge/JavaScript-F7DF1E?style=for-the-badge&logo=javascript&logoColor=black)](#)
[![Firebase](https://img.shields.io/badge/Firebase-FFCA28?style=for-the-badge&logo=firebase&logoColor=black)](#)
[![Hackathon](https://img.shields.io/badge/NYC%20CodeQuest-2026-8A2BE2?style=for-the-badge)](#)
[![Status](https://img.shields.io/badge/status-active%20development-brightgreen?style=for-the-badge)](#)
[![License](https://img.shields.io/badge/license-Hackathon%20Project-lightgrey?style=for-the-badge)](#)

</div>

---

## 🧭 In One Line

> **SIFT asks five short questions, then tells you exactly where to learn — no more tabs, no more comparing, no more Resource FOMO.**

---

## 😩 The Problem: Resource FOMO

Before a student writes a single line of code, they've already lost an hour to a different kind of struggle:

- Which YouTube playlist is actually good?
- Which course is worth the time?
- Which documentation is beginner-friendly?
- Which roadmap should I trust?
- What does everyone on Reddit actually recommend?

This isn't learning. It's **research paralysis** — and it happens *before* the learning even starts. We call it **Resource FOMO**: the fear that whatever you pick, something better exists that you haven't found yet.

The tragedy is that the answer is almost always the same for people in the same situation — a beginner in web development with 5 hours a week and a visual learning style doesn't need to sift through 40 options. They need **one good one.**

---

## 💡 The Solution

SIFT replaces the search with a conversation.

Students answer a short questionnaire covering their **goal, experience level, learning style, weekly study time, and interests.** SIFT matches those answers against a curated resource database and returns the recommendation that fits — not the most popular one, not the loudest one, the *right* one.

```text
❌ Old way:  Open 12 tabs → compare → doubt yourself → repeat → give up → learn nothing
✅ SIFT way: Answer 5 questions → get your resource → start learning
```

## ✨ Features

<table>
<tr>
<td width="50%" valign="top">

**🔐 Accounts & Access**
- Firebase Authentication
- Login & Signup
- Session Persistence
- Protected Routes
- Auth Guards

**🧠 Smart Questionnaire**
- Learning Goal
- Experience Level
- Learning Style
- Weekly Study Time
- Interests

</td>
<td width="50%" valign="top">

**🎯 Recommendations**
- Personalized Recommendation Engine
- Curated Resource Database (`Resources.json`)
- Categories: Web Dev, AI, ML, DSA, Cybersecurity

**📊 Dashboard v1**
- Recommendations
- Progress Tracking
- Learning Journey
- Personalized View

</td>
</tr>
</table>

Also included: a full **Features page**, **Why SIFT page**, responsive layout, dark theme, and smooth animations throughout — SIFT is designed to feel like a product, not a prototype.

---

## ⚙️ How It Works

```text
   Visitor
      │
      ▼
  Landing Page
      │
      ▼
 Login / Signup
      │
      ▼
  Questionnaire
      │
      ▼
Recommendation Engine
      │
      ▼
    Dashboard
      │
      ▼
 Learning Journey
```

Every step exists for one reason: to get the student from "I don't know where to start" to "I'm learning" as fast as possible.

---

## 🎯 The Recommendation Engine

This is the core of SIFT. Once a student submits the questionnaire, the engine:

1. Reads their **goal**, **experience level**, and **learning style**
2. Filters the curated database (`Resources.json`) by category and difficulty
3. Weighs matches against **weekly study time** and **interests**
4. Returns the single best-fit resource — not a list to sort through

> 💬 The goal isn't to give students *more* options. It's to give them the *right* one, so the decision is already made by the time they arrive.

---

## 🏗️ Architecture

```text
┌────────────┐     ┌──────────────┐     ┌────────────────────┐
│  Frontend  │────▶│  Firebase    │────▶│   Authenticated     │
│ (HTML/CSS/ │     │    Auth      │     │       Session       │
│    JS)     │     └──────────────┘     └─────────┬───────────┘
└────────────┘                                    │
                                                   ▼
                                        ┌─────────────────────┐
                                        │   Questionnaire      │
                                        └──────────┬───────────┘
                                                   ▼
                                        ┌─────────────────────┐
                                        │ Recommendation Engine│
                                        │  (reads Resources.   │
                                        │       json)          │
                                        └──────────┬───────────┘
                                                   ▼
                                        ┌─────────────────────┐
                                        │      Dashboard        │
                                        └─────────────────────┘
```

---

## 📸 Screenshots

<div align="center">

| Landing Page | Dashboard |
|:---:|:---:|
| *Screenshot coming soon* | *Screenshot coming soon* |

| Questionnaire | Recommendations |
|:---:|:---:|
| *Screenshot coming soon* | *Screenshot coming soon* |

</div>

---

## 🛠️ Tech Stack

| Layer | Technology |
|---|---|
| **Frontend** | HTML5, CSS3, JavaScript |
| **Authentication** | Firebase Authentication |
| **Database** | JSON Resource Database (`Resources.json`) |
| **Tooling** | Git, GitHub, VS Code |

---

## 📂 Project Structure

```text
.
├── images/
│   ├── hero-image.png
│   └── logo.png
├── js/
│   ├── auth-guard.js
│   ├── bot.js
│   ├── dashboard.js
│   ├── firebase-config.js
│   ├── landing.js
│   ├── questionnaire.js
│   └── work.js
├── pages/
│   ├── feature.html
│   ├── profile.html
│   ├── questionnaire.html
│   ├── settings.html
│   ├── why.html
│   └── work.html
├── .gitignore
├── README.md
├── Resources.json
├── dashboard.html
├── index.html
├── login.html
├── login.js
├── quiz.css
├── quiz.html
├── quiz.js
├── script.js
├── signup.html
├── signup.js
└── style.css
```

---

## 🚀 Installation

```bash
# Clone the repository
git clone https://github.com/AyMi-2025/NYC_Contest.git

# Move into the project directory
cd NYC_Contest
```

No build step, no package manager required — SIFT runs on plain HTML, CSS, and JavaScript.

---

## 🔥 Firebase Setup

1. Create a project at [Firebase Console](https://console.firebase.google.com/)
2. Enable **Email/Password Authentication** under **Build → Authentication → Sign-in method**
3. Copy your Firebase config object
4. Paste it into `js/firebase-config.js`:

```javascript
const firebaseConfig = {
  apiKey: "YOUR_API_KEY",
  authDomain: "YOUR_AUTH_DOMAIN",
  projectId: "YOUR_PROJECT_ID",
  storageBucket: "YOUR_STORAGE_BUCKET",
  messagingSenderId: "YOUR_SENDER_ID",
  appId: "YOUR_APP_ID"
};
```

---

## 💻 Running Locally

```bash
# Option 1 — open directly
open index.html

# Option 2 — serve locally (recommended for Firebase auth to work correctly)
npx serve .
```

Then visit `http://localhost:3000` (or whichever port your server assigns).

---

## 🔭 Roadmap & Future Scope

SIFT is just getting started. Here's where it's headed:

- [ ] AI Learning Mentor
- [ ] Study Planner
- [ ] Smart Learning Roadmaps
- [ ] Progress Analytics
- [ ] AI-Powered Recommendations
- [ ] Community Features
- [ ] Gamification
- [ ] Notes
- [ ] Bookmarks
- [ ] 📱 **Mobile App** — SIFT in your pocket, for on-the-go recommendations
- [ ] 🧩 **Browser Extension** — get recommendations without leaving the site you're already on
- [ ] 🌍 **Expanded Resource Categories** — beyond Web Dev, AI, ML, DSA, and Cybersecurity

---

## 👥 Contributors

<table>
<tr>
<td align="center" width="25%">
<b>Sehjal Saxena</b><br/>
<sub>Product Lead</sub><br/><br/>
Product Vision • Product Strategy • UI/UX Planning<br/>
Recommendation Engine • Dashboard Design<br/>
Resource Architecture • Feature Planning<br/>
Documentation • Project Management<br/><br/>
<a href="https://github.com/sehjalsaxena">GitHub</a> · <a href="https://linkedin.com/in/sehjalsaxena">LinkedIn</a>
</td>
<td align="center" width="25%">
<b>Pratyush Kapoor</b><br/>
<sub>Team Lead</sub><br/><br/>
Team Coordination • Project Management<br/>
Feature Planning • Overall Development Support<br/><br/><br/><br/>
<a href="https://github.com/Crimson561">GitHub</a> · <a href="https://www.linkedin.com/in/pratyush-kapoor-9ab828412">LinkedIn</a>
</td>
<td align="center" width="25%">
<b>Ayan Maiti</b><br/>
<sub>Lead Frontend Developer</sub><br/><br/>
Frontend Development • UI Implementation<br/>
Responsive Design • Frontend Optimization<br/><br/><br/><br/>
<a href="https://github.com/AyMi-2025">GitHub</a> · <a href="https://www.linkedin.com/in/ayan-maiti-am05052008">LinkedIn</a>
</td>
<td align="center" width="25%">
<b>Anik Ghosh</b><br/>
<sub>Video Editor</sub><br/><br/>
Demo Video • Product Presentation<br/>
Promotional Content<br/><br/><br/><br/>
<a href="https://github.com/anik-ghosh-io">GitHub</a> · <a href="https://www.linkedin.com/in/anik-ghosh-19571841b">LinkedIn</a>
</td>
</tr>
</table>

---

## 🙏 Acknowledgements

Built during **NYC CodeQuest 2026**, hosted by **Not Your College** — thank you for the platform, the timeline, and the push to turn a shared frustration into something real.

---

## 🤝 Contributing

SIFT is still early, and we'd love your input:

- ⭐ **Star the repo** if the idea resonates with you
- 🐛 **Open an issue** for bugs or friction points
- 💡 **Start a discussion** if you have ideas for the recommendation engine or resource database

---

## 📄 License

This project was built for **NYC CodeQuest 2026**. Feel free to explore the code, fork it, and follow along as it grows.

---

<div align="center">

## 🌟 Stop Searching. Start Learning.

**SIFT** — built with ❤️ during **NYC CodeQuest 2026** by **Not Your College**

[![GitHub Repo](https://img.shields.io/badge/GitHub-Repository-181717?style=for-the-badge&logo=github)](https://github.com/AyMi-2025/NYC_Contest)

*If SIFT saved you from Resource FOMO even once, leave us a star.* ⭐

</div>
