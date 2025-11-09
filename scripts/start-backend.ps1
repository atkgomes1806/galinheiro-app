#!/usr/bin/env powershell

# Script para iniciar o backend do galinheiro-app
# 🎯 Objetivo: Facilitar o início do servidor backend com dados reais

Write-Host "🚀 === INICIANDO BACKEND GALINHEIRO-APP ===" -ForegroundColor Green

# Navegar para o diretório do backend
$BackendPath = "C:\Projetos\galinheiro-app\galinheiro-app\backend"

if (-not (Test-Path $BackendPath)) {
    Write-Host "❌ Erro: Diretório do backend não encontrado em $BackendPath" -ForegroundColor Red
    exit 1
}

Write-Host "📁 Navegando para: $BackendPath" -ForegroundColor Blue
Set-Location $BackendPath

# Verificar se server.js existe
if (-not (Test-Path "server.js")) {
    Write-Host "❌ Erro: Arquivo server.js não encontrado no diretório do backend" -ForegroundColor Red
    exit 1
}

# Verificar se node_modules existe
if (-not (Test-Path "node_modules")) {
    Write-Host "⚠️ Aviso: node_modules não encontrado. Instalando dependências..." -ForegroundColor Yellow
    npm install
}

Write-Host "🔧 Verificando variáveis de ambiente..." -ForegroundColor Blue
if (Test-Path ".env") {
    Write-Host "✅ Arquivo .env encontrado" -ForegroundColor Green
} else {
    Write-Host "⚠️ Aviso: Arquivo .env não encontrado" -ForegroundColor Yellow
}

Write-Host "🎯 Iniciando servidor backend..." -ForegroundColor Blue
Write-Host "📋 Backend estará disponível em: http://localhost:3002" -ForegroundColor Cyan
Write-Host "🌡️ Endpoint dados reais: /api/weather/data-real" -ForegroundColor Cyan
Write-Host "🔄 Endpoint dados simulados: /api/weather/data" -ForegroundColor Cyan
Write-Host "" 

node server.js