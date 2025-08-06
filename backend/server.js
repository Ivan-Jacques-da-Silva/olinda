// IMPORTANTE: Carregar dotenv PRIMEIRO, antes de qualquer outra importação
require('dotenv').config();

const express = require('express');
const cors = require('cors');
const fs = require('fs');
const path = require('path');

const { auditarOperacao } = require('./middleware/auditoria');
const apiRoutes = require('./routes/index');
const stripeRoutes = require('./stripe/routes');
const { stripe, STRIPE_CONFIG } = require('./stripe/config');
const { processWebhookEvent } = require('./stripe/webhook');

const app = express();
// const PORT = process.env.PORT || 5000;
const PORT = process.env.PORT || 5055;

// ========== LOG INICIAL ==========
console.log('🔐 ========== VERIFICAÇÃO INICIAL DO .ENV ==========');
console.log('🔐 STRIPE_SECRET_KEY carregada:', process.env.STRIPE_SECRET_KEY ? `${process.env.STRIPE_SECRET_KEY.substring(0, 15)}...` : 'UNDEFINED');
console.log('🔐 STRIPE_PUBLIC_KEY carregada:', process.env.STRIPE_PUBLIC_KEY ? `${process.env.STRIPE_PUBLIC_KEY.substring(0, 15)}...` : 'UNDEFINED');
console.log('🔐 STRIPE_WEBHOOK_SECRET carregada:', process.env.STRIPE_WEBHOOK_SECRET ? `${process.env.STRIPE_WEBHOOK_SECRET.substring(0, 15)}...` : 'UNDEFINED');
console.log('🔐 ===============================================');

// ========== LOGS DE ERRO ==========
const logError = (error, req = null, additionalData = {}) => {
  const timestamp = new Date().toISOString();
  const route = req ? `${req.method} ${req.path}` : 'SYSTEM';
  const ip = req ? (req.ip || req.connection.remoteAddress) : 'UNKNOWN';
  const userAgent = req ? req.headers['user-agent'] : 'UNKNOWN';

  const logEntry = `
[${timestamp}] ${route}
IP: ${ip}
User-Agent: ${userAgent}
ERROR: ${error.message}
Stack: ${error.stack}
Additional Data: ${JSON.stringify(additionalData, null, 2)}
${'='.repeat(80)}
`;

  if (!fs.existsSync('logs')) fs.mkdirSync('logs');
  const logFile = `logs/error-${timestamp.split('T')[0]}.log`;
  fs.appendFileSync(logFile, logEntry);
  console.error(`[${timestamp}] ${route} - ERROR:`, error.message);
};

const logOperation = (operation, req, data = {}) => {
  const timestamp = new Date().toISOString();
  const route = req ? `${req.method} ${req.path}` : 'SYSTEM';
  const ip = req ? (req.ip || req.connection.remoteAddress) : 'UNKNOWN';
  const logEntry = `[${timestamp}] ${route} - ${operation} - IP: ${ip} - Data: ${JSON.stringify(data)}\n`;

  if (!fs.existsSync('logs')) fs.mkdirSync('logs');
  const logFile = `logs/operations-${timestamp.split('T')[0]}.log`;
  fs.appendFileSync(logFile, logEntry);
  console.log(`[${timestamp}] ${route} - ${operation}`);
};

// ========== TRATAMENTO GLOBAL DE ERROS ==========
const errorHandler = (err, req, res, next) => {
  logError(err, req, { body: req.body, params: req.params, query: req.query });

  let mensagem = 'Erro interno do servidor';
  let codigo = 'INTERNAL_ERROR';

  if (err.code === 'P2002') {
    mensagem = 'Dados duplicados encontrados';
    codigo = 'DUPLICATE_DATA';
  } else if (err.code === 'P2025') {
    mensagem = 'Registro não encontrado';
    codigo = 'NOT_FOUND';
  } else if (err.message.includes('Unknown argument')) {
    mensagem = 'Erro de validação dos dados';
    codigo = 'VALIDATION_ERROR';
  }

  res.status(500).json({
    sucesso: false,
    mensagem,
    codigo,
    timestamp: new Date().toISOString()
  });
};

// ========== CORS ==========
const allowedOrigins = [
  'http://localhost:5173',
  'http://127.0.0.1:5173',
  'http://localhost:5000',
  'http://127.0.0.1:5000',
  'https://olindaresidence.com.br',
  'https://api.olindaresidence.com.br'
];

