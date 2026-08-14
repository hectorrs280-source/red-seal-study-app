# Red Seal Industrial Electrician Study App

Static PWA focused **only on the Canadian Red Seal Industrial Electrician trade**.

## Study goal

Prepare for the Industrial Electrician Red Seal examination over a structured **180-day / 6-month plan**, using the official public Red Seal exam blueprint and the Industrial Electrician Red Seal Occupational Standard (RSOS). The app is a preparation tool; Red Seal eligibility, trade certification and exam administration remain with the applicable Canadian provincial/territorial apprenticeship authority.

## V2.1 features

- Official curriculum spine: **6 Major Work Activities, 31 Tasks, 112 Sub-tasks**.
- Official exam blueprint: **100 questions, 4 hours, 70% pass mark**.
- Exact official **Task question counts** in the full mock.
- Mock cognitive mix: **19 Knowledge/Recall, 38 Procedural/Application, 43 Critical Thinking**. This is an app simulation allocation chosen to remain inside the official published ranges; it is not claimed to be a fixed official distribution for every exam.
- **176 original source-grounded practice questions** with source metadata.
- **31 Task study guides** covering every official Sub-task.
- **254 technical-English terms/phrases**, Canadian-English speech (`en-CA`), examples, spaced repetition (SM-2) and daily evaluation.
- Global **ES help** toggle. Full mock mode remains English-only.
- 180-day calendar: RSOS foundation, weekly consolidation, integration/troubleshooting, weak-area remediation and final full mocks.
- Internal readiness goal: **≥80% on three consecutive full mocks** before the real exam. Official pass mark remains 70%.
- Local study profiles: no email and no server. Each profile has independent progress, calendar, vocabulary state and settings on that browser/device.
- Task-level diagnostics and weak-area tracking.
- PWA/offline support.

## Question/source policy

Practice questions are **original study questions**, not official, leaked or recalled Red Seal exam questions. Answers are grounded in public official Red Seal sources such as the Industrial Electrician RSOS, examination weightings, exam information, or official formula/acronym information.

Where the RSOS refers to the Canadian Electrical Code (CEC) or another standard, the app deliberately avoids inventing proprietary table values. Exact code requirements must be verified in the current applicable codebook. This repository does not reproduce proprietary CEC tables.

## Official sources

- Industrial Electrician – Exam Information: https://red-seal.ca/eng/trades/industrialelectric/exam-information.shtml
- Industrial Electrician – Examination Weightings: https://red-seal.ca/eng/trades/industrialelectric/exam-weightings.shtml
- Industrial Electrician RSOS overview: https://red-seal.ca/eng/trades/industrialelectric/overview.shtml
- Industrial Electrician RSOS PDF: https://red-seal.ca/_conf/assets/custom/docms/industrialelectric/rsos-eng.pdf
- Red Seal Exam Preparation Guide: https://red-seal.ca/eng/resources/exam-prep-guide.shtml

## Local profiles and privacy

Profiles are study-control identities only. They ask for a study name and start date; no email is required. Data is stored in `localStorage`, so a profile created on one browser/device does **not** automatically synchronize to another device.

## Run locally

Because the app loads JSON files, use a local HTTP server instead of opening `index.html` with `file://`.

```bash
python -m http.server 8080
```

Open `http://localhost:8080`.

## GitHub Pages

Deploy from `main` → `/ (root)` in **Settings → Pages**.

## V2.2 guided study engine
- First-use local user creation and always-visible user switch/create control.
- Each user keeps a separate 180-day calendar, vocabulary state, quiz history, Task/Sub-task diagnostics and mock history.
- Daily completion is automatic: vocabulary review + objective English evaluation (>=80%) + RSOS lesson + guided question target.
- Guided questions prioritize the Task of the day, then missed questions and measured weak Tasks.
- RSOS-map classification drills are separated from exam-style practice so they do not dominate preparation.
- Full mock excludes map-only drills and preserves the official Task question counts while using a global cognitive mix within Red Seal's published ranges.
- Unfinished quiz sessions are stored for the active local user and can be resumed.
