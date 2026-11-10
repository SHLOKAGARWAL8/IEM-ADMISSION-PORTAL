# IEM Admission Portal

A full-stack web application for IEM admissions, with a public institutional website, applicant portal, entrance-exam information and a role-protected administration portal.

<blockquote>
  <strong>Live website:</strong> <a href="https://iem-admission-portal-1.onrender.com/">https://iem-admission-portal-1.onrender.com/</a>
</blockquote>

## Scan to open the live portal

The QR image supplied for this release is included below. The direct deployment URL is provided as the canonical access link.

[![IEM Admission Portal QR code](public/assets/iem-admission-portal-qr.png)](https://iem-admission-portal-1.onrender.com/)

**Direct link:** [https://iem-admission-portal-1.onrender.com/](https://iem-admission-portal-1.onrender.com/)

 > The QR image is bundled locally at `public/assets/iem-admission-portal-qr.png` and included exactly as supplied. If the QR scan does not resolve, use the direct website link above.

## Overview

The portal brings the public-facing IEM information site and admission workflows into one application. Visitors can explore institutional information, programmes, faculty, fees, campus information, Gymkhana and IEMJEE/IEMCET information. Applicants can register, sign in, complete an admission application, upload supporting documents, save drafts and track application progress. Authorised staff can review applications and manage admissions content.

## Main features

### Public IEM website
- Public homepage is the default landing page at `/`.
- Navigation for About IEM, Courses, Faculty, Fees, Campus, Gymkhana and IEMJEE/IEMCET.
- Five locally bundled campus photographs displayed in an automatically rotating carousel (5-second interval).
- Separate locally bundled IEM and UEM logo assets.
- Programme catalogue covering the configured undergraduate, postgraduate and research programme groups.
- Fee information grouped by programme family, with tuition and examination fees configured per semester.
- Faculty and HOD directory, institutional information, events and student-club content.
- Dedicated IEMJEE/IEMCET information and registration hand-off.

### Student / applicant portal
- Student registration and sign-in.
- Registration accepts a syntactically valid email address; Gmail-only restrictions and email OTP are intentionally disabled.
- Indian mobile number format: exactly 10 digits, starting with 6, 7, 8 or 9. This is format validation only; it does not verify number ownership.
- Password policy: at least 8 characters, including uppercase, lowercase and a number.
- Multi-section admission application for personal, academic, programme and guardian details.
- Save-as-draft and continue an application later.
- Supporting document upload with file-type and size validation.
- Application submission with a generated application reference.
- Student dashboard with application progress, status and notifications.

### Admin / admissions portal
- Separate administrator/staff sign-in and role-based access control.
- Application review, document review and status updates.
- Programme, fee, faculty, event and website-content management.
- Reports, application summaries, CSV export and audit information where enabled by the configured role.
- Public student registration does not grant administrator privileges.

### Entrance examination information
- Dedicated IEMJEE / IEMCET navigation and information page.
- Examination-format and preparation information.
- Login-gated hand-off to the official examination portal: <https://exam.iem.edu.in/>.

### Gymkhana
- Separate Gymkhana section for student clubs, communities, events and campus activities.
- The existing Gymkhana presentation is retained independently from the academic and admission sections.



### One-time Super Admin recovery (deployment operator only)

This release includes an optional one-time bootstrap/reset controlled by `SUPER_ADMIN_RESET_PASSWORD`. It targets the configured Super Admin email in `src/server.js`. Set this variable only for a single deployment after confirming the service is connected to the intended persistent database. The application hashes the value with bcrypt, grants the configured account the admin role, invalidates its existing sessions, and records a completion marker in `site_content` so the same reset cannot run again. If the account does not exist, it creates it with no phone number. Once the deployment logs report successful completion, immediately remove `SUPER_ADMIN_RESET_PASSWORD` from Render and redeploy. Do not leave this variable configured. If the deployment fails, remove the variable to restore normal startup and inspect logs before retrying.

### Forgot Password

Student and Admin/Staff login now include a **Forgot password?** link. Password recovery uses a one-time, 30-minute link sent to the account's registered email address. Reset tokens are stored as SHA-256 hashes, can be used once, and all existing sessions for the account are revoked after a successful password change.

To enable email delivery on Render, create a Resend account, verify a sending domain/address, and add these environment variables to the existing Render web service:

| Variable | Value |
|---|---|
| `RESEND_API_KEY` | Your Resend API key (keep it secret; never commit it) |
| `PASSWORD_RESET_FROM` | A sender address verified in Resend, e.g. `IEM Admissions <admissions@your-domain>` |
| `APP_BASE_URL` | `https://iem-admission-portal-1.onrender.com` |

After setting the variables, redeploy the same Render service. No new domain, service, route base, or QR code is required. If email delivery is not configured, the recovery form reports that password recovery is temporarily unavailable rather than pretending an email was sent. The reset link expires after 30 minutes.

## Technology stack

- **Runtime:** Node.js 22.5+
- **Backend:** Express.js
- **Frontend:** HTML, CSS and browser JavaScript
- **Database:** SQLite using Node.js built-in `node:sqlite`
- **Authentication:** bcrypt password hashing and signed server-side sessions
- **Uploads:** Multer with file-type/size restrictions and authenticated document access
- **Security middleware:** Helmet and express-rate-limit

The app is intentionally lightweight and does not require a separate frontend build step.

## Project structure

```text
swe/
├── src/                  # Express server, database and seed logic
├── public/               # Website HTML, CSS, JavaScript and static assets
│   └── assets/            # IEM/UEM logos, campus images and portal QR code
├── dataset/               # Programme, faculty, fee and content seed data
├── data/                  # SQLite database (created at runtime)
├── uploads/               # Private applicant uploads
├── docs/                  # Project documentation and source notes
├── test/                  # Automated tests
├── .env.example           # Environment-variable template
├── package.json
├── START-IEM.ps1          # Windows one-command launcher
└── README.md
```

## Run locally

### Requirements
- Node.js 22.5 or newer
- npm

### Install and start

```bash
npm install
```

Create a local `.env` from `.env.example` and set a unique `SESSION_SECRET`.

**Windows PowerShell:**
```powershell
Copy-Item .env.example .env
npm start
```

**macOS / Linux:**
```bash
cp .env.example .env
npm start
```

Open <http://localhost:4000/>.

For the Windows one-command setup, open the `swe` folder in PowerShell and run:

```powershell
powershell -ExecutionPolicy Bypass -File .\START-IEM.ps1
```

The application uses port `4000` locally by default. In a hosting environment, it reads the platform-provided `PORT`.

### Seed data

To initialise or refresh the configured programme, faculty, event, fee and institutional content catalogue:

```bash
npm run seed
```

Review the seed script and dataset before running it against a database containing live applicant records. Keep a backup before any production data operation.

## Environment variables

| Variable | Purpose |
|---|---|
| `PORT` | HTTP port; defaults to `4000` locally. Hosting platforms provide this automatically. |
| `NODE_ENV` | Set to `production` on the hosted service. |
| `SESSION_SECRET` | Unique random secret of at least 32 characters in production. |
| `DATABASE_PATH` | SQLite database file path. |
| `UPLOAD_DIR` | Directory for uploaded applicant documents. |
| `MAX_UPLOAD_MB` | Maximum upload size in MB; defaults to `5`. |

Never commit `.env`, production secrets, the live SQLite database or private applicant uploads.

## Deployment

**Live deployment:** [https://iem-admission-portal-1.onrender.com/](https://iem-admission-portal-1.onrender.com/)

The deployed application is hosted on Render. The service should use the repository's `swe` directory as its **Root Directory**.

Suggested Render settings:

| Setting | Value |
|---|---|
| Runtime | Node |
| Root Directory | `swe` |
| Build Command | `npm install` |
| Start Command | `npm start` |
| Health check | Configure to a route that returns HTTP 200 in the current server implementation |

### Persistent storage is required

The application writes its SQLite database and applicant uploads to the filesystem. Render's default instance filesystem is ephemeral. Attach a persistent disk and configure both paths under its mount directory, for example:

```env
NODE_ENV=production
DATABASE_PATH=/var/data/iem.sqlite
UPLOAD_DIR=/var/data/uploads
SESSION_SECRET=<unique-random-secret-of-at-least-32-characters>
```

Use a persistent disk mounted at `/var/data`. Create a backup and migrate any existing local `iem.sqlite` database and required upload files before switching real applicants to the hosted service. Do not assume a Git push automatically transfers local database records.

### Production launch checklist
- [ ] Confirm the live URL opens over HTTPS.
- [ ] Set a unique production `SESSION_SECRET`.
- [ ] Attach persistent storage for the SQLite database and uploads.
- [ ] Back up and migrate the intended database and upload files.
- [ ] Confirm the first authorised administrator account is provisioned securely.
- [ ] Test student registration, sign-in, draft saving, uploads and final submission.
- [ ] Test admin sign-in, role restrictions and application review.
- [ ] Verify that one student cannot access another student's application or documents.
- [ ] Configure backups, retention and recovery procedures.
- [ ] Review privacy notice, data-protection requirements and institutional approval before accepting real applicant data.

## Automated checks

Run the test suite from the `swe` directory:

```bash
npm test
```

The repository includes tests for portal behaviour and locally bundled campus assets. Passing automated tests does not replace a live browser test of the hosted service, email/SMS integrations, data persistence or security controls.

## Data, privacy and operational notes

- Demo/sample dataset entries are not verified live admission records.
- Confirm current programme availability, eligibility, intake, fee amounts, examination dates and faculty information with IEM before relying on them for official admissions.
- Registration validates email syntax but does not verify mailbox ownership.
- Mobile validation checks number format only; it does not verify phone ownership.
- Do not use demo credentials in production.
- Keep applicant records and uploaded documents private. Restrict access to authorised users and maintain backups.
- Conduct an independent security and privacy review before processing real applicant information.

## Documentation

Additional project notes and provenance are available in:
- `docs/official-content-sources.md`
- `docs/original-implementation-spec.md`
- `docs/starter-kit-readme.md`

---

**Project:** IEM Admission Portal  
**Local URL:** <http://localhost:4000/>  
**Live URL:** [https://iem-admission-portal-1.onrender.com/](https://iem-admission-portal-1.onrender.com/)


## One-time Super Admin password reset (Render Free plan)

If the Super Admin cannot sign in and password-reset email is not configured, use this one-time deployment method. It does not require Render Shell, email configuration, a new Render service, or a new website URL.

1. In Render, open the existing `IEM-ADMISSION-PORTAL-1` service and select **Environment** → **Edit**.
2. Add `SUPER_ADMIN_RESET_PASSWORD` with a new password (8–72 characters; include uppercase, lowercase, and a number). Do not commit this value to GitHub or share it.
3. Save changes and let the existing service redeploy. On startup, the server updates the password for `shlokagarwal64@gmail.com` and invalidates that account's existing sessions.
4. After the deployment is Live, return to Render → Environment and **delete `SUPER_ADMIN_RESET_PASSWORD`**, then save. The database records that this one-time reset has already been applied, so it will not run again.
5. Sign in at the existing website using `shlokagarwal64@gmail.com` and the new password.

Important: this is a one-time recovery mechanism. The database marker prevents repeated resets. Keep the password private. If the reset variable is invalid or the super-admin account does not exist, the server logs an error and does not change the password.

## Production programme catalogue recovery

At server startup, the application now inserts any missing programme records from `dataset/programs.csv` into the configured SQLite database. This is an additive, non-destructive bootstrap: it does not overwrite existing programme records, admin edits, visibility settings, or application records. The student application dropdown reads active programmes from `/api/public`, so previously empty production databases are populated automatically without running a separate seed command.
