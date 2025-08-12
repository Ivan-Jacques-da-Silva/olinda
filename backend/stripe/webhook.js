
const { stripe, STRIPE_CONFIG } = require('./config');
const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

const handleCheckoutCompleted = async (session, environment = 'production') => {
  try {
    console.log('🎉 ========== PAGAMENTO CONCLUÍDO ==========');
    console.log('🎉 SESSION ID:', session.id);
    console.log('🎉 AMBIENTE:', environment);
    console.log('🎉 LIVEMODE:', session.livemode);
    console.log('🎉 TIMESTAMP:', new Date().toISOString());
    console.log('📋 DADOS COMPLETOS DA SESSÃO RECEBIDA:');
    console.log('================================');
    console.log(JSON.stringify(session, null, 2));
    console.log('================================');
    console.log('🔍 Metadata extraído:', session.metadata);
    console.log('💰 Valor total pago:', session.amount_total ? (session.amount_total / 100) : 'N/A');
    console.log('💳 Status do pagamento:', session.payment_status);
    console.log('📞 Dados do cliente:', session.customer_details);
    
    // Sempre alterar o banco de dados, independente se é teste ou produção
    const isLivemodeEvent = session.livemode === true;
    console.log(`💼 ========== PROCESSANDO PAGAMENTO ==========`);
    console.log(`💼 Tipo de evento: ${isLivemodeEvent ? 'PRODUÇÃO' : 'TESTE'}`);
    console.log(`💼 Ambiente: ${environment}`);
    console.log(`💼 BANCO DE DADOS SERÁ ALTERADO - ${isLivemodeEvent ? 'VENDA REAL' : 'TESTE FUNCIONAL'}`);
    console.log(`💼 ===========================================`);
    
    // PRIMEIRO: Verificar se temos sala_id
    const salaId = session.metadata?.sala_id;
    console.log('🔍 SALA_ID EXTRAÍDO DO METADATA:', salaId);
    
    if (!salaId) {
      console.error('❌ ========== ERRO CRÍTICO ==========');
      console.error('❌ SALA_ID NÃO ENCONTRADO NO METADATA');
      console.error('❌ Metadata completo:', JSON.stringify(session.metadata, null, 2));
      console.error('❌ ===================================');
      throw new Error('sala_id não encontrado no metadata da sessão');
    }
    
    console.log(`🔍 Processando pagamento para sala ID: ${salaId}`);

    // Verificar se o banco está acessível
    try {
      await prisma.$connect();
      console.log('✅ Conexão com banco estabelecida com sucesso');
    } catch (dbError) {
      console.error('❌ ========== ERRO DE CONEXÃO COM BANCO ==========');
      console.error('❌ Erro ao conectar com banco:', dbError);
      console.error('❌ ============================================');
      throw new Error('Banco de dados indisponível: ' + dbError.message);
    }

    console.log(`🔍 Buscando sala com ID: ${salaId}`);

    // Verificar se a sala existe antes de atualizar
    const salaExistente = await prisma.sala.findUnique({
      where: { id: parseInt(salaId) }
    });
    
    if (!salaExistente) {
      console.error(`❌ ========== SALA NÃO ENCONTRADA ==========`);
      console.error(`❌ Sala com ID ${salaId} não encontrada no banco`);
      console.error(`❌ Verificando se ID está corretor: ${parseInt(salaId)}`);
      
      // Tentar listar algumas salas para debug
      try {
        const totalSalas = await prisma.sala.count();
        const primeirasSalas = await prisma.sala.findMany({ take: 5 });
        console.error(`❌ Total de salas no banco: ${totalSalas}`);
        console.error(`❌ Primeiras salas:`, primeirasSalas.map(s => ({ id: s.id, nome: s.nome, numero: s.numero })));
      } catch (debugError) {
        console.error(`❌ Erro ao debugar salas:`, debugError);
      }
      
      console.error(`❌ =====================================`);
      throw new Error(`Sala ${salaId} não encontrada`);
    }

    console.log(`📍 ========== SALA ENCONTRADA ==========`);
    console.log(`📍 ID: ${salaExistente.id}`);
    console.log(`📍 Nome: ${salaExistente.nome}`);
    console.log(`📍 Número: ${salaExistente.numero}`);
    console.log(`📍 Andar: ${salaExistente.andar}`);
    console.log(`📍 Disponível ANTES: ${salaExistente.disponivel}`);
    console.log(`📍 Preço: ${salaExistente.preco}`);
    console.log(`📍 ===================================`);

    // Buscar dados do cliente se existir
    let customer = null;
    if (session.customer) {
      try {
        customer = await stripe.customers.retrieve(session.customer);
        console.log('👤 Cliente Stripe recuperado:', customer.name || customer.email);
      } catch (error) {
        console.error('⚠️ Erro ao buscar dados do cliente:', error);
      }
    }

    // Extrair CPF/CNPJ dos custom fields
    let cpfCnpj = 'Não informado';
    if (session.custom_fields && session.custom_fields.length > 0) {
      const cpfField = session.custom_fields.find(field => field.key === 'cpf_cnpj');
      if (cpfField && cpfField.text && cpfField.text.value) {
        cpfCnpj = cpfField.text.value;
      }
    }

    // Extrair dados de contato
    const nomeCliente = session.customer_details?.name || customer?.name || 'Nome não informado';
    const emailCliente = session.customer_details?.email || customer?.email || 'Não informado';
    const telefoneCliente = session.customer_details?.phone || 'Não informado';
    
    console.log('👤 Dados do cliente extraídos:', {
      nome: nomeCliente,
      email: emailCliente,
      telefone: telefoneCliente,
      cpf_cnpj: cpfCnpj
    });
    
    // PRIMEIRA OPERAÇÃO: Atualizar sala para indisponível
    console.log(`🔄 ========== INICIANDO UPDATE DA SALA ==========`);
    console.log(`🔄 Sala ID: ${salaId}`);
    console.log(`🔄 Sala Nome: ${salaExistente.nome}`);
    console.log(`🔄 Sala Número: ${salaExistente.numero}`);
    console.log(`🔄 Status ANTES: ${salaExistente.disponivel}`);
    console.log(`🔄 Status que será definido: false`);
    console.log(`🔄 ============================================`);
    
    try {
      console.log(`🔄 Executando comando UPDATE no banco...`);
      console.log(`🔄 SQL equivalente: UPDATE salas SET disponivel = false WHERE id = ${parseInt(salaId)}`);
      
      const salaAtualizada = await prisma.sala.update({
        where: { id: parseInt(salaId) },
        data: { 
          disponivel: false,
          updatedAt: new Date() // Forçar atualização do timestamp
        }
      });
      
      console.log(`✅ ========== UPDATE EXECUTADO COM SUCESSO ==========`);
      console.log(`✅ Sala ID: ${salaAtualizada.id}`);
      console.log(`✅ Nome: ${salaAtualizada.nome}`);
      console.log(`✅ Número: ${salaAtualizada.numero}`);
      console.log(`✅ Status DEPOIS: ${salaAtualizada.disponivel}`);
      console.log(`✅ UpdatedAt: ${salaAtualizada.updatedAt}`);
      console.log(`✅ MUDANÇA REALIZADA: ${salaExistente.disponivel} → ${salaAtualizada.disponivel}`);
      console.log(`✅ Status da mudança: ${salaExistente.disponivel !== salaAtualizada.disponivel ? 'SUCESSO - MUDOU' : 'ERRO - NÃO MUDOU'}`);
      console.log(`✅ ===============================================`);

      // VERIFICAÇÃO TRIPLA: Buscar a sala novamente para confirmar
      console.log(`🔍 ========== VERIFICAÇÃO FINAL ==========`);
      const salaVerificacao = await prisma.sala.findUnique({
        where: { id: parseInt(salaId) }
      });
      
      console.log(`🔍 Sala verificação ID: ${salaVerificacao.id}`);
      console.log(`🔍 Sala verificação Nome: ${salaVerificacao.nome}`);
      console.log(`🔍 Sala verificação Número: ${salaVerificacao.numero}`);
      console.log(`🔍 Status final no banco: ${salaVerificacao.disponivel}`);
      console.log(`🔍 Timestamp verificação: ${new Date().toISOString()}`);
      console.log(`🔍 Confirmação da mudança: ${salaVerificacao.disponivel === false ? 'CONFIRMADO - SALA INDISPONÍVEL' : 'ERRO - SALA AINDA DISPONÍVEL'}`);
      console.log(`🔍 =====================================`);

      if (salaVerificacao.disponivel === true) {
        console.error(`❌ ========== ERRO CRÍTICO ==========`);
        console.error(`❌ A sala ${salaId} ainda está disponível após o UPDATE!`);
        console.error(`❌ Isso indica um problema no banco de dados`);
        console.error(`❌ ===================================`);
        throw new Error('Falha ao atualizar status da sala - ainda está disponível');
      }

    } catch (updateError) {
      console.error(`❌ ========== ERRO NO UPDATE ==========`);
      console.error(`❌ Erro ao atualizar sala ${salaId}:`, updateError);
      console.error(`❌ Tipo do erro:`, updateError.constructor.name);
      console.error(`❌ Mensagem:`, updateError.message);
      console.error(`❌ Stack:`, updateError.stack);
      console.error(`❌ ====================================`);
      throw updateError;
    }

    // SEGUNDA OPERAÇÃO: Salvar dados da pré-reserva 
    console.log('💾 Salvando pré-reserva...');
    const preReserva = await prisma.preReserva.create({
      data: {
        nome: nomeCliente,
        cpf_cnpj: cpfCnpj,
        contato: telefoneCliente,
        email: emailCliente,
        sala_id: parseInt(salaId),
        nome_sala: salaExistente.nome // Incluir o nome da sala comprada
      }
    });
    
    console.log(`✅ Pré-reserva criada com ID: ${preReserva.id}`, {
      id: preReserva.id,
      nome: preReserva.nome,
      email: preReserva.email
    });

    // TERCEIRA OPERAÇÃO: Registrar no histórico
    await prisma.historicoAlteracoes.create({
      data: {
        tabela: 'salas',
        operacao: 'UPDATE',
        registro_id: parseInt(salaId),
        dados_antes: { 
          disponivel: salaExistente.disponivel,
          nome: salaExistente.nome,
          numero: salaExistente.numero
        },
        dados_depois: { 
          disponivel: false,
          comprador: nomeCliente,
          email: emailCliente,
          session_id: session.id
        },
        usuario: 'stripe_webhook',
        ip_address: 'stripe.com',
        user_agent: 'Stripe Webhook - Pagamento Concluído'
      }
    });

    console.log(`🎯 ========== SUCESSO COMPLETO ==========`);
    console.log(`🎯 SALA VENDIDA COM SUCESSO!`);
    console.log(`🎯 Sala ID: ${salaId}`);
    console.log(`🎯 Sala Nome: ${salaExistente.nome}`);
    console.log(`🎯 Sala Número: ${salaExistente.numero}`);
    console.log(`🎯 Comprador: ${nomeCliente}`);
    console.log(`🎯 Email: ${emailCliente}`);
    console.log(`🎯 Status alterado: ${salaExistente.disponivel} → false`);
    console.log(`🎯 Pré-reserva ID: ${preReserva.id}`);
    console.log(`🎯 Session ID: ${session.id}`);
    console.log(`🎯 Timestamp: ${new Date().toISOString()}`);
    console.log(`🎯 ====================================`);
    
    // Log de resumo para fácil identificação nos logs
    console.log(`📊 RESUMO: Sala ${salaExistente.numero} (ID:${salaId}) → VENDIDA para ${nomeCliente} → Status: INDISPONÍVEL`);
    
  } catch (error) {
    console.error('❌ ERRO CRÍTICO ao processar checkout concluído:', error);
    console.error('📋 Stack trace:', error.stack);
    
    // Tentar reverter alterações se possível
    try {
      const salaId = session.metadata?.sala_id;
      if (salaId) {
        await prisma.sala.update({
          where: { id: parseInt(salaId) },
          data: { disponivel: true }
        });
        console.log(`🔄 Sala ${salaId} revertida para disponível devido ao erro`);
      }
    } catch (revertError) {
      console.error('❌ Erro ao reverter sala:', revertError);
    }
    
    throw error;
  }
};

