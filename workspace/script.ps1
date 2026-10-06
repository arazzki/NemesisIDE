# PowerShell Script Demo di Nemesis IDE
Write-Host "⚡ Menjalankan PowerShell di Nemesis IDE!" -ForegroundColor Cyan
$info = Get-Date
Write-Host "Waktu saat ini: $info" -ForegroundColor Green
Write-Host "OS: $((Get-CimInstance Win32_OperatingSystem).Caption)" -ForegroundColor Yellow
