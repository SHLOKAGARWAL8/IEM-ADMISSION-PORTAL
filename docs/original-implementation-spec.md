# Antigravity Build Prompt — IEM Admission Portal

You are a senior full-stack engineer, product designer, QA engineer, and security-minded architect.
Build a complete, runnable, responsive college admissions portal inspired by
`reference/iem_admission_wireframe.jpg`. Treat the image as a workflow/layout reference, not as a
reason to create a static mockup. The result must be a functional application with real navigation,
forms, persistence, validation, role-based access, and tests.

## Product vision
Create a polished, modern, trustworthy college website and admissions platform for Institute of
Engineering & Management (IEM). It should look like a real college portal: professional, energetic,
student-friendly, photo-rich, and credible—not like a generic admin template. Use a clean light theme
as the default, strong typography, restrained brand colors, generous whitespace, subtle motion,
responsive cards, clear status badges, accessible contrast, and an optional dark mode. Avoid fake
claims. Label all supplied sample records as demo/sample data until replaced with verified official
information.

## Mandatory workflows from the wireframe
1. Public landing page with navigation: Home, About, Academics/Courses, Admissions, Campus Life,
   Faculty, Fees & Scholarships, Events/Fests, Contact.
2. Registration: full name, email, phone, password, confirm password, terms checkbox; validate all
   fields and prevent duplicate accounts.
3. Login/logout, forgot-password flow, session handling, and protected routes.
4. Applicant dashboard: application ID, progress steps, quick actions, notifications, application
   status and next steps.
5. Multi-step application form: personal details, contact/address, academic qualifications, course
   and specialization preference, category where legally appropriate, guardian/emergency details,
   declarations, preview and final submit. Save drafts and resume later.
6. Document upload: 10th/12th marksheets, graduation marksheet where applicable, photo, signature,
   ID proof and other configurable documents. Validate file type and size, show upload progress and
   uploaded-file state. Do not trust client-side validation alone.
7. Application status timeline: Draft → Submitted → Under Review → Documents Required/Verification
   → Shortlisted/Decision → Approved/Rejected/Waitlisted, with timestamps and admin notes. Status
   transitions must be controlled by server-side role permissions.
8. Admin dashboard: summary KPIs, searchable/filterable/paginated applications, applicant detail,
   document verification, status decisions, course/program management, user/role management, reports,
   audit trail and settings.
9. Role-based access: public visitor, applicant, admissions officer, administrator. Applicants must
   never see other applicants' private data. Admin actions must be authorized on the server, not just
   hidden in the UI.
10. Responsive design for mobile, tablet and desktop; accessible labels, keyboard navigation, useful
    empty/loading/error states, confirmations for destructive actions, and toast feedback.

## Real college information sections (essential addition)
Build rich public pages with editable content and image upload/slots:
- College overview, history, mission, vision, accreditation/recognition fields, campus locations and
  facilities.
- Courses/programs: degree, department, duration, eligibility, intake, specializations, curriculum
  overview, career outcomes, fees, scholarship options and application CTA.
- Faculty directory: name, designation, department, qualifications, research interests, profile photo,
  publications/portfolio links.
- Fees & scholarships: itemized fee structure, payment schedule, refundable/non-refundable labels,
  scholarship/financial aid information and a clear disclaimer that final fees must be confirmed by
  the institution.
- Campus life: laboratories, library, clubs, sports, hostels, transport, student support, placements,
  innovation/incubation and campus facilities.
- Fests/events: event cards with photos, dates, descriptions, registration links, gallery and past-event
  highlights.
- Placements/career services: editable statistics and company/logo gallery, with all demo statistics
  clearly labelled sample until verified.
- News/announcements, FAQs, contact form, campus map/embed placeholder and social links.
- Photo gallery with upload/replace/remove support and alt text. Use local placeholders where no
  licensed images are provided; never hotlink random images without permission.
- Add prominent CTA buttons: Explore Programs, Check Eligibility, Apply Now, Download Prospectus.

