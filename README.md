<p align="center">
  <img src="kafu-logo.png" width="300" alt="Kafu logo">
</p>

<h1 align="center">Kafu — كفء</h1>

<p align="center">
  <b>A manager's dashboard that shows which skills each team is missing,<br>
  then recommends who to hire, who to promote, and who fits each project.</b>
</p>

<p align="center">
  <img src="https://img.shields.io/badge/React-19-61DAFB?style=flat-square&logo=react&logoColor=white">
  <img src="https://img.shields.io/badge/TypeScript-3178C6?style=flat-square&logo=typescript&logoColor=white">
  <img src="https://img.shields.io/badge/Tailwind_CSS-4-06B6D4?style=flat-square&logo=tailwindcss&logoColor=white">
  <img src="https://img.shields.io/badge/Express-000000?style=flat-square&logo=express&logoColor=white">
  <img src="https://img.shields.io/badge/Gemini-8E75B2?style=flat-square&logo=googlegemini&logoColor=white">
  <img src="https://img.shields.io/badge/Netlify-00C7B7?style=flat-square&logo=netlify&logoColor=white">
  <img src="https://img.shields.io/badge/Arabic_RTL-success?style=flat-square">
</p>

<p align="center">
  <a href="https://kafu-app.netlify.app"><b>Live demo →</b></a>
</p>

---

## The problem

A manager knows the team is falling behind. What they usually cannot say is **which specific skill
is causing it**. So hiring happens on impression, promotion happens on seniority, and projects are
assigned to whoever has availability rather than whoever has the skill.

**Kafu** ("competent" in Arabic) turns that into numbers. It measures how well each skill is covered
inside a team, surfaces the gap, and then writes the profile of the person who closes it.

A prototype built during the BUILDx hackathon (مهارة track).

---

## What it does

### 📊 Overview
Daily task completion per team, the skills each team is short on, and who is due for promotion.

### 👥 Team page
Workflow analysis, a chart of who holds each skill, and the projected effect of a new hire on the
team's skill coverage.

### 📁 Projects
Upload a project brief as PDF or text; Kafu proposes a team that covers its skills and flags the
skills nobody in the company holds.

### 📈 Promotions
Candidates for each role side by side, with a "how do they get there?" plan for anyone who falls
short. The criteria — review score, task completion, courses per year, experience, months since the
last promotion — are set by the manager.

### 🗂 Employees
Employee profiles, and adding a new employee straight from their CV as a PDF.

---

## Where the AI sits

Every number and every decision is computed in code. Gemini only writes and explains:

| Feature | What the model does |
|---|---|
| **Workflow analysis** | Reads the computed task facts and extracts the patterns plus one suggested action |
| **Hiring profile** | Writes why to hire now, the recommendation, the responsibilities, the requirements, and the job post |
| **Project brief parsing** | Extracts title, team size and required skills from a PDF or plain text |
| **CV parsing** | Extracts name, title, experience and skills from a PDF |
| **Promotion plan** | Turns an employee's gaps into a three-step plan |

Keeping scoring out of the model is deliberate: a manager has to be able to defend a promotion
decision, and that is only possible when the percentages come from a rule they can read.

---

## What is simulated

This is a prototype running on seeded demo data held in the browser. Searching LinkedIn for
candidates, pulling their profiles, and publishing a job post are simulated for the demo — there is
no real LinkedIn or ERP integration behind them.

---

## Tech Stack

| Layer | Technology |
|---|---|
| **Frontend** | React 19, TypeScript, Vite |
| **Styling** | Tailwind CSS 4 — light and dark modes, Arabic RTL |
| **Server** | Express in development, Netlify Functions in production |
| **AI** | Gemini via `@google/genai`, server-side only |
| **Hosting** | Netlify |

---

## Project Structure

```
src/
├── components/
│   ├── home/           Overview dashboard
│   ├── team/           Team page, skill coverage, hiring impact
│   ├── projects/       Project brief upload and team proposal
│   ├── promotions/     Promotion candidates and plans
│   ├── employees/      Employee list and profiles
│   ├── criteria/       Manager-defined promotion criteria
│   └── common/         Shared UI and the logo
│
├── utils/
│   ├── teamInsights.ts      Skill coverage and gap calculation
│   ├── matchingEngine.ts    Matching people to required skills
│   ├── projectTeam.ts       Team proposal for a project
│   ├── promotionPlan.ts     Promotion eligibility and plans
│   ├── workTracking.ts      Task completion metrics
│   └── externalCandidates.ts Simulated external candidate search
│
├── services/api.ts     Client side of the AI calls
└── data/initialData.ts Seeded demo data

netlify/functions/api.ts   Server-side AI proxy — holds the API key
```

---

## Getting Started

### Prerequisites

- Node.js 20 or newer
- A Gemini API key

### Setup

```bash
npm install
cp .env.example .env     # then set GEMINI_API_KEY
npm run dev
```

Opens on http://localhost:3000. The key stays on the server and never reaches the browser.

---

## Deployment

Configured for Netlify: the frontend is served as static files and every `/api` route is handled by
a single function (`netlify/functions/api.ts`). Add `GEMINI_API_KEY` to the site's environment
variables; the model can be changed with `GEMINI_MODEL`.
