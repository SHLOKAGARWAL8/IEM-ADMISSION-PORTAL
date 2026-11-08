# IEM College Admission Portal — Working Prototype

A full-stack admission portal prototype built from the supplied IEM wireframe and starter-kit datasets. It includes a public college site, applicant registration/login, a multi-step draft application, private document uploads, application tracking, role-based admissions/admin workflows, programme management, user management, CSV reporting, notifications and an audit trail.

> **Data integrity notice:** The supplied CSV/JSON records are synthetic demo data. Faculty names, programmes, eligibility, fees, event dates, institutional claims, contact information and any statistics must be verified and replaced with approved official IEM information before public launch. The UI labels sample information. Do not use this prototype to make automated admission decisions.

## Requirements
- Node.js 22.5 or newer (uses Node.js built-in `node:sqlite`; no Visual Studio C++ build tools required)
- npm

## Local setup
```bash
npm install
# Windows PowerShell: Copy-Item .env.example .env
# Windows CMD: copy .env.example .env
# macOS/Linux: cp .env.example .env
npm run seed
npm start
```
Open http://localhost:4000. Use the public website navigation for college information; use **Student Login** or **Apply Now** for the separate applicant/admin portal experience.

The SQLite database is created at `data/iem.sqlite` by default using Node.js built-in SQLite. This avoids native `better-sqlite3` compilation and the Visual Studio C++ workload on Windows. The seed script is idempotent for the supplied catalogue data. Uploaded documents are stored under `uploads/` and are served only through an authenticated ownership/role-checked download endpoint.

## Account roles and administrator hierarchy
- Every new registration is assigned the Student/Applicant role by default.
- `shlokagarwal64@gmail.com` is the designated Super Admin. Register with this email and choose your own password; this account alone can grant/revoke Admin or Admissions Officer access and disable other accounts. Its role cannot be changed or its account disabled from the dashboard.
- `mmoupiya1806@gmail.com`, `iamsubham019@gmail.com` and `snigdhasaha48@gmail.com` are assigned Admin access when they register and choose their own passwords.
- Admins can manage admissions operations but cannot manage user roles or appoint other administrators.
- The prototype currently maps privileges by the exact email address at registration. A one-time database bootstrap also promotes any of these four accounts that already exist when the updated server first starts. It does not yet verify mailbox ownership. Before any real deployment, add email OTP/verification and provision privileged accounts only after verified ownership.

## Demo accounts
| Role | Email | Password |
|---|---|---|
| Administrator | `admin@iem.demo` | `Admin@12345` |
| Admissions officer | `officer@iem.demo` | `Officer@12345` |
| Applicant | `student@iem.demo` | `Student@12345` |

Demo accounts are created only when `NODE_ENV` is not `production`. They are not created in production. Provision the first production administrator through a controlled deployment/database bootstrap process. Demo passwords are for local testing only.

## Main workflows
### Applicant
1. Register a new account or sign in with the demo applicant.
2. Open **My Application** and complete personal, academic, programme and guardian sections.
3. Save drafts and resume later; drafts are persisted in SQLite.
4. Upload 10th marksheet, 12th marksheet and photo (required to submit). PDF/JPG/PNG only, 5 MB maximum by default.
5. Accept the declaration and submit. The application receives a unique application ID.
6. Track status history and notifications in the applicant dashboard.

### Admissions staff / administrator
1. Sign in using the officer or administrator account.
2. Review submitted applications and applicant details.
3. Open private documents, update document verification and add notes.
4. Update application status; applicants receive an in-portal notification.
5. Administrators can manage programmes, view the audit trail and export application CSV reports. Only the Super Admin can grant/revoke privileged roles or disable accounts.

## Configuration
See `.env.example`:
- `PORT`: HTTP port (default 4000)
- `SESSION_SECRET`: HMAC signing secret (set a unique random 32+ character value)
- `DATABASE_PATH`: SQLite file path
- `UPLOAD_DIR`: private document storage path
- `MAX_UPLOAD_MB`: per-file limit (default 5)

