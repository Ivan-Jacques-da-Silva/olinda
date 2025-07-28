const readline = require("readline");
const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
});

rl.question("⚠️ Tem certeza que deseja apagar TODOS os dados do banco? (Y/N): ", async (resposta) => {
  if (resposta.trim().toUpperCase() === "Y") {
    try {
      await prisma.$executeRawUnsafe(`DO $$
      DECLARE
        r RECORD;
      BEGIN
        FOR r IN (SELECT tablename FROM pg_tables WHERE schemaname = current_schema()) LOOP
          EXECUTE 'DROP TABLE IF EXISTS ' || quote_ident(r.tablename) || ' CASCADE';
        END LOOP;
      END $$;`);

      console.log("✅ Banco limpo com sucesso!");
    } catch (erro) {
      console.error("❌ Erro ao apagar tabelas:", erro);
    } finally {
      await prisma.$disconnect();
      rl.close();
    }
  } else {
    console.log("❌ Operação cancelada.");
    rl.close();
  }
});
