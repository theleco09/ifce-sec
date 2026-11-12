
let diaAtual = null;
let jogos = [];
let categoriaAtual = "Masculino";
let esporteAtual = "Todos";

const container = document.getElementById("jogos-do-dia");
const elementoData = document.getElementById("data");
const botaoMasculino = document.getElementById("categoria-masculino");
const botaoFeminino = document.getElementById("categoria-feminino");

// Cria o seletor de esportes automaticamente.
const areaEsporte = document.createElement("div");
areaEsporte.classList.add("seletor-esporte");

const labelEsporte = document.createElement("label");
labelEsporte.textContent = "Esporte: ";
labelEsporte.htmlFor = "filtro-esporte";

const seletorEsporte = document.createElement("select");
seletorEsporte.id = "filtro-esporte";

areaEsporte.append(labelEsporte, seletorEsporte);

// Coloca o seletor antes dos cards de jogos.
container.parentNode.insertBefore(areaEsporte, container);

async function carregarJogos() {
    try {
        const resposta = await fetch("/api/jogos");

        if (!resposta.ok) {
            throw new Error("Não foi possível buscar os jogos.");
        }

        jogos = await resposta.json();

        // Descobre os esportes cadastrados.
        const esportes = [...new Set(
            jogos
                .map(jogo => jogo.esporte)
                .filter(Boolean)
        )].sort();

        // Cria as opções do seletor.
        seletorEsporte.innerHTML = "";

        const opcaoTodos = document.createElement("option");
        opcaoTodos.value = "Todos";
        opcaoTodos.textContent = "Todos os esportes";
        seletorEsporte.appendChild(opcaoTodos);

        esportes.forEach(esporte => {
            const opcao = document.createElement("option");
            opcao.value = esporte;
            opcao.textContent = esporte;
            seletorEsporte.appendChild(opcao);
        });

        atualizarTela();
    } catch (erro) {
        console.error("Erro ao carregar jogos:", erro);
        container.innerHTML =
            "<p>Não foi possível carregar os jogos. Tente atualizar a página.</p>";
    }
}

// Retorna os jogos de acordo com os filtros selecionados.
function filtrarJogos() {
    return jogos.filter(jogo => {
        const mesmaCategoria =
            (jogo.categoria || "").toLowerCase() ===
            categoriaAtual.toLowerCase();

        const mesmoEsporte =
            esporteAtual === "Todos" ||
            jogo.esporte === esporteAtual;

        return mesmaCategoria && mesmoEsporte;
    });
}

// Atualiza a data e os jogos quando algum filtro muda.
function atualizarTela() {
    const jogosFiltrados = filtrarJogos();

    const datas = [...new Set(
        jogosFiltrados
            .map(jogo => jogo.data_jogo)
            .filter(Boolean)
            .sort()
    )];

    if (datas.length === 0) {
        diaAtual = null;
        elementoData.textContent = "--/--";
        container.innerHTML = "<p>Não há jogos para esta seleção.</p>";
        atualizarBotoes(datas);
        return;
    }

    // Mantém a data atual se ela ainda tiver jogos.
    // Caso contrário, começa pela primeira data disponível.
    if (!datas.includes(diaAtual)) {
        diaAtual = datas[0];
    }

    mostrarJogos(datas);
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
    container.innerHTML = "";

    const jogosDoDia = filtrarJogos().filter(
        jogo => jogo.data_jogo === diaAtual
    );

    const [, mes, dia] = diaAtual.split("-");
    elementoData.textContent = `${dia}/${mes}`;

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
        status.textContent = finalizado ? "Finalizado" : "Em breve";

        card.append(titulo, resultado, esporte, hora, status);
        container.appendChild(card);
    });

    atualizarBotoes(datas);
}

// Seleção Masculino/Feminino.
function selecionarCategoria(categoria) {
    categoriaAtual = categoria;

    botaoMasculino.classList.toggle(
        "categoria-ativa",
        categoria === "Masculino"
    );

    botaoFeminino.classList.toggle(
        "categoria-ativa",
        categoria === "Feminino"
    );

    atualizarTela();
}

botaoMasculino.addEventListener("click", () => {
    selecionarCategoria("Masculino");
});

botaoFeminino.addEventListener("click", () => {
    selecionarCategoria("Feminino");
});

// Seleção do esporte.
seletorEsporte.addEventListener("change", () => {
    esporteAtual = seletorEsporte.value;
    atualizarTela();
});

// Navegação entre datas.
document.getElementById("dia-anterior").addEventListener("click", () => {
    const datas = [...new Set(
        filtrarJogos()
            .map(jogo => jogo.data_jogo)
            .filter(Boolean)
            .sort()
    )];

    const indiceAtual = datas.indexOf(diaAtual);

    if (indiceAtual > 0) {
        diaAtual = datas[indiceAtual - 1];
        mostrarJogos(datas);
    }
});

document.getElementById("proximo-dia").addEventListener("click", () => {
    const datas = [...new Set(
        filtrarJogos()
            .map(jogo => jogo.data_jogo)
            .filter(Boolean)
            .sort()
    )];

    const indiceAtual = datas.indexOf(diaAtual);

    if (indiceAtual < datas.length - 1) {
        diaAtual = datas[indiceAtual + 1];
        mostrarJogos(datas);
    }
});

carregarJogos();