app.use(cors({
  origin: function (origin, callback) {
    // Permitir requisições sem origin (como mobile apps, Postman, etc.)
    if (!origin) return callback(null, true);
    
    if (allowedOrigins.includes(origin)) {
      return callback(null, true);
    }
    
    console.log('🚫 Origin não permitida:', origin);
    return callback(null, false);
  },
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS', 'PATCH'],
  allowedHeaders: [
    'Content-Type', 
    'Authorization', 
    'X-Requested-With',
    'Accept',
    'Origin',
    'Cache-Control',
    'Pragma'
  ],
  credentials: true,
  optionsSuccessStatus: 200,
  maxAge: 86400 // Cache preflight por 24 horas
}));

// Middleware global para headers CORS - executado ANTES das rotas
app.use((req, res, next) => {
  const origin = req.headers.origin;
  
  // Sempre definir o header Access-Control-Allow-Origin
  if (origin && allowedOrigins.includes(origin)) {
    res.header('Access-Control-Allow-Origin', origin);
  } else if (!origin) {
    // Para requisições sem origin (ex: mesmo domínio)
    res.header('Access-Control-Allow-Origin', '*');
  }
  
  res.header('Access-Control-Allow-Methods', 'GET,POST,PUT,DELETE,OPTIONS,PATCH');
  res.header('Access-Control-Allow-Headers', 'Content-Type,Authorization,X-Requested-With,Accept,Origin,Cache-Control,Pragma');
  res.header('Access-Control-Allow-Credentials', 'true');
  res.header('Access-Control-Max-Age', '86400');
  
  // Log para debug
  console.log(`🌐 ${req.method} ${req.path} - Origin: ${origin || 'sem origin'}`);
  
  if (req.method === 'OPTIONS') {
    console.log('✅ Respondendo OPTIONS para', req.path);
    return res.status(200).end();
  }
  
  next();
});

// Webhook de TESTE
app.post('/stripe/webhook/teste', express.raw({ type: 'application/json' }), async (req, res) => {
  const sig = req.headers['stripe-signature'];
  try {
    const event = stripe.webhooks.constructEvent(req.body, sig, STRIPE_CONFIG.webhookSecret);
    console.log('✅ Webhook TESTE recebido:', event.type);
    await processWebhookEvent(event); // usa a mesma função
    res.status(200).json({ received: true });
  } catch (err) {
    console.error('❌ Erro webhook TESTE:', err.message);
    res.status(400).send(`Webhook Error: ${err.message}`);
  }
});

// Webhook REAL
app.post('/stripe/webhook', express.raw({ type: 'application/json' }), async (req, res) => {
  const sig = req.headers['stripe-signature'];
  try {
    const event = stripe.webhooks.constructEvent(req.body, sig, STRIPE_CONFIG.webhookSecret);
    console.log('✅ Webhook REAL recebido:', event.type);
    await processWebhookEvent(event); // mesma função
    res.status(200).json({ received: true });
  } catch (err) {
    console.error('❌ Erro webhook REAL:', err.message);
    res.status(400).send(`Webhook Error: ${err.message}`);
  }
});


// ========== BODY PARSER PARA ROTAS NORMAIS ==========
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// ========== DEBUG MIDDLEWARE ==========
app.use((req, res, next) => {
  console.log(`[${new Date().toISOString()}] ${req.method} ${req.path}`);
  next();
});

// ========== ROTAS ==========
app.use('/stripe', stripeRoutes);
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));
app.use(auditarOperacao);
app.use('/api', apiRoutes);

// ========== START SERVER ==========
app.listen(PORT, '0.0.0.0', () => {
  console.log(`🚀 Servidor rodando em http://0.0.0.0:${PORT}`);
  console.log(`🌐 Frontend deve acessar: http://localhost:${PORT}`);
  console.log(`📊 Sistema de auditoria ativo`);
  console.log(`🔒 Rotas modulares configuradas`);
  console.log('🔧 Verificando configurações do Stripe:');
  console.log('- STRIPE_PUBLIC_KEY:', process.env.STRIPE_PUBLIC_KEY ? 'Configurada' : '❌ NÃO CONFIGURADA');
  console.log('- STRIPE_SECRET_KEY:', process.env.STRIPE_SECRET_KEY ? 'Configurada' : '❌ NÃO CONFIGURADA');
  console.log('- STRIPE_PRODUCT_ID:', process.env.STRIPE_PRODUCT_ID || '❌ NÃO CONFIGURADO');
  console.log('- STRIPE_WEBHOOK_SECRET:', process.env.STRIPE_WEBHOOK_SECRET ? 'Configurado' : '❌ NÃO CONFIGURADO');
});