# Project Structure – IEM Admission Portal

Below is a **complete listing of every source file** you need to open in VS Code. All paths are absolute (Windows style) and you can click them to open the file directly in the editor.

---

## Root

- [package.json](file:///C:/Users/shlok/.gemini/antigravity/scratch/IEM_Admission_Portal/package.json)
- [.env.example](file:///C:/Users/shlok/.gemini/antigravity/scratch/IEM_Admission_Portal/.env.example)
- [README.md](file:///C:/Users/shlok/.gemini/antigravity/scratch/IEM_Admission_Portal/README.md)

---

## Prisma folder

- [prisma/schema.prisma](file:///C:/Users/shlok/.gemini/antigravity/scratch/IEM_Admission_Portal/prisma/schema.prisma)
- [prisma/seed.js](file:///C:/Users/shlok/.gemini/antigravity/scratch/IEM_Admission_Portal/prisma/seed.js)

---

## API package ( @iem/api )

- [packages/api/package.json](file:///C:/Users/shlok/.gemini/antigravity/scratch/IEM_Admission_Portal/packages/api/package.json)
- [packages/api/src/index.js](file:///C:/Users/shlok/.gemini/antigravity/scratch/IEM_Admission_Portal/packages/api/src/index.js)
- [packages/api/src/middleware/auth.js](file:///C:/Users/shlok/.gemini/antigravity/scratch/IEM_Admission_Portal/packages/api/src/middleware/auth.js)
- [packages/api/src/utils/jwt.js](file:///C:/Users/shlok/.gemini/antigravity/scratch/IEM_Admission_Portal/packages/api/src/utils/jwt.js)
- [packages/api/src/routes/auth.js](file:///C:/Users/shlok/.gemini/antigravity/scratch/IEM_Admission_Portal/packages/api/src/routes/auth.js)
- [packages/api/src/routes/me.js](file:///C:/Users/shlok/.gemini/antigravity/scratch/IEM_Admission_Portal/packages/api/src/routes/me.js)
- [packages/api/src/routes/password.js](file:///C:/Users/shlok/.gemini/antigravity/scratch/IEM_Admission_Portal/packages/api/src/routes/password.js)
- [packages/api/src/routes/program.js](file:///C:/Users/shlok/.gemini/antigravity/scratch/IEM_Admission_Portal/packages/api/src/routes/program.js)
- [packages/api/src/routes/faculty.js](file:///C:/Users/shlok/.gemini/antigravity/scratch/IEM_Admission_Portal/packages/api/src/routes/faculty.js)
- [packages/api/src/routes/event.js](file:///C:/Users/shlok/.gemini/antigravity/scratch/IEM_Admission_Portal/packages/api/src/routes/event.js)
- [packages/api/src/routes/fee.js](file:///C:/Users/shlok/.gemini/antigravity/scratch/IEM_Admission_Portal/packages/api/src/routes/fee.js)
- [packages/api/src/routes/analytics.js](file:///C:/Users/shlok/.gemini/antigravity/scratch/IEM_Admission_Portal/packages/api/src/routes/analytics.js)
- [packages/api/src/routes/application.js](file:///C:/Users/shlok/.gemini/antigravity/scratch/IEM_Admission_Portal/packages/api/src/routes/application.js)
- [packages/api/tests/auth.test.js](file:///C:/Users/shlok/.gemini/antigravity/scratch/IEM_Admission_Portal/packages/api/tests/auth.test.js)

---

## Web (frontend) package ( @iem/web )

- [packages/web/package.json](file:///C:/Users/shlok/.gemini/antigravity/scratch/IEM_Admission_Portal/packages/web/package.json)
- [packages/web/vite.config.js](file:///C:/Users/shlok/.gemini/antigravity/scratch/IEM_Admission_Portal/packages/web/vite.config.js)
- [packages/web/tailwind.config.cjs](file:///C:/Users/shlok/.gemini/antigravity/scratch/IEM_Admission_Portal/packages/web/tailwind.config.cjs)
- [packages/web/postcss.config.cjs](file:///C:/Users/shlok/.gemini/antigravity/scratch/IEM_Admission_Portal/packages/web/postcss.config.cjs)
- [packages/web/src/main.jsx](file:///C:/Users/shlok/.gemini/antigravity/scratch/IEM_Admission_Portal/packages/web/src/main.jsx)
- [packages/web/src/App.jsx](file:///C:/Users/shlok/.gemini/antigravity/scratch/IEM_Admission_Portal/packages/web/src/App.jsx)
- [packages/web/src/index.css](file:///C:/Users/shlok/.gemini/antigravity/scratch/IEM_Admission_Portal/packages/web/src/index.css)
- [packages/web/src/components/Navbar.jsx](file:///C:/Users/shlok/.gemini/antigravity/scratch/IEM_Admission_Portal/packages/web/src/components/Navbar.jsx)
- [packages/web/src/components/Footer.jsx](file:///C:/Users/shlok/.gemini/antigravity/scratch/IEM_Admission_Portal/packages/web/src/components/Footer.jsx)
- [packages/web/src/components/ProtectedRoute.jsx](file:///C:/Users/shlok/.gemini/antigravity/scratch/IEM_Admission_Portal/packages/web/src/components/ProtectedRoute.jsx)
- [packages/web/src/components/Toast.jsx](file:///C:/Users/shlok/.gemini/antigravity/scratch/IEM_Admission_Portal/packages/web/src/components/Toast.jsx)
- [packages/web/src/routes/Public.jsx](file:///C:/Users/shlok/.gemini/antigravity/scratch/IEM_Admission_Portal/packages/web/src/routes/Public.jsx)
- [packages/web/src/routes/Student.jsx](file:///C:/Users/shlok/.gemini/antigravity/scratch/IEM_Admission_Portal/packages/web/src/routes/Student.jsx)
- [packages/web/src/routes/Admin.jsx](file:///C:/Users/shlok/.gemini/antigravity/scratch/IEM_Admission_Portal/packages/web/src/routes/Admin.jsx)
- **Pages (each a separate file):**
  - Home.jsx, About.jsx, Courses.jsx, Faculty.jsx, Fees.jsx, CampusLife.jsx, Events.jsx, Placements.jsx, News.jsx, FAQ.jsx, Contact.jsx, Register.jsx, Login.jsx, AdmissionWizard.jsx, ResetPassword.jsx, StudentDashboard.jsx, AdminDashboard.jsx (all located under `packages/web/src/pages/`).

---

## How to open the project in VS Code

1. **Open VS Code**.
2. Choose **File → Open Folder…** and navigate to the extracted folder, e.g.:
   ```
   C:\Users\shlok\Desktop\IEM_Admission_Portal   (or wherever you extracted the ZIP)
   ```
3. VS Code will display the workspace tree exactly as shown above. All files are editable.
4. Open a terminal inside VS Code (**Ctrl+`**) – it will start in the project root.
5. Follow the **setup commands** (the same ones that work in PowerShell):
   ```bash
   npm install                     # install deps for both packages
   npx prisma migrate dev --name init   # create SQLite dev.db
   node prisma/seed.js                     # load demo data
   npm run dev                     # start API + React dev servers
   ```
6. The terminal will show two processes (API on **localhost:4000**, Vite on **localhost:5173**). Open a browser to `http://localhost:5173/` to see the portal.

---

## Quick sanity‑check (run inside VS Code terminal)
```bash
# Verify API health
curl http://localhost:4000/api/health
# Should return {"status":"ok"}

# Run the Jest test suite
npm --workspace @iem/api test
```
If those commands succeed you are ready to develop further.

---

### Need anything else?
If you want additional scripts (e.g., Dockerfile, CI config) or further documentation, just let me know and I’ll add them.