For production, use HTTPS, a managed database and private object storage (e.g. S3/GCS) behind a storage adapter, email/SMS provider, institutional password reset, backup/retention policies, security review and deployment-specific secrets. SQLite and local disk are intended for this runnable prototype, not a multi-instance production deployment. Add CSRF protection appropriate to the deployment topology and a persistent session cleanup job before production. The current forgot-password UI directs users to an administrator; it does not send reset emails.

## Data import
The source dataset is preserved in `dataset/`:
- `programs.csv`
- `faculty.csv`
- `events.csv`
- `applications.csv` (synthetic sample records retained as reference; no real applicant accounts are created from this file)
- `fee_structure.csv`
- `college_content.json`

`npm run seed` imports programmes, faculty, events, fees and college profile metadata. Re-running the seed refreshes these sample catalogue rows. Sample applications are intentionally not seeded as real user accounts because their credentials do not exist and the records contain synthetic identities.

## Security notes / limitations
- Passwords are hashed with bcrypt; sessions are random opaque IDs signed with HMAC and stored server-side, using HttpOnly/SameSite cookies.
- Login is rate-limited; server-side role checks protect all admin routes.
- Applicants can access only their own application and documents. Staff access is role-gated.
- Uploads have MIME allow-list and size limits, generated filenames and authenticated download routes.
- Application fields are validated server-side; SQL uses parameterized statements.
- This is a prototype: have it independently security-tested before handling real applicant data. Add CSRF controls, password reset delivery, account verification, retention/deletion workflows, malware scanning, object-storage encryption, observability and formal RBAC/permission policies before production.

## Quality checks
Run `npm test` for automated API/security smoke tests and `npm start` to run locally. The project is intentionally dependency-light and uses server-rendered static HTML/CSS/JS with an Express JSON API and SQLite persistence to keep setup simple.

## One-command Windows setup
Extract this ZIP, open the extracted `swe` folder in File Explorer, then run this single PowerShell command in its address-bar terminal:
```powershell
powershell -ExecutionPolicy Bypass -File .\START-IEM.ps1
```
The script checks the project version and Node.js requirement, removes stale `node_modules`/lockfile, installs dependencies, seeds SQLite, and starts the server. It stops immediately if any step fails. This updated build uses Node's built-in `node:sqlite` and does not depend on `better-sqlite3` or Visual Studio C++ Build Tools. Node.js 22.5+ is required.


## Official content enrichment
The public homepage includes sourced programme and fee information, faculty profiles, student clubs, events, hostel information, placement outcomes and notices. See `docs/official-content-sources.md` for provenance and accuracy caveats. Verify session-specific fees, eligibility, faculty teaching allocations, event editions and hostel vacancies with IEM before production publication.


### Faculty directory
The public site now has a featured faculty preview and a separate `#faculty-directory` page. It includes selected staff from the official IEM directory, roles, departments, research areas, available teaching subjects and links to official profiles. Some directory entries do not expose individual course lists in the public listing; those are explicitly marked for verification rather than inferred. Hostel locations and facility descriptions are sourced from the institutional NAAC self-study report; verify current availability directly with IEM.


## Admin dashboard fixes
- Admin hash routing is now evaluated before public anchor routing, so Programs and Fees stay in the admin shell.
- Website Content now uses structured forms for college profile, scholarships, placements and announcements; faculty and event directories use editable cards instead of raw JSON textareas.
- Reports now include live status bars and a donut-style graphical outcome chart, derived from the database overview endpoint.
- The interface changes are client-side and retain existing authenticated API routes. Verify permissions with Super Admin and staff test accounts.

The Windows launcher now skips `npm install` when dependencies are already present; it only installs or repairs them when required. It no longer deletes `node_modules` or the lockfile on every launch.


