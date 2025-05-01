const url = "https://docs.google.com/spreadsheets/d/e/2PACX-1vRYaXiI0WHt73BCQa69SR9dzaiEZagy5pQBeWh62xKBsOtvUDNs-VL8Rg4OX-ypHpKhoi6i3XKFu5VM/pub?gid=0&single=true&output=csv";

async function carregarAnimais() {
  const resposta = await fetch(url);
  const texto = await resposta.text();
  const linhas = texto.split("\n").slice(1); // Ignora o cabeçalho
  const div = document.getElementById("animais");
  div.innerHTML = "";

  linhas.forEach(linha => {
    const colunas = linha.split(/,(?=(?:(?:[^\"]*\"){2})*[^\"]*$)/); // separa colunas corretamente
    if (colunas.length > 2) {
      const nome = colunas[0]?.replace(/"/g, "").trim();
      const especie = colunas[1]?.replace(/"/g, "").trim();
      const idade = colunas[2]?.replace(/"/g, "").trim();

      const card = document.createElement("div");
      card.className = "card";
      card.innerHTML = `<strong>${nome}</strong><br>Espécie: ${especie}<br>Idade: ${idade}`;
      div.appendChild(card);
    }
  });
}

carregarAnimais();