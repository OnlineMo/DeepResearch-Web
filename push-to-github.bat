@echo off
chcp 65001 >nul
echo === DeepResearch Web GitHub 推送脚本 ===
echo.

REM 检查是否在正确的目录
if not exist "package.json" (
    echo ❌ 错误：请在 deepresearch-web 项目根目录运行此脚本
    pause
    exit /b 1
)

set /p username="📝 请输入您的 GitHub 用户名: "

if "%username%"=="" (
    echo ❌ 错误：用户名不能为空
    pause
    exit /b 1
)

echo.
echo 🔗 添加远程仓库...
git remote add origin https://github.com/%username%/DeepResearch-Web.git

echo.
echo 📤 推送代码到 GitHub...
git branch -M main
git push -u origin main

echo.
echo ✅ 代码推送完成！
echo.
echo 🌐 下一步：配置 GitHub Pages
echo 1. 访问: https://github.com/%username%/DeepResearch-Web/settings/pages
echo 2. Source 选择: GitHub Actions
echo 3. 保存设置
echo.
echo 🚀 推送后将自动触发部署，网站地址：
echo    https://%username%.github.io/DeepResearch-Web
echo.
pause