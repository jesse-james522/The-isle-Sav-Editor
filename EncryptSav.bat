@echo off
setlocal
set SCRIPT_DIR=%~dp0
node "%SCRIPT_DIR%isle_sav_tool.js" encrypt "%~1" "%~dpn1.sav"
pause