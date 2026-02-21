import express from "express";
import mysql from "mysql2/promise";
import cors from "cors";
import path from "path";
import { fileURLToPath } from "url";

const app = express();
app.use(express.json());
app.use(cors());

// 🔹 Ajuste para servir arquivos estáticos (HTML, CSS, JS)
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
app.use(express.static(path.join(__dirname, "public"))); // pasta com index.html

// 🔹 Configuração do banco via variáveis de ambiente (Render)
const dbConfig = {
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  port: process.env.DB_PORT || 3306,
};

// 🔹 Listar tarefas
app.get("/tarefas", async (req, res) => {
  try {
    const conexao = await mysql.createConnection(dbConfig);
    const [rows] = await conexao.execute("SELECT * FROM Tarefas");
    await conexao.end();
    res.json(rows);
  } catch (erro) {
    console.error(erro);
    res.status(500).json({ erro: "Erro ao buscar tarefas" });
  }
});

// 🔹 Inserir tarefa
app.post("/tarefas", async (req, res) => {
  try {
    const { nome, custo, dataLimite } = req.body;
    const conexao = await mysql.createConnection(dbConfig);

    await conexao.execute(
      "INSERT INTO Tarefas (nome, custo, dataLimite) VALUES (?, ?, ?)",
      [nome, custo, dataLimite],
    );

    await conexao.end();
    res.json({ mensagem: "Tarefa salva!" });
  } catch (erro) {
    console.error(erro);
    res.status(500).json({ erro: "Erro ao salvar tarefa" });
  }
});

// 🔹 Excluir tarefa
app.delete("/tarefas/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const conexao = await mysql.createConnection(dbConfig);

    await conexao.execute("DELETE FROM Tarefas WHERE id = ?", [id]);

    await conexao.end();
    res.json({ mensagem: "Tarefa excluída!" });
  } catch (erro) {
    console.error(erro);
    res.status(500).json({ erro: "Erro ao excluir tarefa" });
  }
});

// 🔹 Editar tarefa
app.put("/tarefas/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const { nome, custo, dataLimite } = req.body;

    const conexao = await mysql.createConnection(dbConfig);

    await conexao.execute(
      "UPDATE Tarefas SET nome = ?, custo = ?, dataLimite = ? WHERE id = ?",
      [nome, custo, dataLimite, id],
    );

    await conexao.end();
    res.json({ mensagem: "Tarefa atualizada!" });
  } catch (erro) {
    console.error(erro);
    res.status(500).json({ erro: "Erro ao atualizar tarefa" });
  }
});

// 🔹 Porta dinâmica do Render
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Servidor rodando na porta ${PORT}`);
});
