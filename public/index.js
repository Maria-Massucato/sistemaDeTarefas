const API_URL = window.location.hostname.includes("localhost")
  ? "http://localhost:3000"
  : "https://sistemadetarefas-production-cab8.up.railway.app";

let tarefas = [];
let tarefaEditando = null;

// ===============================
// 🔄 CARREGAR TAREFAS DO BANCO
// ===============================
async function carregarTarefas() {
  const resposta = await fetch(`${API_URL}/tarefas`);
  const dados = await resposta.json();

  tarefas = dados.map((t) => ({
    id: t.id,
    nome: t.nome,
    custo: `R$ ${parseFloat(t.custo).toFixed(2).replace(".", ",")}`,
    data: formatarData(t.dataLimite),
  }));

  document.querySelector(".dadosTabela").innerHTML = "";
  tarefas.forEach(adicionarLinhaTabela);
  atualizarTotal();
}

// ===============================
// MODAL
// ===============================
const modal = document.getElementById("editarModal");
const formularioModal = document.getElementById("editarForm");
const botaoFecharModal = document.querySelector(".close");

// ===============================
// FORMATAÇÃO
// ===============================
function formatarData(data) {
  if (!data) return "";

  // Garante que pega só a parte da data (sem horário)
  const apenasData = data.split("T")[0]; // remove horário
  const partes = apenasData.split("-");

  return partes.length === 3 ? `${partes[2]}-${partes[1]}-${partes[0]}` : data;
}

function converterData(data) {
  if (!data) return "";

  // Caso venha no formato ISO (2026-02-20T00:00:00.000Z)
  if (data.includes("T")) {
    return data.split("T")[0];
  }

  // Caso esteja em dd-MM-yyyy
  if (data.includes("-") && data.split("-")[0].length === 2) {
    const [dia, mes, ano] = data.split("-");
    return `${ano}-${mes}-${dia}`;
  }

  // Caso esteja em dd/MM/yyyy
  if (data.includes("/")) {
    const [dia, mes, ano] = data.split("/");
    return `${ano}-${mes}-${dia}`;
  }

  return data;
}
function formatarCusto(valor) {
  const valorNormalizado = valor.replace(",", ".");
  if (!/^\d+(\.\d{1,2})?$/.test(valorNormalizado)) return null;
  return parseFloat(valorNormalizado).toFixed(2);
}

function verificarCustoAlto(custoString) {
  const custo = parseFloat(custoString.replace("R$ ", "").replace(",", "."));
  return custo >= 1000;
}

// ===============================
// TABELA
// ===============================
function adicionarLinhaTabela(tarefa) {
  const dadosTabela = document.querySelector(".dadosTabela");
  const novaLinha = document.createElement("tr");
  novaLinha.setAttribute("data-id", tarefa.id);

  if (verificarCustoAlto(tarefa.custo)) {
    novaLinha.classList.add("tarefa-custo-alto");
  }

  novaLinha.innerHTML = `
    <td>${tarefa.nome}</td>
    <td>${tarefa.custo}</td>
    <td>${tarefa.data}</td>
    <td>
      <button class="btn-editar" onclick="abrirModalEdicao(${tarefa.id})">
        <img src="images/editar.png">
      </button>
      <button class="btn-excluir" onclick="excluirTarefa(${tarefa.id})">
        <img src="images/lixeira.png">
      </button>
    </td>
  `;

  dadosTabela.appendChild(novaLinha);
}

// ===============================
// ABRIR / FECHAR MODAL
// ===============================
function abrirModalEdicao(id) {
  const tarefa = tarefas.find((t) => t.id === id);
  if (!tarefa) return;

  tarefaEditando = id;
  document.getElementById("editarNome").value = tarefa.nome;
  document.getElementById("editarCusto").value = tarefa.custo
    .replace("R$ ", "")
    .replace(",", ".");
  document.getElementById("editarData").value = converterData(tarefa.data);

  modal.style.display = "block";
}

function fecharModal() {
  modal.style.display = "none";
  tarefaEditando = null;
  formularioModal.reset();
}

// ===============================
// EXCLUIR (AGORA NO BANCO)
// ===============================
async function excluirTarefa(id) {
  if (!confirm("Tem certeza que deseja excluir esta tarefa?")) return;

  await fetch(`${API_URL}/tarefas/${id}`, {
    method: "DELETE",
  });

  await carregarTarefas();
}

// ===============================
// TOTAL
// ===============================
function atualizarTotal() {
  const total = tarefas.reduce((acc, tarefa) => {
    const custo = parseFloat(tarefa.custo.replace("R$ ", "").replace(",", "."));
    return acc + custo;
  }, 0);

  const totalFormatado = total.toFixed(2).replace(".", ",");
  document.querySelector(".totalCusto").textContent = `R$ ${totalFormatado}`;
}

// ===============================
// ADICIONAR TAREFA (AGORA NO BANCO)
// ===============================
const formulario = document.querySelector(".formulario form");
const campoCusto = formulario.querySelector(".custo");

formulario.addEventListener("submit", async function (evento) {
  evento.preventDefault();

  const nome = formulario.querySelector(".nome").value.trim();
  const custoInput = formulario.querySelector(".custo").value.trim();
  const dataInput = formulario.querySelector(".dataLimite").value;

  if (!nome || !custoInput || !dataInput) {
    alert("Preencha todos os campos!");
    return;
  }

  const custoFormatado = formatarCusto(custoInput);
  if (!custoFormatado) {
    alert("Custo inválido!");
    return;
  }

  await fetch(`${API_URL}/tarefas`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      nome,
      custo: custoFormatado,
      dataLimite: dataInput,
    }),
  });

  formulario.reset();
  await carregarTarefas();
});

// ===============================
// EDITAR TAREFA (AGORA NO BANCO)
// ===============================
formularioModal.addEventListener("submit", async function (evento) {
  evento.preventDefault();
  if (!tarefaEditando) return;

  const nome = document.getElementById("editarNome").value.trim();
  const custoInput = document.getElementById("editarCusto").value.trim();
  const dataInput = document.getElementById("editarData").value;

  if (!nome || !custoInput || !dataInput) {
    alert("Preencha todos os campos!");
    return;
  }

  const custoFormatado = formatarCusto(custoInput);
  if (!custoFormatado) {
    alert("Custo inválido!");
    return;
  }

  await fetch(`${API_URL}/tarefas/${tarefaEditando}`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      nome,
      custo: custoFormatado,
      dataLimite: dataInput,
    }),
  });

  fecharModal();
  await carregarTarefas();
});

// ===============================
// FECHAR MODAL
// ===============================
botaoFecharModal.addEventListener("click", fecharModal);

window.addEventListener("click", function (evento) {
  if (evento.target === modal) fecharModal();
});

// ===============================
// INPUT CUSTO
// ===============================
campoCusto.addEventListener("input", function () {
  this.value = this.value.replace(/[^0-9.,]/g, "");
});

// ===============================
// INICIALIZAR
// ===============================
window.addEventListener("DOMContentLoaded", carregarTarefas);
