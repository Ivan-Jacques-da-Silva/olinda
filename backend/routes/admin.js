const express = require('express');
const multer = require('multer');
const { PrismaClient } = require('@prisma/client');
const { registrarHistorico } = require('../middleware/auditoria');
const { authenticateAdmin } = require('../middleware/auth');

const router = express.Router();
const prisma = new PrismaClient();



// Configuração do multer
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    const fs = require('fs');

    let uploadDir = './uploads/';

    // Definir pasta específica baseada no tipo de arquivo
    if (file.fieldname === 'planta') {
      uploadDir = './uploads/seedPlanta/';
    } else if (file.fieldname === 'imagem') {
      uploadDir = './uploads/seedImg/';
    }

    // Criar diretório se não existir
    if (!fs.existsSync(uploadDir)) {
      fs.mkdirSync(uploadDir, { recursive: true });
      console.log(`📁 Diretório ${uploadDir} criado`);
    }

    console.log(`📂 Salvando ${file.fieldname} em: ${uploadDir}`);
    cb(null, uploadDir);
  },
  filename: (req, file, cb) => {
    // Gerar nome único para evitar conflitos
    const timestamp = Date.now();
    const originalName = file.originalname.replace(/[^a-zA-Z0-9.-]/g, '_');
    const filename = `${timestamp}-${originalName}`;
    console.log('📎 Arquivo salvo como:', filename);
    cb(null, filename);
  }
});

const upload = multer({ 
  storage,
  limits: { 
    fileSize: 10 * 1024 * 1024, // 10MB
    fieldSize: 1024 * 1024 // 1MB para campos de texto
  },
  fileFilter: (req, file, cb) => {
    console.log('🔍 Validando arquivo:', {
      fieldname: file.fieldname,
      originalname: file.originalname,
      mimetype: file.mimetype,
      size: file.size
    });

    // Permitir apenas imagens e PDFs
    const allowedTypes = [
      'image/jpeg', 'image/jpg', 'image/png', 'image/gif', 'image/webp',
      'application/pdf'
    ];

    if (allowedTypes.includes(file.mimetype)) {
      cb(null, true);
    } else {
      cb(new Error(`Tipo de arquivo não permitido: ${file.mimetype}`), false);
    }
  }
});


// Listar salas para admin
router.get('/salas', authenticateAdmin, async (req, res) => {
  try {
    console.log('🔍 Admin solicitando salas...');

    const { page = 1, limit = 100, search = '', disponivel } = req.query;
    const skip = (parseInt(page) - 1) * parseInt(limit);

    const where = {};

    if (search) {
      where.OR = [
        { nome: { contains: search, mode: 'insensitive' } },
        { numero: { contains: search, mode: 'insensitive' } },
        { posicao: { contains: search, mode: 'insensitive' } }
      ];
    }

    if (disponivel !== undefined) {
      where.disponivel = disponivel === 'true';
    }

    const [salas, total] = await Promise.all([
      prisma.sala.findMany({
        where,
        skip,
        // take: parseInt(limit),
        orderBy: [
          { andar: 'asc' },
          { numero: 'desc' }
        ]
      }),
      prisma.sala.count({ where })
    ]);

    // console.log(`✅ Admin: ${salas.length} salas encontradas`);

    res.json({
      sucesso: true,
      data: salas,
      pagination: {
        total,
        page: parseInt(page),
        limit: parseInt(limit),
        totalPages: Math.ceil(total / parseInt(limit))
      }
    });
  } catch (error) {
    console.error('❌ Erro ao buscar salas (admin):', error);
    res.status(500).json({
      sucesso: false,
      mensagem: 'Erro ao buscar salas: ' + error.message
    });
  }
});

