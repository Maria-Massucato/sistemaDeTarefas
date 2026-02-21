# 📋 Sistema de Lista de Tarefas com Node.js e MySQL

## Demonstração

Acesse a versão online do site: https://sistemadetarefas-production-cab8.up.railway.app/

## 📌 Descrição

Este projeto é um sistema web de gerenciamento de tarefas desenvolvido
com **HTML, CSS e JavaScript** no front-end, e **Node.js + MySQL** no
back-end.\
Ele permite cadastrar, editar, excluir e listar tarefas com persistência
em banco de dados.

O objetivo do projeto é demonstrar a integração entre interface web e
banco de dados relacional utilizando uma API REST.

---

## 🚀 Funcionalidades

- ➕ Adicionar novas tarefas
- 📅 Definir data limite
- ✏️ Editar tarefas existentes (via modal)
- ❌ Excluir tarefas
- 💰 Cálculo automático do custo total
- 🎨 Destaque visual para tarefas com custo alto
- 💾 Persistência dos dados no MySQL (não perde ao atualizar a página)

---

## 🛠️ Tecnologias Utilizadas

### Front-end

- HTML5
- CSS3
- JavaScript (Vanilla JS)

### Back-end

- Node.js
- Express
- MySQL
- mysql2 (driver de conexão)

---

## 🗄️ Estrutura do Projeto

```plaintext
projeto/
│
├── public/
│   ├── index.html
│   ├── index.js
│   └── styles.css
│
├── server.js
├── package.json
└── README.md
```

---

## ⚙️ Como Executar o Projeto

### 1️⃣ Clonar o repositório

```bash
git clone <url-do-repositorio>
cd projeto
```

### 2️⃣ Instalar dependências

```bash
npm install
```

### 3️⃣ Criar o banco de dados no MySQL

Execute no MySQL Workbench:

```sql
CREATE DATABASE tarefas_db;
USE tarefas_db;

CREATE TABLE Tarefas (
  id INT AUTO_INCREMENT PRIMARY KEY,
  nome VARCHAR(100) NOT NULL UNIQUE,
  custo DECIMAL(10,2) NOT NULL,
  dataLimite DATE NOT NULL
);
```

### 4️⃣ Configurar conexão no `server.js`

```js
const dbConfig = {
  host: "localhost",
  user: "root",
  password: "root",
  database: "tarefas_db",
};
```

### 5️⃣ Rodar o servidor

```bash
node server.js
```

Servidor iniciará em:

    http://localhost:3000

---

## 🔌 Endpoints da API

Método Rota Descrição

---

GET /tarefas Lista todas as tarefas
POST /tarefas Cria uma nova tarefa
PUT /tarefas/:id Edita uma tarefa
DELETE /tarefas/:id Remove uma tarefa

---

## 🧠 Funcionamento da Arquitetura

```plaintext
Frontend (HTML + JS)
        ↓ fetch API
Backend (Node.js + Express)
        ↓
Banco de Dados (MySQL)
```

O front-end envia requisições HTTP para a API, que realiza operações no
banco de dados e retorna os dados atualizados para a interface.

---

## 📊 Regras de Negócio

- O nome da tarefa é obrigatório e único
- O custo deve ser um valor numérico válido
- A data limite deve ser informada
- Tarefas com custo ≥ 1000 recebem destaque visual
- O total de custos é atualizado automaticamente

---

## 🎯 Objetivo Acadêmico

Este projeto foi desenvolvido com fins educacionais para praticar: -
CRUD completo com API REST - Integração entre front-end e banco de
dados - Manipulação do DOM com JavaScript - Uso de Node.js com Express -
Persistência de dados em MySQL

---

## 👩‍💻 Autora

Maria Eduarda Machado Massucato\
Estudante de Análise e Desenvolvimento de Sistemas -- IFES

---

## 📌 Observação

Os dados são persistidos no MySQL, portanto não são perdidos ao
atualizar a página (F5), diferentemente de aplicações que utilizam
apenas armazenamento em memória.
