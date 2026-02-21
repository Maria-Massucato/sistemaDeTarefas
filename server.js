import express from "express";
import mysql from "mysql2/promise";
import cors from "cors";

const app = express();
app.use(express.json());
app.use(cors());

const dbConfig = {
  host: "localhost",
  user: "root",
  password: "root",
  database: "tarefas_db",
};

// 🔹 Listar tarefas
app.get("/tarefas", async (req, res) => {
  const conexao = await mysql.createConnection(dbConfig);
  const [rows] = await conexao.execute("SELECT * FROM Tarefas");
  await conexao.end();
  res.json(rows);
});

// 🔹 Inserir tarefa
app.post("/tarefas", async (req, res) => {
  const { nome, custo, dataLimite } = req.body;
  const conexao = await mysql.createConnection(dbConfig);

  await conexao.execute(
    "INSERT INTO Tarefas (nome, custo, dataLimite) VALUES (?, ?, ?)",
    [nome, custo, dataLimite],
  );

  await conexao.end();
  res.json({ mensagem: "Tarefa salva!" });
});

// 🔹 EXCLUIR tarefa
app.delete("/tarefas/:id", async (req, res) => {
  const { id } = req.params;
  const conexao = await mysql.createConnection(dbConfig);

  await conexao.execute("DELETE FROM Tarefas WHERE id = ?", [id]);

  await conexao.end();
  res.json({ mensagem: "Tarefa excluída!" });
});

// 🔹 EDITAR tarefa
app.put("/tarefas/:id", async (req, res) => {
  const { id } = req.params;
  const { nome, custo, dataLimite } = req.body;

  const conexao = await mysql.createConnection(dbConfig);

  await conexao.execute(
    "UPDATE Tarefas SET nome = ?, custo = ?, dataLimite = ? WHERE id = ?",
    [nome, custo, dataLimite, id],
  );

  await conexao.end();
  res.json({ mensagem: "Tarefa atualizada!" });
});

app.listen(3000, () => {
  console.log("Servidor rodando em http://localhost:3000");
});