## Student account registration (updated)
Student accounts can be created with any syntactically valid email address; Gmail-only restrictions and email OTP verification are not used. The mobile number must contain exactly 10 digits and begin with 6, 7, 8 or 9. Registration immediately creates the student session and opens the admission application. Passwords must be at least 8 characters and include uppercase, lowercase and a number. Email format validation does not prove mailbox ownership, and phone format validation does not prove number ownership.

## Programme catalogue and fee configuration (updated)

The programme catalogue is seeded from `dataset/programs.csv` and includes the published IEM programme families and streams: B.Tech (including CSE, AI, AI & ML, Data Science, IoT, Cyber Security, CSBS, IT, ECE, EE/EEE, Mechanical Engineering and Biotechnology), BBA, BCA, MBA specialisations, MCA, M.Tech specialisations, and Ph.D. research-area categories. Exact intake, eligibility, campus availability and entrance requirements must be confirmed against the current IEM admission notice.

Each programme has three fee components in `dataset/fee_structure.csv`: Tuition Fee (Per Semester), Admission Fee (One-time), and Examination Fee (Per Semester). New fee amounts are intentionally seeded as zero placeholders and display as “To be configured” until an administrator enters the current approved amounts under Admin → Fees. Re-running the launcher preserves administrator-entered fee amounts.

The student application academic section includes an entrance-examination field (IEMJEE, IEM Entrance Exam, WBJEE, JEE Main, CAT, MAT, WBJEMAT or Other). The local public home page remains accessible while a student or administrator is signed in; use “Local Home Page” in the portal sidebar to return to it without signing out.

## Homepage, student application and entrance exam flow (latest update)

- Fresh visits to `http://localhost:4000/` always render the public IEM homepage, even when a valid session cookie exists. The dashboard is opened only through the Student Portal/Admin Login routes.
- `Student Portal` opens the portal chooser. `Apply Now` opens the portal chooser for signed-out users and staff; an authenticated applicant goes directly to their application.
- New student registration creates the account immediately and routes the applicant to the application form. Any syntactically valid email address is accepted; no Gmail-only restriction or email OTP is required. Student login routes to the applicant dashboard.
- Admin login remains separate; student accounts cannot receive staff access through public registration.
- The homepage includes a campus photo carousel (5-second rotation), IEM/UEM logo assets from the official IEM-UEM Dean website, and a direct IEMJEE/IEMCET registration link to https://exam.iem.edu.in/.
- The application academic-details step includes IEMJEE / IEM Entrance Exam and other examination choices.


## Reliability updates (November 2026)

- Header, footer and hero institutional marks are bundled under `public/assets/` and no longer depend on third-party logo hotlinks.
- Five supplied campus photographs are bundled locally under `public/assets/` and the carousel does not depend on external image hosts.
- Registration accepts any syntactically valid email address, requires a 10-digit Indian mobile number beginning 6–9, and a password of at least 8 characters containing uppercase, lowercase and a number.
- Mobile validation checks only the requested format: exactly 10 digits beginning with 6–9. It does not attempt to identify fake numbers or verify ownership.
- Email OTP verification is disabled by design; account creation does not depend on SMTP configuration.
- The IEMJEE/IEMCET navigation includes a login-gated link to the official exam portal and an exam-format/preparation summary.

For 2027 exam dates, eligibility and the authoritative current pattern, always use https://exam.iem.edu.in/ and its current prospectus. The programme-specific preparation guidance and IEMJEE online pattern shown in the site are transcribed from the official exam page.

### Bundled campus photography

The homepage carousel uses five locally bundled WebP photographs in `public/assets/` (`campus-1.webp` through `campus-5.webp`). They are served by the local Express static server and do not depend on third-party image hosts or external image URLs. The order is IEM Gurukul, IEM Ashram, IEM Management House, UEM Jaipur and UEM Kolkata. Institutional logo artwork is also referenced from local `public/assets/` files.
