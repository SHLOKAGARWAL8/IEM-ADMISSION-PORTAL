$ErrorActionPreference = "Stop"
Set-Location $PSScriptRoot

Write-Host "`n=== IEM Admission Portal ===" -ForegroundColor Cyan
if (-not (Test-Path ".\package.json")) { throw "package.json not found. Run this script from the swe folder." }

$pkg = Get-Content ".\package.json" -Raw
if ($pkg -match '"better-sqlite3"') { throw "Old project copy detected. Extract the latest IEM_Admission_Portal_Programme_Fees_Home_Flow.zip into a clean folder." }

$nodeVersion = (node -p "process.versions.node").Trim()
$nodeMajorMinor = [version]("$($nodeVersion.Split('.')[0]).$($nodeVersion.Split('.')[1])")
if ($nodeMajorMinor -lt [version]"22.5") { throw "Node.js 22.5 or newer is required. Detected: $nodeVersion" }

$depsReady = (Test-Path ".\node_modules\express") -and (Test-Path ".\node_modules\dotenv") -and (Test-Path ".\node_modules\nodemailer") -and (Test-Path ".\node_modules\better-sqlite3") -eq $false
if (-not $depsReady) {
    Write-Host "`nInstalling / repairing dependencies (only when needed)..." -ForegroundColor Cyan
    npm install
    if ($LASTEXITCODE -ne 0) { throw "Dependency installation failed. The server was not started." }
} else {
    Write-Host "`nDependencies already installed; skipping npm install." -ForegroundColor Green
}

if (-not (Test-Path ".\.env")) {
    if (Test-Path ".\.env.example") { Copy-Item ".\.env.example" ".\.env" }
}

Write-Host "`nPreparing database and importing initial sample data..." -ForegroundColor Cyan
npm run seed
if ($LASTEXITCODE -ne 0) { throw "Database seeding failed. The server was not started." }

Write-Host "`nStarting IEM Admission Portal..." -ForegroundColor Cyan
Write-Host "Open http://localhost:4000" -ForegroundColor Green
npm start
