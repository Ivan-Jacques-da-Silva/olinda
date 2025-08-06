
const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();

async function main() {
  await prisma.sala.create({
    data: {
      numero: "1601",
      andar: 16,
      nome: "AP 1 - 1601",
      area: 181.00,
      posicao: "Frente Norte",
      preco: 2000000.00,
      disponivel: true,
      imagem: "seedImg/aptipo1.png",
      planta: "seedPlanta/plantatipo1topo.png",
      proposta_pdf: "uploads/Proposta - Olinda Residence 1601.pdf",
    },
  });

  await prisma.sala.create({
    data: {
      numero: "1501",
      andar: 15,
      nome: "AP 1 - 1501",
      area: 109.00,
      posicao: "Frente Norte",
      preco: 872000.00,
      disponivel: true,
      imagem: "seedImg/aptipo1.png",
      planta: "seedPlanta/plantatipo1.png",
      proposta_pdf: "uploads/Proposta - Olinda Residence 1501.pdf",
    },
  });

  await prisma.sala.create({
    data: {
      numero: "1401",
      andar: 14,
      nome: "AP 1 - 1401",
      area: 109.00,
      posicao: "Frente Norte",
      preco: 872000.00,
      disponivel: true,
      imagem: "seedImg/aptipo1.png",
      planta: "seedPlanta/plantatipo1.png",
      proposta_pdf: "uploads/Proposta - Olinda Residence 1401.pdf",
    },
  });

  await prisma.sala.create({
    data: {
      numero: "1301",
      andar: 13,
      nome: "AP 1 - 1301",
      area: 109.00,
      posicao: "Frente Norte",
      preco: 872000.00,
      disponivel: true,
      imagem: "seedImg/aptipo1.png",
      planta: "seedPlanta/plantatipo1.png",
      proposta_pdf: "uploads/Proposta - Olinda Residence 1301.pdf",
    },
  });

  await prisma.sala.create({
    data: {
      numero: "1201",
      andar: 12,
      nome: "AP 1 - 1201",
      area: 109.00,
      posicao: "Frente Norte",
      preco: 621300.00,
      disponivel: true,
      imagem: "seedImg/aptipo1.png",
      planta: "seedPlanta/plantatipo1.png",
      proposta_pdf: "uploads/Proposta - Olinda Residence 1201.pdf",
    },
  });

  await prisma.sala.create({
    data: {
      numero: "1101",
      andar: 11,
      nome: "AP 1 - 1101",
      area: 109.00,
      posicao: "Frente Norte",
      preco: 621300.00,
      disponivel: true,
      imagem: "seedImg/aptipo1.png",
      planta: "seedPlanta/plantatipo1.png",
      proposta_pdf: "uploads/Proposta - Olinda Residence 1101.pdf",
    },
  });

  await prisma.sala.create({
    data: {
      numero: "1001",
      andar: 10,
      nome: "AP 1 - 1001",
      area: 109.00,
      posicao: "Frente Norte",
      preco: 621300.00,
      disponivel: true,
      imagem: "seedImg/aptipo1.png",
      planta: "seedPlanta/plantatipo1.png",
      proposta_pdf: "uploads/Proposta - Olinda Residence 1001.pdf",
    },
  });

  await prisma.sala.create({
    data: {
      numero: "901",
      andar: 9,
      nome: "AP 1 - 901",
      area: 109.00,
      posicao: "Frente Norte",
      preco: 599000.00,
      disponivel: true,
      imagem: "seedImg/aptipo1.png",
      planta: "seedPlanta/plantatipo1.png",
      proposta_pdf: "uploads/Proposta - Olinda Residence 901.pdf",
    },
  });

  await prisma.sala.create({
    data: {
      numero: "801",
      andar: 8,
      nome: "AP 1 - 801",
      area: 109.00,
      posicao: "Frente Norte",
      preco: 599000.00,
      disponivel: true,
      imagem: "seedImg/aptipo1.png",
      planta: "seedPlanta/plantatipo1.png",
      proposta_pdf: "uploads/Proposta - Olinda Residence 801.pdf",
    },
  });

  await prisma.sala.create({
    data: {
      numero: "701",
      andar: 7,
      nome: "AP 1 - 701",
      area: 109.00,
      posicao: "Frente Norte",
      preco: 599000.00,
      disponivel: true,
      imagem: "seedImg/aptipo1.png",
      planta: "seedPlanta/plantatipo1.png",
      proposta_pdf: "uploads/Proposta - Olinda Residence 701.pdf",
    },
  });

  await prisma.sala.create({
    data: {
      numero: "601",
      andar: 6,
      nome: "AP 1 - 601",
      area: 109.00,
      posicao: "Frente Norte",
      preco: 599000.00,
      disponivel: true,
      imagem: "seedImg/aptipo1.png",
      planta: "seedPlanta/plantatipo1.png",
      proposta_pdf: "uploads/Proposta - Olinda Residence 601.pdf",
    },
  });

  await prisma.sala.create({
    data: {
      numero: "501",
      andar: 5,
      nome: "AP 1 - 501",
      area: 109.00,
      posicao: "Frente Norte",
      preco: 599000.00,
      disponivel: true,
      imagem: "seedImg/aptipo1.png",
      planta: "seedPlanta/plantatipo1.png",
      proposta_pdf: "uploads/Proposta - Olinda Residence 501.pdf",
    },
  });

  // Tipo 02 (107,50 m²) - Posição: Nordeste
  await prisma.sala.create({
    data: {
      numero: "1602",
      andar: 16,
      nome: "AP 2 - 1602",
      area: 192.25,
      posicao: "Frente Norte",
      preco: 2114750.00,
      disponivel: true,
      imagem: "seedImg/aptipo2.png",
      planta: "seedPlanta/plantatipo2topo.png",
      proposta_pdf: "uploads/Proposta - Olinda Residence 1602.pdf",
    },
  });

  await prisma.sala.create({
    data: {
      numero: "1502",
      andar: 15,
      nome: "AP 2 - 1502",
      area: 107.50,
      posicao: "Frente Norte",
      preco: 860000.00,
      disponivel: true,
      imagem: "seedImg/aptipo2.png",
      planta: "seedPlanta/plantatipo2.png",
      proposta_pdf: "uploads/Proposta - Olinda Residence 1502.pdf",
    },
  });

  await prisma.sala.create({
    data: {
      numero: "1402",
      andar: 14,
      nome: "AP 2 - 1402",
      area: 107.50,
      posicao: "Frente Norte",
      preco: 860000.00,
      disponivel: true,
      imagem: "seedImg/aptipo2.png",
      planta: "seedPlanta/plantatipo2.png",
      proposta_pdf: "uploads/Proposta - Olinda Residence 1402.pdf",
    },
  });

  await prisma.sala.create({
    data: {
      numero: "1302",
      andar: 13,
      nome: "AP 2 - 1302",
      area: 107.50,
      posicao: "Frente Norte",
      preco: 0.00,
      disponivel: false,
      imagem: "seedImg/aptipo2.png",
      planta: "seedPlanta/plantatipo2.png",
      proposta_pdf: "uploads/Proposta - Olinda Residence 602.pdf",
    },
  });

  await prisma.sala.create({
    data: {
      numero: "1202",
      andar: 12,
      nome: "AP 2 - 1202",
      area: 107.50,
      posicao: "Frente Norte",
      preco: 0.00,
      disponivel: false,
      imagem: "seedImg/aptipo2.png",
      planta: "seedPlanta/plantatipo2.png",
      proposta_pdf: "uploads/Proposta - Olinda Residence 602.pdf",
    },
  });

  await prisma.sala.create({
    data: {
      numero: "1102",
      andar: 11,
      nome: "AP 2 - 1102",
      area: 107.50,
      posicao: "Frente Norte",
      preco: 0.00,
      disponivel: false,
      imagem: "seedImg/aptipo2.png",
      planta: "seedPlanta/plantatipo2.png",
      proposta_pdf: "uploads/Proposta - Olinda Residence 602.pdf",
    },
  });

  await prisma.sala.create({
    data: {
      numero: "1002",
      andar: 10,
      nome: "AP 2 - 1002",
      area: 107.50,
      posicao: "Frente Norte",
      preco: 0.00,
      disponivel: false,
      imagem: "seedImg/aptipo2.png",
      planta: "seedPlanta/plantatipo2.png",
      proposta_pdf: "uploads/Proposta - Olinda Residence 602.pdf",
    },
  });

  await prisma.sala.create({
    data: {
      numero: "902",
      andar: 9,
      nome: "AP 2 - 902",
      area: 107.50,
      posicao: "Frente Norte",
      preco: 599000.00,
      disponivel: true,
      imagem: "seedImg/aptipo2.png",
      planta: "seedPlanta/plantatipo2.png",
      proposta_pdf: "uploads/Proposta - Olinda Residence 902.pdf",
    },
  });

  await prisma.sala.create({
    data: {
      numero: "802",
      andar: 8,
      nome: "AP 2 - 802",
      area: 107.50,
      posicao: "Frente Norte",
      preco: 599000.00,
      disponivel: true,
      imagem: "seedImg/aptipo2.png",
      planta: "seedPlanta/plantatipo2.png",
      proposta_pdf: "uploads/Proposta - Olinda Residence 802.pdf",
    },
  });

  await prisma.sala.create({
    data: {
      numero: "702",
      andar: 7,
      nome: "AP 2 - 702",
      area: 107.50,
      posicao: "Frente Norte",
      preco: 599000.00,
      disponivel: true,
      imagem: "seedImg/aptipo2.png",
      planta: "seedPlanta/plantatipo2.png",
      proposta_pdf: "uploads/Proposta - Olinda Residence 702.pdf",
    },
  });

  await prisma.sala.create({
    data: {
      numero: "602",
      andar: 6,
      nome: "AP 2 - 602",
      area: 107.50,
      posicao: "Frente Norte",
      preco: 599000.00,
      disponivel: true,
      imagem: "seedImg/aptipo2.png",
      planta: "seedPlanta/plantatipo2.png",
      proposta_pdf: "uploads/Proposta - Olinda Residence 602.pdf",
    },
  });

  await prisma.sala.create({
    data: {
      numero: "502",
      andar: 5,
      nome: "AP 2 - 502",
      area: 107.50,
      posicao: "Frente Norte",
      preco: 599000.00,
      disponivel: true,
      imagem: "seedImg/aptipo2.png",
      planta: "seedPlanta/plantatipo2.png",
      proposta_pdf: "uploads/Proposta - Olinda Residence 502.pdf",
    },
  });

  // Tipo 03 (78,50 m²) - Posição: Sudeste
  await prisma.sala.create({
    data: {
      numero: "1503",
      andar: 15,
      nome: "AP 3 - 1503",
      area: 78.50,
      posicao: "Frente Leste",
      preco: 628000.00,
      disponivel: true,
      imagem: "seedImg/aptipo3.png",
      planta: "seedPlanta/plantatipo3.png",
      proposta_pdf: "uploads/Proposta - Olinda Residence 1503.pdf",
    },
  });

  await prisma.sala.create({
    data: {
      numero: "1403",
      andar: 14,
      nome: "AP 3 - 1403",
      area: 78.50,
      posicao: "Frente Leste",
      preco: 628000.00,
      disponivel: true,
      imagem: "seedImg/aptipo3.png",
      planta: "seedPlanta/plantatipo3.png",
      proposta_pdf: "uploads/Proposta - Olinda Residence 1403.pdf",
    },
  });

  await prisma.sala.create({
    data: {
      numero: "1303",
      andar: 13,
      nome: "AP 3 - 1303",
      area: 78.50,
      posicao: "Frente Leste",
      preco: 628000.00,
      disponivel: true,
      imagem: "seedImg/aptipo3.png",
      planta: "seedPlanta/plantatipo3.png",
      proposta_pdf: "uploads/Proposta - Olinda Residence 1303.pdf",
    },
  });

  await prisma.sala.create({
    data: {
      numero: "1203",
      andar: 12,
      nome: "AP 3 - 1203",
      area: 78.50,
      posicao: "Frente Leste",
      preco: 0.00,
      disponivel: false,
      imagem: "seedImg/aptipo3.png",
      planta: "seedPlanta/plantatipo3.png",
      proposta_pdf: "uploads/Proposta - Olinda Residence 1303.pdf",
    },
  });

  await prisma.sala.create({
    data: {
      numero: "1103",
      andar: 11,
      nome: "AP 3 - 1103",
      area: 78.50,
      posicao: "Frente Leste",
      preco: 447450.00,
      disponivel: true,
      imagem: "seedImg/aptipo3.png",
      planta: "seedPlanta/plantatipo3.png",
      proposta_pdf: "uploads/Proposta - Olinda Residence 1103.pdf",
    },
  });

  await prisma.sala.create({
    data: {
      numero: "1003",
      andar: 10,
      nome: "AP 3 - 1003",
      area: 78.50,
      posicao: "Frente Leste",
      preco: 447450.00,
      disponivel: true,
      imagem: "seedImg/aptipo3.png",
      planta: "seedPlanta/plantatipo3.png",
      proposta_pdf: "uploads/Proposta - Olinda Residence 1003.pdf",
    },
  });

  await prisma.sala.create({
    data: {
      numero: "903",
      andar: 9,
      nome: "AP 3 - 903",
      area: 78.50,
      posicao: "Frente Leste",
      preco: 433000.00,
      disponivel: true,
      imagem: "seedImg/aptipo3.png",
      planta: "seedPlanta/plantatipo3.png",
      proposta_pdf: "uploads/Proposta - Olinda Residence 903.pdf",
    },
  });

  await prisma.sala.create({
    data: {
      numero: "803",
      andar: 8,
      nome: "AP 3 - 803",
      area: 78.50,
      posicao: "Frente Leste",
      preco: 433000.00,
      disponivel: true,
      imagem: "seedImg/aptipo3.png",
      planta: "seedPlanta/plantatipo3.png",
      proposta_pdf: "uploads/Proposta - Olinda Residence 803.pdf",
    },
  });

  await prisma.sala.create({
    data: {
      numero: "703",
      andar: 7,
      nome: "AP 3 - 703",
      area: 78.50,
      posicao: "Frente Leste",
      preco: 433000.00,
      disponivel: true,
      imagem: "seedImg/aptipo3.png",
      planta: "seedPlanta/plantatipo3.png",
      proposta_pdf: "uploads/Proposta - Olinda Residence 703.pdf",
    },
  });

  await prisma.sala.create({
    data: {
      numero: "603",
      andar: 6,
      nome: "AP 3 - 603",
      area: 78.50,
      posicao: "Frente Leste",
      preco: 433000.00,
      disponivel: true,
      imagem: "seedImg/aptipo3.png",
      planta: "seedPlanta/plantatipo3.png",
      proposta_pdf: "uploads/Proposta - Olinda Residence 603.pdf",
    },
  });

  await prisma.sala.create({
    data: {
      numero: "503",
      andar: 5,
      nome: "AP 3 - 503",
      area: 78.50,
      posicao: "Frente Leste",
      preco: 433000.00,
      disponivel: true,
      imagem: "seedImg/aptipo3.png",
      planta: "seedPlanta/plantatipo3.png",
      proposta_pdf: "uploads/Proposta - Olinda Residence 503.pdf",
    },
  });

  // Tipo 04 (73,50 m²) - Posição: Sudoeste
  await prisma.sala.create({
    data: {
      numero: "1504",
      andar: 15,
      nome: "AP 4 - 1504",
      area: 73.50,
      posicao: "Frente Sul",
      preco: 588000.00,
      disponivel: true,
      imagem: "seedImg/aptipo4.png",
      planta: "seedPlanta/plantatipo4.png",
      proposta_pdf: "uploads/Proposta - Olinda Residence 1504.pdf",
    },
  });

  await prisma.sala.create({
    data: {
      numero: "1404",
      andar: 14,
      nome: "AP 4 - 1404",
      area: 73.50,
      posicao: "Frente Sul",
      preco: 588000.00,
      disponivel: true,
      imagem: "seedImg/aptipo4.png",
      planta: "seedPlanta/plantatipo4.png",
      proposta_pdf: "uploads/Proposta - Olinda Residence 1404.pdf",
    },
  });

  await prisma.sala.create({
    data: {
      numero: "1304",
      andar: 13,
      nome: "AP 4 - 1304",
      area: 73.50,
      posicao: "Frente Sul",
      preco: 588000.00,
      disponivel: true,
      imagem: "seedImg/aptipo4.png",
      planta: "seedPlanta/plantatipo4.png",
      proposta_pdf: "uploads/Proposta - Olinda Residence 1304.pdf",
    },
  });

  await prisma.sala.create({
    data: {
      numero: "1204",
      andar: 12,
      nome: "AP 4 - 1204",
      area: 73.50,
      posicao: "Frente Sul",
      preco: 418950.00,
      disponivel: true,
      imagem: "seedImg/aptipo4.png",
      planta: "seedPlanta/plantatipo4.png",
      proposta_pdf: "uploads/Proposta - Olinda Residence 1204.pdf",
    },
  });

  await prisma.sala.create({
    data: {
      numero: "1104",
      andar: 11,
      nome: "AP 4 - 1104",
      area: 73.50,
      posicao: "Frente Sul",
      preco: 418950.00,
      disponivel: true,
      imagem: "seedImg/aptipo4.png",
      planta: "seedPlanta/plantatipo4.png",
      proposta_pdf: "uploads/Proposta - Olinda Residence 1104.pdf",
    },
  });

  await prisma.sala.create({
    data: {
      numero: "1004",
      andar: 10,
      nome: "AP 4 - 1004",
      area: 73.50,
      posicao: "Frente Sul",
      preco: 418950.00,
      disponivel: true,
      imagem: "seedImg/aptipo4.png",
      planta: "seedPlanta/plantatipo4.png",
      proposta_pdf: "uploads/Proposta - Olinda Residence 1004.pdf",
    },
  });

  await prisma.sala.create({
    data: {
      numero: "904",
      andar: 9,
      nome: "AP 4 - 904",
      area: 73.50,
      posicao: "Frente Sul",
      preco: 399000.00,
      disponivel: true,
      imagem: "seedImg/aptipo4.png",
      planta: "seedPlanta/plantatipo4.png",
      proposta_pdf: "uploads/Proposta - Olinda Residence 904.pdf",
    },
  });

  await prisma.sala.create({
    data: {
      numero: "804",
      andar: 8,
      nome: "AP 4 - 804",
      area: 73.50,
      posicao: "Frente Sul",
      preco: 399000.00,
      disponivel: true,
      imagem: "seedImg/aptipo4.png",
      planta: "seedPlanta/plantatipo4.png",
      proposta_pdf: "uploads/Proposta - Olinda Residence 804.pdf",
    },
  });

  await prisma.sala.create({
    data: {
      numero: "704",
      andar: 7,
      nome: "AP 4 - 704",
      area: 73.50,
      posicao: "Frente Sul",
      preco: 399000.00,
      disponivel: true,
      imagem: "seedImg/aptipo4.png",
      planta: "seedPlanta/plantatipo4.png",
      proposta_pdf: "uploads/Proposta - Olinda Residence 704.pdf",
    },
  });

  await prisma.sala.create({
    data: {
      numero: "604",
      andar: 6,
      nome: "AP 4 - 604",
      area: 73.50,
      posicao: "Frente Sul",
      preco: 399000.00,
      disponivel: true,
      imagem: "seedImg/aptipo4.png",
      planta: "seedPlanta/plantatipo4.png",
      proposta_pdf: "uploads/Proposta - Olinda Residence 604.pdf",
    },
  });

  await prisma.sala.create({
    data: {
      numero: "504",
      andar: 5,
      nome: "AP 4 - 504",
      area: 73.50,
      posicao: "Frente Sul",
      preco: 399000.00,
      disponivel: true,
      imagem: "seedImg/aptipo4.png",
      planta: "seedPlanta/plantatipo4.png",
      proposta_pdf: "uploads/Proposta - Olinda Residence 504.pdf",
    },
  });

  console.log("✅ Todas as salas foram criadas com os novos dados!");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
