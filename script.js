const url = "https://docs.google.com/spreadsheets/d/e/2PACX-1vRYaXiI0WHt73BCQa69SR9dzaiEZagy5pQBeWh62xKBsOtvUDNs-VL8Rg4OX-ypHpKhoi6i3XKFu5VM/pub?gid=0&single=true&output=csv";

let todos = [];

async function carregarDados() {
  const resp = await fetch(url);
  const texto = await resp.text();
  const linhas = texto.trim().split("\n").slice(1);
  todos = linhas.map(linha => {
    const [
      nome, especie, idade, sexo, raca, chip, vacRaiva, vacVirus, validade, castrado,
      responsavel, endereco, telefone
    ] = linha.split(/,(?=(?:(?:[^"]*\"){2})*[^"]*$)/).map(c => c.replace(/\"/g, "").trim());
    return { nome, especie, idade, sexo, raca, chip, vacRaiva, vacVirus, validade, castrado, responsavel, endereco, telefone };
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
    el.innerHTML = `
      <strong>${animal.nome}</strong><br>
      Espécie: ${animal.especie}<br>
      Idade: ${animal.idade}<br>
      Sexo: ${animal.sexo}<br>
      Raça: ${animal.raca}<br>
      Chip: ${animal.chip}<br>
      Vacina Raiva: ${animal.vacRaiva}<br>
      Vacina Vírus: ${animal.vacVirus}<br>
      Castrado: ${animal.castrado}<br>
      Responsável: ${animal.responsavel}<br>
      Endereço: ${animal.endereco}<br>
      Telefone: ${animal.telefone}
    `;
    div.appendChild(el);
  });
}

function gerarGraficos(lista) {
  const total = lista.length;
  const castrados = lista.filter(a => a.castrado.toLowerCase() === "sim").length;
  const vacRaiva = lista.filter(a => a.vacRaiva.toLowerCase() !== "não").length;
  const vacVirus = lista.filter(a => a.vacVirus.toLowerCase() !== "não").length;

  new Chart(document.getElementById("graficoTotal"), {
    type: "doughnut",
    data: {
      labels: ["Identificados", "Não identificados"],
      datasets: [{
        data: [total, 0],
        backgroundColor: ["#4caf50", "#ddd"]
      }]
    },
    options: {
      plugins: {
        legend: {
          labels: {
            generateLabels: function(chart) {
              const data = chart.data.datasets[0].data;
              const labels = chart.data.labels;
              const total = data.reduce((a, b) => a + b, 0);
              return labels.map((l, i) => ({
                text: `${l} (${Math.round((data[i]/total)*100)}%)`,
                fillStyle: chart.data.datasets[0].backgroundColor[i],
                index: i
              }));
            }
          }
        },
        tooltip: {
          callbacks: {
            label: function(context) {
              const total = context.dataset.data.reduce((a, b) => a + b, 0);
              const val = context.raw;
              const percent = Math.round((val / total) * 100);
              return `${val} (${percent}%)`;
            }
          }
        }
      },
      // pluginsCenterText removido
        display: true,
        
      }
    },
    // plugin de texto central removido
      beforeDraw: function(chart) {
        const width = chart.width, height = chart.height;
        const ctx = chart.ctx;
        ctx.restore();
        const fontSize = (height / 114).toFixed(2);
        ctx.font = `${fontSize}em sans-serif`;
        ctx.textBaseline = "middle";
        const text = chart.options.pluginsCenterText.text;
        const textX = Math.round((width - ctx.measureText(text).width) / 2);
        const textY = height / 2;
        ctx.fillStyle = "#4caf50";
        ctx.fillText(text, textX, textY);
        ctx.save();
      }
    }]
  });

  new Chart(document.getElementById("graficoCastrados"), {
    type: "bar",
    data: {
      labels: ["Castrados", "Não Castrados"],
      datasets: [{
        data: [castrados, total - castrados],
        backgroundColor: ["#2196f3", "#aaa"]
      }]
    },
    options: {
      plugins: {
        tooltip: {
          callbacks: {
            label: function(ctx) {
              const total = ctx.dataset.data.reduce((a,b)=>a+b,0);
              const percent = Math.round((ctx.raw/total)*100);
              return `${ctx.raw} (${percent}%)`;
            }
          }
        }
      }
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
    },
    options: {
      plugins: {
        tooltip: {
          callbacks: {
            label: function(ctx) {
              const total = ctx.dataset.data.reduce((a,b)=>a+b,0);
              const percent = Math.round((ctx.raw/total)*100);
              return `${ctx.raw} (${percent}%)`;
            }
          }
        }
      }
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