// Alias para listagem de salas (compatibilidade)
router.get('/salas-list', authenticateAdmin, async (req, res) => {
  try {
    const { page = 1, limit = 10, search = '', disponivel } = req.query;

    const skip = (parseInt(page) - 1) * parseInt(limit);

    const where = {};

    if (search) {
      where.OR = [
        { nome: { contains: search, mode: 'insensitive' } },
        { numero: { contains: search, mode: 'insensitive' } },
        { posicao: { contains: search, mode: 'insensitive' } }
      ];
    }

    if (disponivel !== undefined) {
      where.disponivel = disponivel === 'true';
    }

    const [salas, total] = await Promise.all([
      prisma.sala.findMany({
        where,
        skip,
        take: parseInt(limit),
        orderBy: [
          { andar: 'asc' },
          { numero: 'asc' }
        ]
      }),
      prisma.sala.count({ where })
    ]);

    res.json({
      sucesso: true,
      data: salas,
      pagination: {
        total,
        page: parseInt(page),
        limit: parseInt(limit),
        totalPages: Math.ceil(total / parseInt(limit))
      }
    });
  } catch (error) {
    console.error('Erro ao buscar salas:', error);
    res.status(500).json({
      sucesso: false,
      mensagem: 'Erro ao buscar salas: ' + error.message
    });
  }
});

// Criar nova sala
router.post('/salas', authenticateAdmin, upload.fields([
  { name: 'imagem', maxCount: 1 },
  { name: 'planta', maxCount: 1 },
  { name: 'proposta_pdf', maxCount: 1 }
]), async (req, res) => {
  try {
    const {
      numero, andar, nome, area, posicao, preco, disponivel
    } = req.body;

    const imagemFile = req.files?.imagem?.[0];
    const plantaFile = req.files?.planta?.[0];
    const propostaPdfFile = req.files?.proposta_pdf?.[0];

    const dadosSala = {
      numero,
      andar: parseInt(andar),
      nome,
      area: parseFloat(area),
      posicao,
      preco: parseFloat(preco),
      disponivel: disponivel === 'true' || disponivel === true,
      imagem: imagemFile?.filename,
      planta: plantaFile?.filename,
      proposta_pdf: propostaPdfFile?.filename
    };

    const sala = await prisma.sala.create({
      data: dadosSala
    });

    // Registrar no histórico
    await registrarHistorico(req, 'CREATE', 'salas', sala.id, null, dadosSala);

    res.json({
      sucesso: true,
      mensagem: 'Sala criada com sucesso!',
      data: sala
    });
  } catch (error) {
    console.error('Erro ao criar sala:', error);
    res.status(500).json({
      sucesso: false,
      mensagem: 'Erro ao criar sala: ' + error.message
    });
  }
});

