# 將 autoparts-hk 推送到 GitHub（需先在網站建立空倉庫）
# 用法：在專案根目錄執行  powershell -ExecutionPolicy Bypass -File scripts/push-to-github.ps1 -Owner 你的GitHub用戶名

param(
    [Parameter(Mandatory = $false)]
    [string]$Owner = "bangigiqq",
    [string]$Repo = "autoparts-hk"
)

$ErrorActionPreference = "Stop"
$root = Split-Path $PSScriptRoot -Parent
Set-Location $root

if (-not (Test-Path ".git")) {
    git init
    git add -A
    git commit -m "欣榮汽配電商站"
}

$remote = "https://github.com/$Owner/$Repo.git"
git branch -M main 2>$null
git remote remove origin 2>$null
git remote add origin $remote

Write-Host ""
Write-Host "即將推送到: $remote" -ForegroundColor Cyan
Write-Host "若尚未建立倉庫，請先開啟: https://github.com/new?name=$Repo" -ForegroundColor Yellow
Write-Host ""

git push -u origin main

if ($LASTEXITCODE -eq 0) {
    Write-Host ""
    Write-Host "成功！在瀏覽器開啟:" -ForegroundColor Green
    Write-Host "  https://github.com/$Owner/$Repo" -ForegroundColor Green
}
