/**
 * Servidor Backend - Proxy para API Embrapa ClimAPI
 * 
 * Resolve problemas de CORS e mantém credenciais OAuth seguras
 * no servidor, longe do código frontend.
 */

import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import rateLimit from 'express-rate-limit';

// Carregar variáveis de ambiente
dotenv.config();
console.log('🔧 Variáveis de ambiente carregadas:');
console.log('🔑 EMBRAPA_CONSUMER_KEY:', process.env.EMBRAPA_CONSUMER_KEY ? 'PRESENTE' : 'AUSENTE');
console.log('🔐 EMBRAPA_CONSUMER_SECRET:', process.env.EMBRAPA_CONSUMER_SECRET ? 'PRESENTE' : 'AUSENTE');
console.log('🌐 EMBRAPA_API_URL:', process.env.EMBRAPA_API_URL);
console.log('🔗 EMBRAPA_TOKEN_URL:', process.env.EMBRAPA_TOKEN_URL);

// Importar rotas após carregar variáveis de ambiente
import weatherRoutes from './src/routes/weather.js';

const app = express();
const PORT = process.env.PORT || 3002;

// Middleware: CORS - permitir requisições do frontend
const allowedOrigins = (process.env.FRONTEND_URL
  ? process.env.FRONTEND_URL.split(',').map((o) => o.trim())
  : ['http://localhost:3000', 'http://localhost:3001']);

app.use(cors({
  origin: (origin, callback) => {
    // Permite requests de ferramentas locais (sem origin) e das origens permitidas
    if (!origin || allowedOrigins.includes(origin)) {
      return callback(null, true);
    }
    return callback(new Error(`Not allowed by CORS: ${origin}`));
  },
  credentials: true
}));

// Middleware: Parse JSON
app.use(express.json());

// Middleware: Rate Limiting - prevenir abuso
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutos
  max: 100, // Máximo 100 requisições por IP
  message: 'Muitas requisições deste IP, tente novamente em 15 minutos.'
});
app.use('/api/', limiter);

// Middleware: Logging de requisições
app.use((req, res, next) => {
  const timestamp = new Date().toISOString();
  console.log(`[${timestamp}] ${req.method} ${req.path}`);
  next();
});

// Health check
app.get('/health', (req, res) => {
  res.json({
    status: 'ok',
    service: 'Galinheiro Backend Proxy',
    version: '1.0.0',
    timestamp: new Date().toISOString()
  });
});

// Rotas da API
app.use('/api/weather', weatherRoutes);

// 404 Handler
app.use((req, res) => {
  res.status(404).json({
    error: 'Rota não encontrada',
    path: req.path
  });
});

// Error Handler
app.use((err, req, res, next) => {
  console.error('❌ Erro no servidor:', err);
  res.status(500).json({
    error: 'Erro interno do servidor',
    message: process.env.NODE_ENV === 'development' ? err.message : undefined
  });
});

// Iniciar servidor
app.listen(PORT, () => {
  console.log('🚀 ================================');
  console.log(`🚀 Backend Proxy iniciado!`);
  console.log(`🚀 Porta: ${PORT}`);
  console.log(`🚀 Ambiente: ${process.env.NODE_ENV || 'development'}`);
  console.log(`🚀 Frontend permitido: ${allowedOrigins.join(', ')}`);
  console.log('🚀 ================================');
});
