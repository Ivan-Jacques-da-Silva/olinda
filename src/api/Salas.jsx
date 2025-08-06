import React from "react";
import Config from "../Config";
import { Row, Col } from "react-bootstrap";
import { motion, AnimatePresence } from "framer-motion";

const Salas = ({
  salas,
  salaSelecionada,
  setSalaSelecionada,
  larguraTela,
  andarSelecionado,
  salasCom,
  setMostrarProposta,
}) => {
  const renderDisponibilidade = (andar, numero) => {
    const andarNumero = parseInt(andar);
    const numeroSalaCompleto = parseInt(
      `${andarNumero}${numero.toString().padStart(2, "0")}`,
    );
    return salasCom.includes(numeroSalaCompleto);
  };

  if (!salas || salas.length === 0) {
    return (
      <div className="text-center p-4">
        <i
          className="bi bi-building text-muted"
          style={{ fontSize: "3rem" }}
        ></i>
        <h5 className="mt-3 text-muted">Nenhum apartamento disponível</h5>
        <p className="text-muted">Não há apartamento cadastrado para este andar.</p>
      </div>
    );
  }

  if (larguraTela < 1200) {
    return (
      <>
        <div
          style={{
            overflowX: "auto",
            whiteSpace: "nowrap",
            paddingBottom: "3px",
          }}
        >
          <div style={{ display: "inline-flex", padding: "0 10px" }}>
            {salas.map((sala, index) => {
              const numero = index + 1;
              const nome = sala.atributos?.nome?.[0]?.valor || `Sala ${numero}`;
              const area = sala.atributos?.area?.[0]?.valor || "-";
              const posicao = sala.atributos?.posicao?.[0]?.valor || "";
              const preco = parseFloat(
                sala.precos?.de?.[0]?.valor || 0,
              ).toLocaleString("pt-BR", {
                minimumFractionDigits: 2,
              });
              const imagem = sala.arquivos?.imagens?.[0]?.baixar;
              const disponivel = sala.atributos?.disponibilidade?.[0]?.valor;
              const propostaPdf = sala.arquivos?.proposta_pdf?.[0]?.baixar;

              return (
                <div
                  key={index}
                  className={`rounded-4 p-2 mx-1 position-relative ${numero === salaSelecionada ? "border-dark border-2" : "border-secondary"}`}
                  style={{
                    background: "rgb(243 245 249)",
                    cursor: "pointer",
                    border: "1px solid #0046AD",
                    width: "220px",
                    flexShrink: 0,
                  }}
                  onClick={() => {
                    setSalaSelecionada(numero);
                    setMostrarProposta(false);
                  }}
                >
                  <div className="position-relative">
                    <img
                      src={
                        imagem
                          ? `${Config.api_url}${imagem}`
                          : "/placeholder-image.png"
                      }
                      alt={nome}
                      className="w-100 rounded mb-2"
                      style={{
                        width: "200px",
                        objectFit: "cover",
                      }}
                    />
                    <i
                      className={`bi fs-5 ${disponivel ? "bi-check-circle-fill text-success" : "bi-x-circle-fill text-danger"}`}
                      style={{
                        position: "absolute",
                        top: larguraTela >= 1200 ? "10px" : "auto",
                        bottom: larguraTela >= 1200 ? "auto" : "-101px",
                        right: "10px",
                      }}
                    />
                  </div>
                  <div className="text-start">
                    <div className="fw-bold">{nome}</div>
                    <div className="text-uppercase small text-muted">
                      {posicao}
                    </div>
                    <div className="fw-medium mt-1 mb-1">{area} m²</div>
                    <div className="fw-bold mb-1">R$ {preco}</div>
                    <hr className="my-2" />
                  </div>
                </div>
              );
            })}
          </div>
          <div className="d-flex justify-content-center mt-2">
            {salas.map((_, i) => (
              <div
                key={i}
                style={{
                  width: 8,
                  height: 8,
                  borderRadius: "50%",
                  backgroundColor:
                    salaSelecionada === i + 1 ? "#0046AD" : "#ccc",
                  margin: "0px 4px",
                }}
              />
            ))}
          </div>
        </div>
      </>
    );
  }

  return (
    <AnimatePresence mode="wait">
      <div className="salas-wrapper">
        <div
          key={andarSelecionado}
          as={motion.div}
          initial={{ x: -50, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          transition={{ type: "spring", stiffness: 300, damping: 20 }}
          className="salas-container"
        >
          {salas.map((sala, index) => {
            const numero = index + 1;
            const nome = sala.atributos?.nome?.[0]?.valor || `AP ${numero}`;
            const area = sala.atributos?.area?.[0]?.valor || "-";
            const posicao = sala.atributos?.posicao?.[0]?.valor || "";
            const preco = parseFloat(
              sala.precos?.de?.[0]?.valor || 0,
            ).toLocaleString("pt-BR", { minimumFractionDigits: 2 });
            const imagem = sala.arquivos?.imagens?.[0]?.baixar;
            const disponivel = sala.atributos?.disponibilidade?.[0]?.valor;

            return (
              <motion.div
                key={index}
                initial={{ x: -50, opacity: 0 }}
                animate={{ x: 0, opacity: 1 }}
                exit={{ x: 50, opacity: 0 }}
                transition={{ duration: 0.2 }}
                className="sala-card"
              >
                <div
                  className={`rounded-4 p-2 h-100 d-flex align-items-stretch position-relative ${numero === salaSelecionada ? "border-dark border-2" : "border-secondary"}`}
                  style={{
                    background: "rgb(243 245 249)",
                    cursor: "pointer",
                    border: "1px solid #0046AD",
                  }}
                  onClick={() => {
                    setSalaSelecionada(numero);
                    setMostrarProposta(false);
                  }}
                >
                  <div className="d-flex align-items-center">
                    <img
                      src={
                        imagem
                          ? `${Config.api_url}${imagem}`
                          : "/placeholder-image.png"
                      }
                      alt={nome}
                      style={{
                        width: "180px",
                        height: "120px",
                        objectFit: "cover",
                        borderRadius: "6px",
                        flexShrink: 0,
                      }}
                      className="me-3"
                    />
                    <div className="flex-grow-1 text-start">
                      <div className="d-flex justify-content-between align-items-start">
                        <div>
                          <div className="fw-bold">{nome}</div>
                          <div className="text-uppercase small text-muted">
                            {posicao}
                          </div>
                        </div>
                        <i
                          className={`bi fs-4 ${disponivel ? "bi-check-circle-fill text-success" : "bi-x-circle-fill text-danger"}`}
                          style={{
                            position: "absolute",
                            top: "-1px",
                            right: "0.7rem",
                          }}
                        />
                      </div>
                      <div className="mt-2 mb-2 fw-medium">{area} m²</div>
                      <div className="fw-bold mb-2">R$ {preco}</div>
                    </div>
                  </div>
                </div>
              </motion.div>
            );
          })}
        </div>
        
        {/* Indicadores de carrossel para telas grandes */}
        <div className="d-flex justify-content-center mt-3 carousel-indicators-desktop">
          {salas.map((_, i) => (
            <div
              key={i}
              style={{
                width: 10,
                height: 10,
                borderRadius: "50%",
                backgroundColor: salaSelecionada === i + 1 ? "#135454" : "#ccc",
                margin: "0px 5px",
                cursor: "pointer",
                transition: "background-color 0.3s ease",
              }}
              onClick={() => {
                setSalaSelecionada(i + 1);
                setMostrarProposta(false);
              }}
            />
          ))}
        </div>
      </div>
    </AnimatePresence>
  );
};

export default Salas;
