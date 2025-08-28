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
git remote add origin https://github.com/%username%/DeepResearch-Web.git 2>nul
if errorlevel 1 (
    echo ⚠️  远程仓库已存在，继续推送...
)

echo.
echo 📤 选择推送方式：
echo 1. 普通推送（推荐）
echo 2. 强制推送（如果普通推送失败）
set /p push_choice="请选择 (1 或 2): "

echo.
echo 📤 推送代码到 GitHub...
git branch -M main

if "%push_choice%"=="2" (
    echo ⚠️  警告：将执行强制推送，这可能覆盖远程更改
    set /p confirm="确认强制推送? (y/N): "
    if /i "%confirm%"=="y" (
        git push --force -u origin main
    ) else (
        echo 取消操作
        pause
        exit /b 1
    )
) else (
    git push -u origin main
    if errorlevel 1 (
        echo.
        echo ❌ 推送失败！可能的原因：
        echo 1. 远程仓库已有不同的提交历史
        echo 2. 没有推送权限
        echo 3. 仓库不存在
        echo.
        echo 💡 解决方案：
        echo 1. 重新运行脚本并选择强制推送 (选项 2)
        echo 2. 检查仓库是否存在且有推送权限
        pause
        exit /b 1
    )
)

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
echo 📖 详细说明请参考 DEPLOYMENT.md 文件
echo.
pause