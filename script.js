const url = "https://docs.google.com/spreadsheets/d/e/2PACX-1vRYaXiI0WHt73BCQa69SR9dzaiEZagy5pQBeWh62xKBsOtvUDNs-VL8Rg4OX-ypHpKhoi6i3XKFu5VM/pub?gid=0&single=true&output=csv";

let todos = [];

async function carregarDados() {
  const resp = await fetch(url);
  const texto = await resp.text();
  const linhas = texto.trim().split("\n").slice(1);
  todos = linhas.map(linha => {
    const [nome, especie, idade, raca, cadastro, raiva, virus, castrado, responsavel, cpf, endereco, telefone] =
      linha.split(/,(?=(?:(?:[^"]*\"){2})*[^"]*$)/).map(c => c.replace(/\"/g, "").trim());
    return { nome, especie, idade, raca, cadastro, raiva, virus, castrado, responsavel, cpf, endereco, telefone };
  });
  exibir(todos);
  gerarGraficos(todos);
}

function exibir(lista) {
  const div = document.getElementById("cards");
  div.innerHTML = "";
  lista.forEach(animal => {
    const el = document.createElement("div");
    el.className = "card";
    el.innerHTML = `<strong>${animal.nome}</strong><br>Espécie: ${animal.especie}<br>Idade: ${animal.idade}<br>Raça: ${animal.raca}<br>Castrado: ${animal.castrado}<br>Vacina Raiva: ${animal.raiva}<br>Vacina Vírus: ${animal.virus}<br>Responsável: ${animal.responsavel}<br>Telefone: ${animal.telefone}`;
    div.appendChild(el);
  });
}

function gerarGraficos(lista) {
  const total = lista.length;
  const castrados = lista.filter(a => a.castrado.toLowerCase() === "sim").length;
  const vacRaiva = lista.filter(a => a.raiva.toLowerCase() === "sim").length;
  const vacVirus = lista.filter(a => a.virus.toLowerCase() === "sim").length;

  new Chart(document.getElementById("graficoTotal"), {
    type: "doughnut",
    data: {
      labels: ["Identificados", "Não identificados"],
      datasets: [{ data: [total, 0], backgroundColor: ["#4caf50", "#ddd"] }]
    }
  });

  new Chart(document.getElementById("graficoCastrados"), {
    type: "bar",
    data: {
      labels: ["Castrados", "Não Castrados"],
      datasets: [{
        data: [castrados, total - castrados],
        backgroundColor: ["#2196f3", "#aaa"]
      }]
    }
  });

  new Chart(document.getElementById("graficoVacinados"), {
    type: "bar",
    data: {
      labels: ["Raiva", "Vírus"],
      datasets: [{
        data: [vacRaiva, vacVirus],
        backgroundColor: ["#ff9800", "#9c27b0"]
      }]
    }
  });
}

document.getElementById("search").addEventListener("input", e => {
  const termo = e.target.value.toLowerCase();
  const filtrado = todos.filter(a =>
    Object.values(a).some(v => v.toLowerCase().includes(termo))
  );
  exibir(filtrado);
});

carregarDados();

Chart.defaults.plugins.legend.labels.generateLabels = function(chart) {
  const data = chart.data;
  return data.labels.map((label, i) => {
    const value = data.datasets[0].data[i];
    const total = data.datasets[0].data.reduce((a, b) => a + b, 0);
    const percent = total ? Math.round((value / total) * 100) : 0;
    return {
      text: `${label} (${percent}%)`,
      fillStyle: data.datasets[0].backgroundColor[i],
      index: i
    };
  });
};