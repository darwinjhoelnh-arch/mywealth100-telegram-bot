@echo off
cd /d "%~dp0"
powershell -NoProfile -ExecutionPolicy Bypass -Command "Get-CimInstance Win32_Process -Filter \"name = 'node.exe'\" | Where-Object { $_.CommandLine -like '*telegram-auto-bot*src*bot.js*' } | ForEach-Object { Stop-Process -Id $_.ProcessId -Force }"
start "MyWhealt100 Bot" /min node src\bot.js
