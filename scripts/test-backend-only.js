/**
 * Script para iniciar o backend e testar
 * Resolve o problema de caminho de uma vez por todas
 */

const { spawn } = require('child_process');
const http = require('http');
const path = require('path');

const BACKEND_PATH = 'C:\\Projetos\\galinheiro-app\\galinheiro-app\\backend';
const BACKEND_URL = 'http://localhost:3002/api/weather/data-real';

function testBackendResponse() {
    return new Promise((resolve) => {
        const req = http.request(BACKEND_URL, (res) => {
            console.log(`✅ Backend respondendo! Status: ${res.statusCode}`);
            res.on('data', (chunk) => {
                console.log(`📊 Dados recebidos: ${chunk.toString().substring(0, 100)}...`);
            });
            resolve(true);
        });
        
        req.on('error', () => {
            console.log('❌ Backend não está respondendo ainda...');
            resolve(false);
        });
        
        req.end();
    });
}

async function startAndTestBackend() {
    console.log('🚀 Iniciando backend no caminho correto...');
    console.log(`📁 Caminho: ${BACKEND_PATH}`);
    
    // Iniciar o backend
    const backend = spawn('node', ['server.js'], {
        cwd: BACKEND_PATH,
        stdio: 'pipe'
    });
    
    backend.stdout.on('data', (data) => {
        console.log(`Backend: ${data.toString().trim()}`);
    });
    
    backend.stderr.on('data', (data) => {
        console.log(`Erro Backend: ${data.toString().trim()}`);
    });
    
    // Aguardar um pouco e testar
    console.log('⏳ Aguardando backend inicializar...');
    setTimeout(async () => {
        await testBackendResponse();
        
        console.log('');
        console.log('🎯 Backend está rodando!');
        console.log('🌐 Acesse: http://localhost:3002/api/weather/data-real');
        console.log('');
        console.log('Para parar o backend, pressione Ctrl+C');
        
    }, 3000);
}

startAndTestBackend();