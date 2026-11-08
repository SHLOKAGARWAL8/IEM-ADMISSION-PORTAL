# IEM Admission Portal Starter Kit

## Contents
- `reference/iem_admission_wireframe.jpg` — user-provided wireframe reference.
- `ANTIGRAVITY_PROMPT.md` — copy/paste full implementation prompt for Antigravity.
- `dataset/` — synthetic CSV/JSON seed data for programs, faculty, events, demo applications, fee components, and editable college content.

## Important data warning
The dataset is synthetic demo data, not official institutional data. It contains no real applicant credentials. Replace sample faculty, course details, fees, event dates, eligibility requirements, contact details, and any claims with verified official information before publishing.

## Suggested use
1. Extract the ZIP into a project folder.
2. Open that folder in Antigravity.
3. Paste `ANTIGRAVITY_PROMPT.md` into the agent.
4. Ask Antigravity to inspect the existing repo first and implement in phases without deleting existing work.
5. Ensure the seed script imports the CSV/JSON files idempotently.
6. Run the application and tests; only report test results that were actually observed.

The dataset is intended for development, UI population, and database-seeding tests. It is not suitable for training a predictive admissions model; real admission decisions must follow approved institutional rules and human review.