const handleCheckoutExpired = async (session, environment = 'production') => {
  try {
    console.log('⏰ Checkout expirado:', session.id, 'ambiente:', environment);
    
    // Sempre processar expiração, alterando o banco de dados
    const isLivemodeEvent = session.livemode === true;
    console.log(`⏰ Processando expiração ${isLivemodeEvent ? 'PRODUÇÃO' : 'TESTE'} - alterando banco de dados`);
    
    const salaId = session.metadata?.sala_id;
    if (!salaId) {
      console.error('❌ sala_id não encontrado no metadata da sessão');
      return;
    }

    // Garantir que a sala volte a ficar disponível
    await prisma.sala.update({
      where: { id: parseInt(salaId) },
      data: { disponivel: true }
    });

    console.log(`✅ Sala ${salaId} voltou a ficar disponível após expiração`);
    
  } catch (error) {
    console.error('❌ Erro ao processar checkout expirado:', error);
    throw error;
  }
};

const handleChargeRefunded = async (charge, environment = 'production') => {
  try {
    console.log('💰 Cobrança estornada:', charge.id, 'ambiente:', environment);
    
    // Sempre processar estorno, alterando o banco de dados
    const isLivemodeEvent = charge.livemode === true;
    console.log(`💰 Processando estorno ${isLivemodeEvent ? 'PRODUÇÃO' : 'TESTE'} - alterando banco de dados`);
    
    // Buscar a sessão relacionada ao charge
    const sessions = await stripe.checkout.sessions.list({
      payment_intent: charge.payment_intent,
      limit: 1
    });

    if (sessions.data.length === 0) {
      console.error('❌ Sessão não encontrada para o charge estornado');
      return;
    }

    const session = sessions.data[0];
    const salaId = session.metadata?.sala_id;
    
    if (!salaId) {
      console.error('❌ sala_id não encontrado no metadata da sessão');
      return;
    }

    // Voltar sala para disponível
    await prisma.sala.update({
      where: { id: parseInt(salaId) },
      data: { disponivel: true }
    });

    // Registrar no histórico
    await prisma.historicoAlteracoes.create({
      data: {
        tabela: 'salas',
        operacao: 'UPDATE',
        registro_id: parseInt(salaId),
        dados_antes: { disponivel: false },
        dados_depois: { disponivel: true },
        usuario: 'stripe_webhook_refund',
        ip_address: 'stripe.com',
        user_agent: 'Stripe Webhook - Refund'
      }
    });

    console.log(`✅ Sala ${salaId} voltou a ficar disponível após estorno`);
    
  } catch (error) {
    console.error('❌ Erro ao processar estorno:', error);
    throw error;
  }
};

