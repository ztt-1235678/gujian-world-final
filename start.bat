
### `start.bat`

```batch
@echo off
title 古建智境
echo ========================================
echo       古建智境 - 正在启动
echo ========================================
start cmd /k "cd backend && npm run dev"
timeout /t 2 /nobreak >nul
start cmd /k "cd frontend && npm run dev"
echo.
echo 服务启动中...
echo 前端地址: http://localhost:3000
echo 后端地址: http://localhost:5000
echo.
pause