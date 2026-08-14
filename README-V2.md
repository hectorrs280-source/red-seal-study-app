# Red Seal Industrial Electrician Study App — V2

## Objective
Prepare specifically for the Canadian **Industrial Electrician Red Seal** examination over a maximum 180-day study cycle. This is not a generic electrical course and is not based on Mexican electrical practice.

## Official study spine
The app organizes study around the public Industrial Electrician Red Seal Occupational Standard (RSOS):

- 6 Major Work Activities
- 31 exam-weighted Tasks
- 112 Sub-tasks represented in the study map
- 100-question exam blueprint
- 4-hour mock duration
- 70% official pass mark
- MWA weighting: A 9%, B 23%, C 20%, D 21%, E 10%, F 17%

The app treats the official Red Seal Industrial Electrician pages and RSOS as the source of truth for exam scope and Task/Sub-task mapping.

## Question policy
Practice questions are **original study questions**. They are not official, copied, recalled, leaked, or represented as actual Red Seal exam questions.

Every reviewed study question includes:

- MWA
- Task
- Sub-task where applicable
- cognitive category
- source identifier / locator
- `source_grounded`
- `answer_verified`

A question is marked verified only when its answer can be supported by the referenced public Red Seal material or by an explicitly verified formula/source. CEC-specific numerical requirements must not be invented; they require validation against the applicable Canadian Electrical Code source/edition before being marked verified.

## Cognitive mix
Red Seal publishes ranges for Industrial Electrician rather than a fixed cognitive count for every sitting or every Task:

- Knowledge and Recall: 10–20%
- Procedural and Application: 35–45%
- Critical Thinking: 40–50%

The mock builder uses a simulated mix within those published ranges while respecting official Task question counts. The app does **not** claim that a particular 19/38/43 split is the exact composition of the real examination.

## English training
The current reviewed core includes 80 high-utility English terms and phrases covering exam language, safety, distribution, wiring, motor controls, drives, motors, signalling, automation and process control. Audio uses browser `speechSynthesis` with Canadian English (`en-CA`).

Spanish help can be hidden during normal study. Full mock mode hides Spanish to more closely reproduce an English-language examination environment.

The vocabulary architecture is intentionally expandable; future vocabulary additions should be reviewed before being added to the daily study pool.

## Users and privacy
Profiles are local study profiles only. They require a display name and study start date; no email, password service or remote account is created. Progress is stored separately per user in browser `localStorage`.

## 180-day method
The calendar rotates exam-weighted RSOS Tasks, weekly review, weak-area remediation, technical English and full mock sessions. The internal readiness goal should be stricter than the official 70% pass mark; repeated mock results around or above 80% are used as a practical preparation target, not an official Red Seal requirement.

## Safe rollout
V2 is staged at `/v2/` so the existing site root remains unchanged during review. Promote V2 to the root only after functional review and user acceptance.