const processWebhookEvent = async (event, environment = 'production') => {
  try {
    console.log(`🔄 Processando evento ${event.type} no ambiente: ${environment}`);
    console.log(`🔄 Modo livemode do evento: ${event.livemode}`);
    console.log(`🔄 ID do evento: ${event.id}`);
    
    // Processar todos os eventos independente se é teste ou produção
    const isLivemodeEvent = event.livemode === true;
    console.log(`✅ Processando evento ${isLivemodeEvent ? 'PRODUÇÃO' : 'TESTE'} no ambiente: ${environment}`);
    
    switch (event.type) {
      case 'checkout.session.completed':
        await handleCheckoutCompleted(event.data.object, environment);
        break;
        
      case 'checkout.session.expired':
        await handleCheckoutExpired(event.data.object, environment);
        break;
        
      case 'charge.refunded':
        await handleChargeRefunded(event.data.object, environment);
        break;
        
      default:
        console.log(`⚠️ Evento não tratado: ${event.type} (ambiente: ${environment})`);
    }
  } catch (error) {
    console.error(`❌ Erro ao processar evento ${event.type} no ambiente ${environment}:`, error);
    throw error;
  }
};

module.exports = {
  processWebhookEvent,
  handleCheckoutCompleted,
  handleCheckoutExpired,
  handleChargeRefunded
};
