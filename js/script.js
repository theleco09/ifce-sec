let diaAtual = null;
let jogos = [];

async function carregarJogos() {
    const container = document.getElementById("jogos-do-dia");

    try {
        const resposta = await fetch("/api/jogos");

        if (!resposta.ok) {
            throw new Error("Não foi possível buscar os jogos.");
        }

        jogos = await resposta.json();

        // Organiza as datas disponíveis, sem repetições.
        const datas = [...new Set(
            jogos
            .map(jogo => jogo.dia)
            .filter(Boolean)
            .sort()
        )];

        if (datas.length === 0) {
            container.innerHTML = "<p>Nenhum jogo cadastrado.</p>";
            atualizarBotoes(datas);
            return;
        }

        // Começa pela data mais antiga cadastrada.
        diaAtual = datas[0];

        mostrarJogos(datas);
    } catch (erro) {
        console.error("Erro ao carregar jogos:", erro);
        container.innerHTML =
            "<p>Não foi possível carregar os jogos. Tente atualizar a página.</p>";
    }
}

function atualizarBotoes(datas) {
    const botaoAnterior = document.getElementById("dia-anterior");
    const botaoProximo = document.getElementById("proximo-dia");

    const indiceAtual = datas.indexOf(diaAtual);

    botaoAnterior.disabled = indiceAtual <= 0;
    botaoProximo.disabled =
        indiceAtual === -1 || indiceAtual >= datas.length - 1;
}

function mostrarJogos(datas) {
    const container = document.getElementById("jogos-do-dia");
    const elementoData = document.getElementById("data");

    container.innerHTML = "";

    const jogosDoDia = jogos.filter(jogo => jogo.dia === diaAtual);

    // Mostra a data no formato dia/mês.
    const [ano, mes, dia] = diaAtual.split("-");
    elementoData.textContent = `${dia}/${mes}`;

    if (jogosDoDia.length === 0) {
        container.innerHTML = "<p>Não há jogos nesta data.</p>";
    }

    jogosDoDia.forEach(jogo => {
        const card = document.createElement("div");
        card.classList.add("jogo");

        const finalizado =
            jogo.placarTime1 !== null &&
            jogo.placarTime1 !== undefined &&
            jogo.placarTime2 !== null &&
            jogo.placarTime2 !== undefined;

        const modalidade = jogo.esporte || "Esporte";
        const horario = jogo.hora ?
            jogo.hora.slice(0, 5) :
            "Horário a definir";

        const time1 = (jogo.time1 || "A definir").trim();
        const time2 = (jogo.time2 || "A definir").trim();

        const placar = finalizado ?
            `${jogo.placarTime1} x ${jogo.placarTime2}` :
            "Jogo ainda não iniciado";

        // Cria o card usando textContent para inserir texto com segurança.
        const titulo = document.createElement("h2");
        titulo.textContent = `${time1} x ${time2}`;

        const resultado = document.createElement("h3");
        resultado.textContent = finalizado ? placar : "VS";

        const esporte = document.createElement("p");
        esporte.textContent = modalidade;

        const hora = document.createElement("p");
        hora.textContent = horario;

        const status = document.createElement("p");
        status.textContent = finalizado ?
            "Finalizado" :
            "Em breve";

        card.append(titulo, resultado, esporte, hora, status);
        container.appendChild(card);
    });

    atualizarBotoes(datas);
}

document.getElementById("dia-anterior").addEventListener("click", () => {
    const datas = [...new Set(
        jogos.map(jogo => jogo.dia).filter(Boolean).sort()
    )];

    const indiceAtual = datas.indexOf(diaAtual);

    if (indiceAtual > 0) {
        diaAtual = datas[indiceAtual - 1];
        mostrarJogos(datas);
    }
});

document.getElementById("proximo-dia").addEventListener("click", () => {
    const datas = [...new Set(
        jogos.map(jogo => jogo.dia).filter(Boolean).sort()
    )];

    const indiceAtual = datas.indexOf(diaAtual);

    if (indiceAtual < datas.length - 1) {
        diaAtual = datas[indiceAtual + 1];
        mostrarJogos(datas);
    }
});

carregarJogos();