## UI guidance
Use the supplied wireframe for the key pages: Landing, Register, Login, Applicant Dashboard,
Application Form, Upload Documents, Application Status, Admin Dashboard. Improve the visual design
substantially while retaining these workflows. Include a consistent header/footer, breadcrumbs on
internal pages, responsive sidebar for dashboards, clear active states, and polished charts/tables.
Create dedicated public pages for About, Courses, Faculty, Fees, Campus Life, Fests & Events, Placements,
News, FAQ and Contact.

## Technical implementation
First inspect the existing repository and keep its current framework where practical. Do not blindly
overwrite working code. If the repository is empty, choose a maintainable stack:
- Frontend: React + TypeScript + Vite, Tailwind CSS, React Router, accessible reusable components.
- Backend: Node.js + Express + TypeScript (or the repository's established backend framework).
- Database: PostgreSQL with migrations and seed scripts; SQLite is acceptable for a simple local demo
  only if the production migration path is documented.
- Authentication: secure password hashing (Argon2/bcrypt), HttpOnly secure cookies or a documented
  secure token strategy, rate limiting, CSRF protection where relevant, server-side validation.
- File storage: local development storage behind a storage adapter; document how to swap to S3/GCS.
- Validation: shared schemas where possible; never store raw passwords or expose secrets to frontend.
- Configuration: `.env.example`, no real secrets in Git, clear setup instructions.
- Tests: unit tests for validation and business rules, API integration tests, and UI smoke tests for
  register/login/application/document upload/status/admin permissions.

If the repository already has a different stack, use it unless there is a compelling reason to migrate.
Implement in small, coherent stages and keep the app runnable after each stage.

## Data model (at minimum)
Users, ApplicantProfiles, Programs, FacultyProfiles, FeeStructures, Scholarships, Events, GalleryItems,
Applications, AcademicRecords, UploadedDocuments, ApplicationStatusHistory, Notifications, ContactMessages,
Roles/Permissions, AuditLogs, SiteContent.

## Security, privacy and reliability
- Do not use real student personal data. The provided dataset is synthetic and only for development.
- Validate all input server-side; parameterize database queries; sanitize rich text; protect against
  SQL injection, XSS, CSRF, brute-force login and unauthorized object access.
- Enforce file size/type limits and use generated filenames; do not execute uploads.
- Minimize personal data and keep applicant documents private; never expose document URLs publicly.
- Add pagination and sensible limits. Avoid logging passwords, tokens, or document contents.
- Provide account deletion/data retention notes and privacy/terms pages.
- Use `.env.example` and fail safely when required configuration is missing.
- Do not fabricate official IEM faculty, fees, placements, accreditation or admissions deadlines.
  Put editable demo content in the database and mark it clearly for replacement with verified details.

## Dataset
Use the CSV/JSON files in `dataset/` as synthetic seed data. Load them with an idempotent seed script.
Keep sample data separate from production. Do not use the sample accounts as real credentials.

## Required deliverables
1. Fully working application, not just screens or a clickable prototype.
2. Database schema/migrations and idempotent seed script.
3. `.env.example`, `.gitignore`, and setup/run instructions in README.
4. A clear list of implemented features and any remaining limitations.
5. Automated tests and actual test results. Never claim tests passed unless you ran them.
6. Demo mode instructions and safe sample accounts generated locally by the seed script.
7. Responsive screenshot checklist and basic accessibility checklist.
8. No placeholder buttons that do nothing; every visible action must work or be explicitly labelled
   “Coming soon” with a reason.
9. Keep all work in the current project folder. Do not delete existing user work without asking.
10. Before finishing, run lint/typecheck/tests/build, fix errors, start the app and verify the major flows.

## Build sequence
Phase A: inspect repository, summarize current stack, identify existing code and risks.
Phase B: implement design system, public college pages, navigation and photo slots.
Phase C: implement database, seed data, auth and roles.
Phase D: implement applicant form, draft saving, document upload and status timeline.
Phase E: implement admin workflows, reports, audit log and content management.
Phase F: run automated tests, fix defects, document setup and report exact verified results.

Start with Phase A, then proceed through the phases without stopping at a static UI. If credentials,
official college content or external service keys are unavailable, implement a safe local/demo fallback
and document exactly what needs to be configured.
