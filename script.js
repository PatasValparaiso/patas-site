const url = "https://docs.google.com/spreadsheets/d/e/2PACX-1vRYaXiI0WHt73BCQa69SR9dzaiEZagy5pQBeWh62xKBsOtvUDNs-VL8Rg4OX-ypHpKhoi6i3XKFu5VM/pub?gid=0&single=true&output=csv";

async function carregarAnimais() {
  const resposta = await fetch(url);
  const texto = await resposta.text();
  const linhas = texto.split("\n").slice(1); // pula o cabeçalho
  const div = document.getElementById("animais");
  div.innerHTML = "";

  linhas.forEach(linha => {
    const colunas = linha.split(",");
    if (colunas.length > 1) {
      const nome = colunas[0];
      const especie = colunas[1];
      const idade = colunas[2];

      const card = document.createElement("div");
      card.className = "card";
      card.innerHTML = `<strong>${nome}</strong><br>Espécie: ${especie}<br>Idade: ${idade}`;
      div.appendChild(card);
    }
  });
}

carregarAnimais();