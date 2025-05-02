const URL = "https://docs.google.com/spreadsheets/d/e/2PACX-1vRYaXiI0WHt73BCQa69SR9dzaiEZagy5pQBeWh62xKBsOtvUDNs-VL8Rg4OX-ypHpKhoi6i3XKFu5VM/pub?gid=0&single=true&output=csv";

async function carregarAnimais() {
  const response = await fetch(URL);
  const texto = await response.text();
  const linhas = texto.split("\n").slice(1);
  const div = document.getElementById("animalCards");
  div.innerHTML = "";

  let total = 0;
  let castrados = 0;
  let vacRaiva = 0;
  let vacVirus = 0;

  linhas.forEach(linha => {
    const col = linha.split(",");
    if (col.length > 5 && col[0].trim()) {
      const [nome, especie, idade, sexo, raca, chip, valRaiva, valVirus, valData, castrado, responsavel, endereco, telefone] = col;

      const card = document.createElement("div");
      card.className = "animal-card";
      card.innerHTML = `<strong>${nome}</strong><br/>
        Espécie: ${especie}<br/>
        Idade: ${idade}<br/>
        Sexo: ${sexo}<br/>
        Raça: ${raca}<br/>
        Chip: ${chip || "Não"}<br/>
        Vacina Raiva: ${valRaiva}<br/>
        Vacina Vírus: ${valVirus}<br/>
        Castrado: ${castrado}<br/>
        Responsável: ${responsavel}<br/>
        Endereço: ${endereco}<br/>
        Telefone: ${telefone}`;

      div.appendChild(card);
      total++;
      if (castrado.trim().toLowerCase() === "sim") castrados++;
      if (valRaiva.trim() !== "Não") vacRaiva++;
      if (valVirus.trim() !== "Não") vacVirus++;
    }
  });

  desenharGraficos(total, castrados, vacRaiva, vacVirus);
}

function desenharGraficos(total, castrados, vacRaiva, vacVirus) {
  const ctx1 = document.getElementById("chartIdentificados").getContext("2d");
  new Chart(ctx1, {
    type: "doughnut",
    data: {
      labels: ["Identificados", "Não identificados"],
      datasets: [{
        data: [total, 0],
        backgroundColor: ["#4CAF50", "#ccc"]
      }]
    },
    options: {
      plugins: {
        legend: { position: "top" },
        tooltip: { enabled: true }
      }
    }
  });

  const ctx2 = document.getElementById("chartCastrados").getContext("2d");
  new Chart(ctx2, {
    type: "bar",
    data: {
      labels: ["Castrados", "Não Castrados"],
      datasets: [{
        label: "%",
        data: [castrados, total - castrados],
        backgroundColor: ["#2196F3", "#aaa"]
      }]
    },
    options: {
      plugins: { legend: { display: false } },
      scales: {
        y: {
          beginAtZero: true,
          ticks: { callback: v => v + "%" }
        }
      }
    }
  });

  const ctx3 = document.getElementById("chartVacinados").getContext("2d");
  new Chart(ctx3, {
    type: "bar",
    data: {
      labels: ["Raiva", "Vírus"],
      datasets: [{
        label: "%",
        data: [vacRaiva, vacVirus],
        backgroundColor: ["orange", "purple"]
      }]
    },
    options: {
      plugins: { legend: { display: false } },
      scales: {
        y: {
          beginAtZero: true,
          ticks: { callback: v => v + "%" }
        }
      }
    }
  });
}

document.getElementById("searchInput").addEventListener("input", function () {
  const filtro = this.value.toLowerCase();
  document.querySelectorAll(".animal-card").forEach(card => {
    card.style.display = card.textContent.toLowerCase().includes(filtro) ? "" : "none";
  });
});

// Simula contador local (não persistente)
document.getElementById("visitCount").textContent = Math.floor(Math.random() * 1000 + 1);

carregarAnimais();