// Atualizar sala
router.put('/salas/:id', authenticateAdmin, upload.fields([
  { name: 'imagem', maxCount: 1 },
  { name: 'planta', maxCount: 1 },
  { name: 'proposta_pdf', maxCount: 1 }
]), async (req, res) => {
  try {
    const { id } = req.params;

    // Log inicial para debug
    console.log('🔧 Iniciando edição de sala:', {
      salaId: id,
      body: req.body,
      files: req.files ? Object.keys(req.files) : 'nenhum arquivo',
      hasAuth: !!req.headers.authorization
    });

    // Validar ID da sala
    if (!id || isNaN(parseInt(id))) {
      return res.status(400).json({
        sucesso: false,
        mensagem: 'ID da sala inválido'
      });
    }

    // Buscar sala atual para comparação
    const salaAntes = await prisma.sala.findUnique({
      where: { id: parseInt(id) }
    });

    if (!salaAntes) {
      return res.status(404).json({
        sucesso: false,
        mensagem: 'Sala não encontrada'
      });
    }

    const {
      numero, andar, nome, area, posicao, preco, disponivel
    } = req.body;

    // Validações obrigatórias
    if (!numero || !nome || !andar || !area || !preco) {
      console.error('❌ Campos obrigatórios faltando:', {
        numero: !!numero,
        nome: !!nome, 
        andar: !!andar,
        area: !!area,
        preco: !!preco
      });

      return res.status(400).json({
        sucesso: false,
        mensagem: 'Campos obrigatórios: número, nome, andar, área e preço'
      });
    }

    // Converter e validar tipos
    const andarNum = parseInt(andar);
    const areaNum = parseFloat(area);
    const precoNum = parseFloat(preco);

    if (isNaN(andarNum) || isNaN(areaNum) || isNaN(precoNum)) {
      console.error('❌ Tipos de dados inválidos:', {
        andar: andarNum,
        area: areaNum,
        preco: precoNum
      });

      return res.status(400).json({
        sucesso: false,
        mensagem: 'Tipos de dados inválidos: andar, área e preço devem ser números'
      });
    }

    const imagemFile = req.files?.imagem?.[0];
    const plantaFile = req.files?.planta?.[0];
    const propostaPdfFile = req.files?.proposta_pdf?.[0];

    const updateData = {
      numero: String(numero),
      andar: andarNum,
      nome: String(nome),
      area: areaNum,
      posicao: String(posicao || ''),
      preco: precoNum,
      disponivel: disponivel === 'true' || disponivel === true
    };

    // Adicionar arquivos se enviados
    if (imagemFile) {
      console.log('📷 Arquivo de imagem recebido:', imagemFile.filename);
      updateData.imagem = imagemFile.filename;
    }
    if (plantaFile) {
      console.log('📋 Arquivo de planta recebido:', plantaFile.filename);
      updateData.planta = plantaFile.filename;
    }
    if (propostaPdfFile) {
      console.log('📄 Arquivo PDF recebido:', propostaPdfFile.filename);
      updateData.proposta_pdf = propostaPdfFile.filename;
    }

    console.log('🔄 Dados para atualização:', updateData);

    const sala = await prisma.sala.update({
      where: { id: parseInt(id) },
      data: updateData
    });

    // Registrar no histórico
    await registrarHistorico(req, 'UPDATE', 'salas', sala.id, salaAntes, updateData);

    console.log('✅ Sala atualizada com sucesso:', {
      salaId: sala.id,
      nome: sala.nome,
      numero: sala.numero
    });

    res.json({
      sucesso: true,
      mensagem: 'Sala atualizada com sucesso!',
      data: sala
    });
  } catch (error) {
    // Log detalhado do erro
    const fs = require('fs');
    const timestamp = new Date().toISOString();
    const logEntry = `
[${timestamp}] PUT /api/admin/salas/${req.params.id}
IP: ${req.ip || req.connection.remoteAddress}
User-Agent: ${req.headers['user-agent']}
ERROR: ${error.message}
Stack: ${error.stack}
Body: ${JSON.stringify(req.body, null, 2)}
Files: ${req.files ? JSON.stringify(Object.keys(req.files)) : 'nenhum'}
${'='.repeat(80)}
`;

    if (!fs.existsSync('logs')) {
      fs.mkdirSync('logs');
    }

    const logFile = `logs/error-${timestamp.split('T')[0]}.log`;
    fs.appendFileSync(logFile, logEntry);

    console.error('❌ Erro detalhado na edição da sala:', {
      salaId: req.params.id,
      erro: error.message,
      codigo: error.code,
      body: req.body,
      files: req.files,
      stack: error.stack
    });

    res.status(500).json({
      sucesso: false,
      mensagem: 'Erro ao atualizar sala: ' + error.message,
      codigo: error.code || 'UNKNOWN_ERROR'
    });
  }
});

// Deletar sala
router.delete('/salas/:id', authenticateAdmin, async (req, res) => {
  try {
    const { id } = req.params;

    const sala = await prisma.sala.findUnique({
      where: { id: parseInt(id) }
    });

    if (!sala) {
      return res.status(404).json({
        sucesso: false,
        mensagem: 'Sala não encontrada'
      });
    }

    await prisma.sala.delete({
      where: { id: parseInt(id) }
    });

    // Registrar no histórico
    await registrarHistorico(req, 'DELETE', 'salas', parseInt(id), sala, null);

    res.json({
      sucesso: true,
      mensagem: 'Sala deletada com sucesso!'
    });
  } catch (error) {
    console.error('Erro ao deletar sala:', error);
    res.status(500).json({
      sucesso: false,
      mensagem: 'Erro ao deletar sala: ' + error.message
    });
  }
});

