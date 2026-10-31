
// Elementos do HTML
const cidadeInput = document.getElementById("cidade");
const botaoBuscar = document.getElementById("buscar");

const nomeCidade = document.getElementById("nome-cidade");
const temperatura = document.getElementById("temperatura");
const icone = document.getElementById("icone");
const condicao = document.getElementById("condicao");
const umidade = document.getElementById("umidade");
const vento = document.getElementById("vento");
const mensagem = document.getElementById("mensagem");

// Interpretar condição meteorológica
function interpretarClima(codigo) {
    if (codigo === 0) return ["Ensolarado", "☀️"];

    if ([1, 2].includes(codigo)) {
        return ["Parcialmente nublado", "🌤️"];
    }

    if (codigo === 3) return ["Nublado", "☁️"];

    if ([45, 48].includes(codigo)) {
        return ["Neblina", "🌫️"];
    }

    if ([51, 53, 55, 56, 57].includes(codigo)) {
        return ["Garoa", "🌦️"];
    }

    if ([61, 63, 65, 66, 67, 80, 81, 82].includes(codigo)) {
        return ["Chuva", "🌧️"];
    }

    if ([71, 73, 75, 77, 85, 86].includes(codigo)) {
        return ["Neve", "❄️"];
    }

    if ([95, 96, 99].includes(codigo)) {
        return ["Tempestade", "⛈️"];
    }

    return ["Condição desconhecida", "🌡️"];
}

// Buscar clima
async function buscarClima() {

    const cidade = cidadeInput.value.trim();

    if (cidade === "") {
        mensagem.textContent = "Digite o nome de uma cidade!";
        return;
    }

    mensagem.textContent = "Buscando informações...";
    botaoBuscar.disabled = true;

    try {

        // Buscar localização da cidade
        const urlCidade =
            "https://geocoding-api.open-meteo.com/v1/search?name=" +
            encodeURIComponent(cidade) +
            "&count=1&language=pt&format=json";

        const respostaCidade = await fetch(urlCidade);
        const dadosCidade = await respostaCidade.json();

        if (!dadosCidade.results || dadosCidade.results.length === 0) {
            throw new Error("Cidade não encontrada!");
        }

        const local = dadosCidade.results[0];

        // Buscar informações meteorológicas
        const urlClima =
            "https://api.open-meteo.com/v1/forecast?latitude=" +
            local.latitude +
            "&longitude=" +
            local.longitude +
            "&current=temperature_2m,relative_humidity_2m,wind_speed_10m,weather_code&timezone=auto";

        const respostaClima = await fetch(urlClima);
        const dadosClima = await respostaClima.json();

        const atual = dadosClima.current;

        if (!atual) {
            throw new Error("Não foi possível obter os dados do clima.");
        }

        const resultado = interpretarClima(atual.weather_code);

        // Atualizar HTML
        nomeCidade.textContent = local.name;

        temperatura.textContent =
            Math.round(atual.temperature_2m) + "°C";

        umidade.textContent =
            atual.relative_humidity_2m + "%";

        vento.textContent =
            atual.wind_speed_10m + " km/h";

        condicao.textContent = resultado[0];
        icone.textContent = resultado[1];

        mensagem.textContent = "Dados atualizados com sucesso!";

    } catch (erro) {

        mensagem.textContent =
            erro.message || "Não foi possível consultar o clima.";

    } finally {

        botaoBuscar.disabled = false;

    }
}

// Evento do botão
botaoBuscar.addEventListener("click", buscarClima);

// Pesquisar apertando Enter
cidadeInput.addEventListener("keydown", function(event) {
    if (event.key === "Enter") {
        buscarClima();
    }
});