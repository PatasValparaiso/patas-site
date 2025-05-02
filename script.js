
const URL = "https://docs.google.com/spreadsheets/d/e/2PACX-1vRYaXiI0WHt73BCQa69SR9dzaiEZagy5pQBeWh62xKBsOtvUDNs-VL8Rg4OX-ypHpKhoi6i3XKFu5VM/pub?gid=0&single=true&output=csv";

async function carregar() {
  const r = await fetch(URL);
  const t = await r.text();
  const linhas = t.split("\n").slice(1);
  const div = document.getElementById("cards");
  let identificados = 0, total = 0, castrados = 0, raiva = 0, virus = 0;

  linhas.forEach(linha => {
    const col = linha.split(",");
    if (col.length < 13) return;

    const [nome, especie, idade, sexo, raca, chip, vr, vv, validade, castrado, responsavel, endereco, telefone] = col;

    const divCard = document.createElement("div");
    divCard.className = "card";
    divCard.innerHTML = `
      <strong>${nome}</strong><br/>
      Espécie: ${especie}<br/>
      Idade: ${idade}<br/>
      Sexo: ${sexo}<br/>
      Raça: ${raca}<br/>
      Chip: ${chip}<br/>
      Vacina Raiva: ${vr}<br/>
      Vacina Vírus: ${vv}<br/>
      Castrado: ${castrado}<br/>
      Responsável: ${responsavel}<br/>
      Endereço: ${endereco}<br/>
      Telefone: ${telefone}
    `;
    div.appendChild(divCard);

    total++;
    if (chip) identificados++;
    if (castrado.toLowerCase().includes("sim")) castrados++;
    if (vr && vr !== "Não") raiva++;
    if (vv && vv !== "Não") virus++;
  });

  new Chart(document.getElementById("chartIdentificados"), {
    type: "doughnut",
    data: {
      labels: ["Identificados", "Não identificados"],
      datasets: [{
        data: [identificados, total - identificados],
        backgroundColor: ["green", "lightgray"]
      }]
    },
    options: {
      plugins: { legend: { position: "top" } },
    }
  });

  new Chart(document.getElementById("chartCastrados"), {
    type: "bar",
    data: {
      labels: ["Castrados", "Não Castrados"],
      datasets: [{
        data: [castrados, total - castrados],
        backgroundColor: ["blue", "gray"]
      }]
    },
    options: {
      plugins: {
        tooltip: {
          callbacks: {
            label: ctx => `${(ctx.raw * 100 / total).toFixed(0)}%`
          }
        }
      }
    }
  });

  new Chart(document.getElementById("chartVacinados"), {
    type: "bar",
    data: {
      labels: ["Raiva", "Vírus"],
      datasets: [{
        data: [raiva, virus],
        backgroundColor: ["orange", "purple"]
      }]
    },
    options: {
      plugins: {
        tooltip: {
          callbacks: {
            label: ctx => `${(ctx.raw * 100 / total).toFixed(0)}%`
          }
        }
      }
    }
  });
}

carregar();

document.getElementById("search").addEventListener("input", function () {
  const val = this.value.toLowerCase();
  const cards = document.querySelectorAll(".card");
  cards.forEach(card => {
    card.style.display = card.textContent.toLowerCase().includes(val) ? "block" : "none";
  });
});
