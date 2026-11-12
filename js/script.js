
let diaAtual = null;
let jogos = [];
let categoriaAtual = "Masculino";

async function carregarJogos() {
    const container = document.getElementById("jogos-do-dia");

    try {
        const resposta = await fetch("/api/jogos");

        if (!resposta.ok) {
            throw new Error("Não foi possível buscar os jogos.");
        }

        jogos = await resposta.json();

        const datas = obterDatas();

        if (datas.length === 0) {
            diaAtual = null;
            mostrarJogos(datas);
            return;
        }

        diaAtual = datas[0];
        mostrarJogos(datas);

    } catch (erro) {
        console.error("Erro ao carregar jogos:", erro);

        container.innerHTML =
            "<p>Não foi possível carregar os jogos. Tente atualizar a página.</p>";
    }
}

// Retorna somente os jogos da categoria selecionada.
function obterJogosCategoria() {
    return jogos.filter(jogo =>
        jogo.categoria === categoriaAtual
    );
}

// Organiza as datas disponíveis na categoria selecionada.
function obterDatas() {
    return [...new Set(
        obterJogosCategoria()
            .map(jogo => jogo.data_jogo)
            .filter(Boolean)
            .sort()
    )];
}

function atualizarBotoes(datas) {
    const botaoAnterior = document.getElementById("dia-anterior");
    const botaoProximo = document.getElementById("proximo-dia");

    const indiceAtual = datas.indexOf(diaAtual);

    botaoAnterior.disabled = indiceAtual <= 0;

    botaoProximo.disabled =
        indiceAtual === -1 || indiceAtual >= datas.length - 1;
}

function atualizarBotoesCategoria() {
    const masculino = document.getElementById("categoria-masculino");
    const feminino = document.getElementById("categoria-feminino");

    masculino.classList.toggle(
        "categoria-ativa",
        categoriaAtual === "Masculino"
    );

    feminino.classList.toggle(
        "categoria-ativa",
        categoriaAtual === "Feminino"
    );
}

function selecionarCategoria(categoria) {
    categoriaAtual = categoria;

    const datas = obterDatas();

    // Começa pela primeira data disponível da categoria.
    diaAtual = datas.length > 0 ? datas[0] : null;

    atualizarBotoesCategoria();
    mostrarJogos(datas);
}

function mostrarJogos(datas) {
    const container = document.getElementById("jogos-do-dia");
    const elementoData = document.getElementById("data");

    container.innerHTML = "";

    const jogosDaCategoria = obterJogosCategoria();

    if (datas.length === 0) {
        elementoData.textContent = "--";
        container.innerHTML =
            "<p>Nenhum jogo cadastrado para esta categoria.</p>";

        atualizarBotoes(datas);
        return;
    }

    const jogosDoDia = jogosDaCategoria.filter(
        jogo => jogo.data_jogo === diaAtual
    );

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
            jogo.placar1 !== null &&
            jogo.placar1 !== undefined &&
            jogo.placar2 !== null &&
            jogo.placar2 !== undefined;

        const modalidade = jogo.esporte || "Esporte";

        const horario = jogo.hora_jogo
            ? jogo.hora_jogo.slice(0, 5)
            : "Horário a definir";

        const time1 = (jogo.equipe1 || "A definir").trim();
        const time2 = (jogo.equipe2 || "A definir").trim();

        const placar = finalizado
            ? `${jogo.placar1} x ${jogo.placar2}`
            : "Jogo ainda não iniciado";

        const titulo = document.createElement("h2");
        titulo.textContent = `${time1} x ${time2}`;

        const resultado = document.createElement("h3");
        resultado.textContent = finalizado ? placar : "VS";

        const esporte = document.createElement("p");
        esporte.textContent = modalidade;

        const hora = document.createElement("p");
        hora.textContent = horario;

        const status = document.createElement("p");
        status.textContent = finalizado
            ? "Finalizado"
            : "Em breve";

        card.append(titulo, resultado, esporte, hora, status);
        container.appendChild(card);
    });

    atualizarBotoes(datas);
}

// Navegação entre os dias.
document.getElementById("dia-anterior").addEventListener("click", () => {
    const datas = obterDatas();
    const indiceAtual = datas.indexOf(diaAtual);

    if (indiceAtual > 0) {
        diaAtual = datas[indiceAtual - 1];
        mostrarJogos(datas);
    }
});

document.getElementById("proximo-dia").addEventListener("click", () => {
    const datas = obterDatas();
    const indiceAtual = datas.indexOf(diaAtual);

    if (indiceAtual < datas.length - 1) {
        diaAtual = datas[indiceAtual + 1];
        mostrarJogos(datas);
    }
});

// Alternância entre masculino e feminino.
document.getElementById("categoria-masculino")
    .addEventListener("click", () => {
        selecionarCategoria("Masculino");
    });

document.getElementById("categoria-feminino")
    .addEventListener("click", () => {
        selecionarCategoria("Feminino");
    });

carregarJogos();