// Buscar histórico de alterações
router.get('/historico', authenticateAdmin, async (req, res) => {
  try {
    const { page = 1, limit = 20, tabela, operacao } = req.query;
    const skip = (parseInt(page) - 1) * parseInt(limit);

    const where = {};
    if (tabela) where.tabela = tabela;
    if (operacao) where.operacao = operacao;

    const [historico, total] = await Promise.all([
      prisma.historicoAlteracoes.findMany({
        where,
        skip,
        take: parseInt(limit),
        orderBy: { createdAt: 'desc' }
      }),
      prisma.historicoAlteracoes.count({ where })
    ]);

    res.json({
      sucesso: true,
      data: historico,
      pagination: {
        total,
        page: parseInt(page),
        limit: parseInt(limit),
        totalPages: Math.ceil(total / parseInt(limit))
      }
    });
  } catch (error) {
    console.error('Erro ao buscar histórico:', error);
    res.status(500).json({
      sucesso: false,
      mensagem: 'Erro ao buscar histórico: ' + error.message
    });
  }
});

// Endpoint para verificar histórico completo de uma sala
router.get('/sala/:salaId/historico', authenticateAdmin, async (req, res) => {
  try {
    const { salaId } = req.params;

    const sala = await prisma.sala.findUnique({
      where: { id: parseInt(salaId) },
    });

    if (!sala) {
      return res.status(404).json({
        sucesso: false,
        mensagem: 'Sala não encontrada'
      });
    }

    // Buscar histórico da sala
    const historico = await prisma.historicoAlteracoes.findMany({
      where: {
        tabela: "salas",
        registro_id: parseInt(salaId),
      },
      orderBy: { createdAt: "desc" },
    });

    // Buscar pré-reserva se existir
    const preReserva = await prisma.preReserva.findFirst({
      where: { sala_id: parseInt(salaId) }
    });

    // Analisar mudanças de status
    const mudancasStatus = historico.filter(h => 
      h.dados_depois && 
      h.dados_depois.hasOwnProperty('disponivel')
    ).map(h => ({
      data: h.createdAt,
      usuario: h.usuario,
      antes: h.dados_antes?.disponivel ? 'DISPONÍVEL' : 'INDISPONÍVEL',
      depois: h.dados_depois?.disponivel ? 'DISPONÍVEL' : 'INDISPONÍVEL',
      origem: h.dados_depois?.mudanca_status?.origem || 'DESCONHECIDA'
    }));

    res.json({
      sucesso: true,
      data: {
        sala,
        preReserva,
        totalAlteracoes: historico.length,
        mudancasStatus,
        historicoCompleto: historico
      }
    });
  } catch (error) {
    console.error("❌ Erro ao buscar histórico da sala:", error);
    res.status(500).json({ 
      sucesso: false,
      mensagem: error.message 
    });
  }
});

// Endpoint para debug - verificar última atualização de sala (mantido para compatibilidade)
router.get('/debug/sala/:salaId', async (req, res) => {
  try {
    const { salaId } = req.params;

    const sala = await prisma.sala.findUnique({
      where: { id: parseInt(salaId) },
    });

    const ultimasAlteracoes = await prisma.historicoAlteracoes.findMany({
      where: {
        tabela: "salas",
        registro_id: parseInt(salaId),
      },
      orderBy: { createdAt: "desc" },
      take: 5,
    });

    res.json({
      sala,
      ultimasAlteracoes,
      timestamp: new Date().toISOString(),
    });
  } catch (error) {
    console.error("❌ Erro no debug:", error);
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;