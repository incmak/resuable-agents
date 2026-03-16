# AI Skills Library

 <!-- markdownlint-disable MD033 -->

<p align="center">
  <img src="https://img.shields.io/badge/AI-Skills%20Library-blueviolet?style=for-the-badge&logo=anthropic" alt="AI Skills Library"/>
</p>

<h1 align="center">🤖 Reusable AI Agent Skills</h1>

<p align="center">
  <strong>A curated collection of modular skills to supercharge AI agents</strong>
</p>

<p align="center">
  <a href="#-quick-stats">Stats</a> •
  <a href="#-installation">Installation</a> •
  <a href="#-skills-catalog">Catalog</a> •
  <a href="#-author">Author</a>
</p>

---

## 📊 Quick Stats

<p align="center">

| Metric                     | Count                       |
| -------------------------- | --------------------------- |
| 🎯 **Total Skills**        | 8 |
| 📄 **Documentation Files** | 93 |
| 🐍 **Utility Scripts**     | 1 |
| 📝 **Lines of Content**    | 12,001+ |
| 📂 **Categories**          | 3 (Frontend, General, Auth) |

</p>

```tree
Skills Distribution
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

Frontend Skills     ████████████        4 skills (50%)

General Skills      ██████              2 skills (25%)

Auth Skills         ██████              2 skills (25%)

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
```

---

## 🚀 Installation

Install skills directly using npx:

```bash
# List all available skills
npx @incmak/curated-skills list

# Install a skill to your project
npx @incmak/curated-skills add pptx

# Install globally (available in all projects)
npx @incmak/curated-skills add better-auth --global

# Search for skills
npx @incmak/curated-skills search auth

# Remove a skill
npx @incmak/curated-skills remove pptx
```

---

## 📚 Skills Catalog

### 🎨 Frontend Skills

| Skill                                                                                        | Description                                                | Rules/Patterns   |
| -------------------------------------------------------------------------------------------- | ---------------------------------------------------------- | ---------------- |
| **[Bulletproof React](frontend/react-nextjs/skills/bulletproof-react/)**                     | Feature-based architecture for scalable React/Next.js apps | 4 reference docs |
| **[Vercel React Best Practices](frontend/react-nextjs/skills/vercel-react-best-practices/)** | Performance optimization from Vercel Engineering           | 45 rules         |

### 🔐 Auth Skills

| Skill                                                           | Description                                        | Features               |
| --------------------------------------------------------------- | -------------------------------------------------- | ---------------------- |
| **[Better Auth](auth/skills/better-auth-best-practices/)**      | Best practices for Better Auth framework           | TypeScript-first       |
| **[Create Auth](auth/skills/create-auth-skill/)**               | Create authentication layers using Better Auth     | Decision tree workflow |
| **[Web Design Guidelines](auth/skills/web-design-guidelines/)** | UI compliance checker for Web Interface Guidelines | Live fetch             |

### 📦 General Skills

| Skill                                            | Description                                          | Features           |
| ------------------------------------------------ | ---------------------------------------------------- | ------------------ |
| **[PPTX](general/pptx/)**                        | PowerPoint creation, editing, and OOXML manipulation | HTML2PPTX, schemas |
| **[Doc Co-authoring](general/doc-coauthoring/)** | Structured workflow for collaborative documentation  | 3-stage process    |
| **[Internal Comms](general/internal-comms/)**    | Templates for internal communications                | 4 templates        |

---

## 🏗️ Architecture

```tree
┌─────────────────────────────────────────────────────────────┐
│                     SKILL STRUCTURE                         │
├─────────────────────────────────────────────────────────────┤
│                                                             │
│   SKILL.md (required)                                       │
│   ├── YAML Frontmatter ──────► name, description            │
│   └── Markdown Body ─────────► Instructions & workflows     │
│                                                             │
│   scripts/ (optional) ───────► Executable Python/Bash       │
│   references/ (optional) ────► On-demand documentation      │
│   assets/ (optional) ────────► Templates, icons, fonts      │
│                                                             │
└─────────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────────┐
│                  PROGRESSIVE DISCLOSURE                     │
├─────────────────────────────────────────────────────────────┤
│                                                             │
│   Level 1: Metadata ─────────► Always loaded (~100 words)   │
│      ↓                                                      │
│   Level 2: SKILL.md body ────► On trigger (<5k words)       │
│      ↓                                                      │
│   Level 3: References ───────► As needed (unlimited)        │
│                                                             │
└─────────────────────────────────────────────────────────────┘
```

---

## ✨ Author

<p align="center">
  <img src="https://img.shields.io/badge/Curated%20by-Mueen-blue?style=for-the-badge" alt="Curated by Mueen"/>
</p>

**Mueen** — Curator & Creator

This collection was lovingly curated and several skills were created from scratch by Mueen.

<p align="center">
  <a href="https://moin.vercel.app">
    <img src="https://img.shields.io/badge/Portfolio-moin.vercel.app-000000?style=for-the-badge&logo=vercel&logoColor=white" alt="Portfolio"/>
  </a>
  &nbsp;&nbsp;
  <a href="https://islamtimes.vercel.app">
    <img src="https://img.shields.io/badge/New%20App-islamtimes.vercel.app-22c55e?style=for-the-badge&logo=vercel&logoColor=white" alt="Islam Times"/>
  </a>
</p>

---

## 📜 License

Skills in this repository may have individual licenses. Check each skill's `SKILL.md` frontmatter for license information.

---

<p align="center">
  <sub>Built with ❤️ for the AI agent ecosystem</sub>
</p>
