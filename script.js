const URL = "https://docs.google.com/spreadsheets/d/e/2PACX-1vRYaXiI0WHt73BCQa69SR9dzaiEZagy5pQBeWh62xKBsOtvUDNs-VL8Rg4OX-ypHpKhoi6i3XKFu5VM/pub?gid=0&single=true&output=csv";

async function carregarAnimais() {
  const resposta = await fetch(URL);
  const texto = await resposta.text();
  const linhas = texto.split("\n").slice(1);
  const div = document.getElementById("animais");
  div.innerHTML = "";

  const estatisticas = {
    identificados: 0,
    naoIdentificados: 0,
    castrados: 0,
    naoCastrados: 0,
    raiva: 0,
    virus: 0
  };

  linhas.forEach(linha => {
    const colunas = linha.split(",");
    if (colunas.length > 1) {
      const [
        nome, especie, idade, sexo, raca, chip,
        dataRaiva, dataVirus, validade, castrado,
        responsavel, endereco, telefone
      ] = colunas.map(c => c.trim());

      const cartao = document.createElement("div");
      cartao.className = "cartao";
      cartao.innerHTML = `
        <strong>${nome}</strong><br>
        Espécie: ${especie}<br>
        Idade: ${idade}<br>
        Sexo: ${sexo}<br>
        Raça: ${raca}<br>
        Chip: ${chip}<br>
        Vacina Raiva: ${dataRaiva}<br>
        Vacina Vírus: ${dataVirus}<br>
        Castrado: ${castrado}<br>
        Responsável: ${responsavel}<br>
        Endereço: ${endereco}<br>
        Telefone: ${telefone}
      `;
      div.appendChild(cartao);

      if (chip !== "") estatisticas.identificados++; else estatisticas.naoIdentificados++;
      if (castrado.toLowerCase() === "sim") estatisticas.castrados++; else estatisticas.naoCastrados++;
      if (dataRaiva !== "Não" && dataRaiva !== "") estatisticas.raiva++;
      if (dataVirus !== "Não" && dataVirus !== "") estatisticas.virus++;
    }
  });

  desenharGraficos(estatisticas);
}

function desenharGraficos(est) {
  new Chart(document.getElementById("graficoIdentificacao"), {
    type: "doughnut",
    data: {
      labels: ["Identificados", "Não identificados"],
      datasets: [{
        data: [est.identificados, est.naoIdentificados],
        backgroundColor: ["#4CAF50", "#ccc"]
      }]
    }
  });

  new Chart(document.getElementById("graficoCastracao"), {
    type: "bar",
    data: {
      labels: ["Castrados", "Não Castrados"],
      datasets: [{
        label: "Porcentagem",
        data: [est.castrados, est.naoCastrados],
        backgroundColor: ["#2196F3", "#999"]
      }]
    },
    options: { plugins: { legend: { display: false } } }
  });

  new Chart(document.getElementById("graficoVacinacao"), {
    type: "bar",
    data: {
      labels: ["Raiva", "Vírus"],
      datasets: [{
        label: "Porcentagem",
        data: [est.raiva, est.virus],
        backgroundColor: ["#ff9800", "#9c27b0"]
      }]
    },
    options: { plugins: { legend: { display: false } } }
  });
}

document.getElementById("busca").addEventListener("input", function () {
  const termo = this.value.toLowerCase();
  document.querySelectorAll(".cartao").forEach(cartao => {
    cartao.style.display = cartao.textContent.toLowerCase().includes(termo) ? "" : "none";
  });
});

let visitas = localStorage.getItem("visitas") || 0;
visitas++;
localStorage.setItem("visitas", visitas);
document.getElementById("contador").textContent = "Visitas: " + visitas;

carregarAnimais();