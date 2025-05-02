
const URL = "https://docs.google.com/spreadsheets/d/e/2PACX-1vRYaXiI0WHt73BCQa69SR9dzaiEZagy5pQBeWh62xKBsOtvUDNs-VL8Rg4OX-ypHpKhoi6i3XKFu5VM/pub?gid=0&single=true&output=csv";

async function carregarAnimais() {
    const resposta = await fetch(URL);
    const texto = await resposta.text();
    const linhas = texto.trim().split("\n").slice(1);
    const div = document.getElementById("animais");
    div.innerHTML = "";

    let identificados = 0;
    let naoIdentificados = 0;
    let castrados = 0;
    let vacRaiva = 0;
    let vacVirus = 0;

    linhas.forEach(linha => {
        const colunas = linha.split(",");

        const [
            nome, especie, idade, sexo, raca, chip,
            dataRaiva, validadeRaiva, dataVirus, validadeVirus,
            castrado, responsavel, endereco, telefone
        ] = colunas;

        const cartao = document.createElement("div");
        cartao.className = "cartao";
        cartao.innerHTML = `
            <strong>${nome}</strong><br>
            Espécie: ${especie}<br>
            Idade: ${idade}<br>
            Sexo: ${sexo}<br>
            Raça: ${raca}<br>
            Chip: ${chip || "-"}<br>
            Vacina Raiva: ${dataRaiva}<br>
            Validade Raiva: ${validadeRaiva}<br>
            Vacina Vírus: ${dataVirus}<br>
            Validade Vírus: ${validadeVirus}<br>
            Castrado: ${castrado}<br>
            Responsável: ${responsavel}<br>
            Endereço: ${endereco}<br>
            Telefone: ${telefone}
        `;
        div.appendChild(cartao);

        // Contagens
        if (nome) identificados++; else naoIdentificados++;
        if (castrado.toLowerCase() === "sim") castrados++;
        if (dataRaiva && dataRaiva !== "Não") vacRaiva++;
        if (dataVirus && dataVirus !== "Não") vacVirus++;
    });

    // Gráficos
    const total = identificados + naoIdentificados;
    const ctxId = document.getElementById("graficoIdentificados");
    const ctxCast = document.getElementById("graficoCastrados");
    const ctxVac = document.getElementById("graficoVacinados");

    new Chart(ctxId, {
        type: "doughnut",
        data: {
            labels: ["Identificados", "Não identificados"],
            datasets: [{
                data: [identificados, naoIdentificados],
                backgroundColor: ["green", "lightgray"]
            }]
        },
        options: {
            plugins: {
                legend: { position: "top" }
            }
        }
    });

    new Chart(ctxCast, {
        type: "bar",
        data: {
            labels: ["Castrados", "Não Castrados"],
            datasets: [{
                label: "Castrados",
                data: [castrados, total - castrados],
                backgroundColor: ["#3399ff", "#999"]
            }]
        },
        options: {
            plugins: {
                tooltip: { enabled: true }
            }
        }
    });

    new Chart(ctxVac, {
        type: "bar",
        data: {
            labels: ["Raiva", "Vírus"],
            datasets: [{
                label: "Vacinados",
                data: [vacRaiva, vacVirus],
                backgroundColor: ["#ff9900", "#9933ff"]
            }]
        },
        options: {
            plugins: {
                tooltip: { enabled: true }
            }
        }
    });
}

// Filtro
document.getElementById("search").addEventListener("input", (e) => {
    const termo = e.target.value.toLowerCase();
    const cards = document.querySelectorAll(".cartao");
    cards.forEach(c => {
        c.style.display = c.innerText.toLowerCase().includes(termo) ? "" : "none";
    });
});

carregarAnimais();
