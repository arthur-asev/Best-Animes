$ErrorActionPreference = 'Stop'

$Root = Split-Path -Parent $PSScriptRoot
Set-Location $Root

Write-Host "[1/5] Validando projeto..." -ForegroundColor Cyan
if (-not (Test-Path "$Root\package.json")) { throw "package.json não encontrado na raiz: $Root" }
if (-not (Test-Path "$Root\backend\package.json")) { throw "backend/package.json não encontrado" }
if (-not (Test-Path "$Root\docker-compose.yml")) { throw "docker-compose.yml não encontrado" }

Write-Host "[2/5] Validando Docker Compose..." -ForegroundColor Cyan
docker compose config | Out-Null

Write-Host "[3/5] Construindo Kuhi..." -ForegroundColor Cyan
docker compose build kuhi

Write-Host "[4/5] Subindo stack..." -ForegroundColor Cyan
docker compose up -d

Write-Host "[5/5] Estado dos containers..." -ForegroundColor Cyan
docker compose ps

Write-Host "`nTeste:`n  http://localhost:3000`n  http://localhost:5000/health`n  http://localhost:5000/api/anime/providers/status" -ForegroundColor Green
