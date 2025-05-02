
const URL = "https://docs.google.com/spreadsheets/d/e/2PACX-1vRYaXiI0WHt73BCQa69SR9dzaiEZagy5pQBeWh62xKBsOtvUDNs-VL8Rg4OX-ypHpKhoi6i3XKFu5VM/pub?gid=0&single=true&output=csv";

async function buscarDados() {
  const resposta = await fetch(URL);
  const texto = await resposta.text();
  const linhas = texto.split("\n").slice(1);
  const animais = [];
  linhas.forEach(linha => {
    const colunas = linha.split(",");
    if (colunas.length >= 13) {
      animais.push({
        nome: colunas[0],
        especie: colunas[1],
        idade: colunas[2],
        sexo: colunas[3],
        raca: colunas[4],
        chip: colunas[5],
        validade_raiva: colunas[6],
        validade_virus: colunas[7],
        castrado: colunas[9],
        responsavel: colunas[10],
        endereco: colunas[11],
        telefone: colunas[12]
      });
    }
  });
  return animais;
}

function preencherDados(animais) {
  const div = document.getElementById("animais");
  div.innerHTML = "";
  animais.forEach(a => {
    const el = document.createElement("div");
    el.className = "cartao";
    el.innerHTML = `
      <strong>${a.nome}</strong><br>
      Espécie: ${a.especie}<br>
      Idade: ${a.idade}<br>
      Sexo: ${a.sexo}<br>
      Raça: ${a.raca}<br>
      Chip: ${a.chip}<br>
      Vacina Raiva: ${a.validade_raiva}<br>
      Vacina Vírus: ${a.validade_virus}<br>
      Castrado: ${a.castrado}<br>
      Responsável: ${a.responsavel}<br>
      Endereço: ${a.endereco}<br>
      Telefone: ${a.telefone}
    `;
    div.appendChild(el);
  });
}

function criarGraficos(animais) {
  const total = animais.length;
  const identificados = animais.filter(a => a.chip && a.chip.trim() !== "").length;
  const castrados = animais.filter(a => a.castrado.toLowerCase() === "sim").length;
  const vacinados = animais.filter(a => a.validade_virus && a.validade_virus.toLowerCase() !== "não").length;

  new Chart(document.getElementById("graficoTotal"), {
    type: "doughnut",
    data: {
      labels: ["Identificados", "Não identificados"],
      datasets: [{ data: [identificados, total - identificados], backgroundColor: ["green", "lightgray"] }]
    }
  });

  new Chart(document.getElementById("graficoCastrados"), {
    type: "bar",
    data: {
      labels: ["Castrados", "Não Castrados"],
      datasets: [{ data: [castrados, total - castrados], backgroundColor: ["blue", "gray"] }]
    }
  });

  new Chart(document.getElementById("graficoVacinados"), {
    type: "bar",
    data: {
      labels: ["Raiva", "Vírus"],
      datasets: [{ data: [vacinados / 2, vacinados / 2], backgroundColor: ["orange", "purple"] }]
    }
  });
}

buscarDados().then(animais => {
  preencherDados(animais);
  criarGraficos(animais);
});
