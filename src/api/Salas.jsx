import React from 'react';
import Config from '../Config';
import { Row, Col } from 'react-bootstrap';
import { motion, AnimatePresence } from 'framer-motion';

const Salas = ({
  salas,
  salaSelecionada,
  setSalaSelecionada,
  larguraTela,
  andarSelecionado,
  salasCom,
  setMostrarProposta
}) => {
  const renderDisponibilidade = (andar, numero) => {
    const andarNumero = parseInt(andar);
    const numeroSalaCompleto = parseInt(`${andarNumero}${numero.toString().padStart(2, '0')}`);
    return salasCom.includes(numeroSalaCompleto);
  };

  if (!salas || salas.length === 0) {
    return (
      <div className="text-center p-4">
        <i className="bi bi-building text-muted" style={{fontSize: '3rem'}}></i>
        <h5 className="mt-3 text-muted">Nenhuma sala disponível</h5>
        <p className="text-muted">
          Não há salas cadastradas para este andar.
        </p>
      </div>
    );
  }

  if (larguraTela < 1200) {
    return (
      <>
        <div style={{ overflowX: 'auto', whiteSpace: 'nowrap', paddingBottom: '3px' }}>
          <div style={{ display: 'inline-flex', padding: '0 10px' }}>
            {salas.map((sala, index) => {
              const numero = index + 1;
              const nome = sala.atributos?.nome?.[0]?.valor || `Sala ${numero}`;
              const area = sala.atributos?.area?.[0]?.valor || '-';
              const posicao = sala.atributos?.posicao?.[0]?.valor || '';
              const preco = parseFloat(sala.precos?.de?.[0]?.valor || 0).toLocaleString('pt-BR', { minimumFractionDigits: 2 });
              const disponivel = sala.atributos?.disponibilidade?.[0]?.valor;

              return (
                <motion.div
                  key={index}
                  initial={{ x: -50, opacity: 0 }}
                  animate={{ x: 0, opacity: 1 }}
                  exit={{ x: 50, opacity: 0 }}
                  transition={{ duration: 0.2 }}
                  className={`me-3 ${numero === salaSelecionada ? 'border-dark border-2' : 'border-secondary'}`}
                  style={{
                    minWidth: '200px',
                    maxWidth: '200px',
                    background: 'rgb(243 245 249)',
                    borderRadius: '12px',
                    padding: '15px',
                    cursor: 'pointer',
                    border: '1px solid #0046AD',
                    position: 'relative',
                    display: 'inline-block',
                    height: '120px',
                  }}
                  onClick={() => {
                    setSalaSelecionada(numero);
                    setMostrarProposta(false);
                  }}
                >
                  <div className="d-flex flex-column justify-content-between h-100 text-start">
                    <div>
                      <div className="fw-bold mb-1">{nome}</div>
                      <div className="text-uppercase small text-muted mb-1">{posicao}</div>
                      <div className="fw-medium mb-1">{area} m²</div>
                      <div className="fw-bold">R$ {preco}</div>
                    </div>
                    <i
                      className={`bi fs-5 ${disponivel ? 'bi-check-circle-fill text-success' : 'bi-x-circle-fill text-danger'}`}
                      style={{ position: 'absolute', top: '8px', right: '8px' }}
                    />
                  </div>
                </motion.div>
              );
            })}
          </div>
        </div>
      </>
    );
  }

  return (
    <AnimatePresence mode="wait">
      <Row
        key={andarSelecionado}
        as={motion.div}
        initial={{ x: -50, opacity: 0 }}
        animate={{ x: 0, opacity: 1 }}
        transition={{ type: 'spring', stiffness: 300, damping: 20 }}
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(4, 1fr)',
          gap: '0.5rem',
          marginBottom: '10px',
          marginRight: '10px',
        }}
      >
        {salas.map((sala, index) => {
          const numero = index + 1;
          const nome = sala.atributos?.nome?.[0]?.valor || `Sala ${numero}`;
          const area = sala.atributos?.area?.[0]?.valor || '-';
          const posicao = sala.atributos?.posicao?.[0]?.valor || '';
          const preco = parseFloat(sala.precos?.de?.[0]?.valor || 0).toLocaleString('pt-BR', { minimumFractionDigits: 2 });
          const disponivel = sala.atributos?.disponibilidade?.[0]?.valor;

          return (
            <Col
              key={index}
              as={motion.div}
              initial={{ x: -50, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              exit={{ x: 50, opacity: 0 }}
              transition={{ duration: 0.2 }}
            >
              <div
                className={`rounded-4 p-2 h-100 d-flex align-items-stretch position-relative ${numero === salaSelecionada ? 'border-dark border-2' : 'border-secondary'}`}
                style={{
                  background: 'rgb(243 245 249)',
                  cursor: 'pointer',
                  border: '1px solid #0046AD',
                }}
                onClick={() => {
                  setSalaSelecionada(numero);
                  setMostrarProposta(false);
                }}
              >
                <div className="d-flex align-items-center">
                  <div className="flex-grow-1 text-start">
                    <div className="d-flex justify-content-between align-items-start">
                      <div>
                        <div className="fw-bold">{nome}</div>
                        <div className="text-uppercase small text-muted">{posicao}</div>
                      </div>
                      <i
                        className={`bi fs-4 ${disponivel ? 'bi-check-circle-fill text-success' : 'bi-x-circle-fill text-danger'}`}
                        style={{ position: 'absolute', top: '-1px', right: '0.7rem' }}
                      />
                    </div>
                    <div className="mt-2 mb-2 fw-medium">{area} m²</div>
                    <div className="fw-bold mb-2">R$ {preco}</div>
                  </div>
                </div>
              </div>
            </Col>
          );
        })}
      </Row>
    </AnimatePresence>
  );
};

export default Salas;