let diaAtual = 12;

const jogos = [{
        dia: 12,
        modalidade: "Basquete",
        icone: "🏀",
        horario: "14:00",
        local: "Ginásio",
        time1: "ELETRO",
        time2: "EDI",
        placar1: 52,
        placar2: 48,
        status: "Finalizado"
    },

    {
        dia: 12,
        modalidade: "Futsal",
        icone: "⚽",
        horario: "16:00",
        local: "Quadra CAEF",
        time1: "TELE",
        time2: "INFO",
        placar1: 12,
        placar2: 9,
        status: "finalizado"
    },

    {
        dia: 13,
        modalidade: "Vôlei",
        icone: "🏐",
        horario: "17:30",
        local: "Ginásio",
        time1: "ELETRO",
        time2: "EDI",
        placar1: null,
        placar2: null,
        status: "Em breve..."
    },
    {
        dia: 14,
        modalidade: "Basquete",
        icone: "🏀",
        horario: "15:00",
        local: "Ginásio",
        time1: "INFO",
        time2: "TELE",
        placar1: null,
        placar2: null,
        status: "Em breve..."
    }
];
const primeiroDia = Math.min(...jogos.map(jogo => jogo.dia));
const ultimoDia = Math.max(...jogos.map(jogo => jogo.dia));

function atualizarBotoes() {
    const botaoAnterior = document.getElementById("dia-anterior");
    const botaoProximo = document.getElementById("proximo-dia");
    botaoAnterior.disabled = diaAtual === primeiroDia;
    botaoProximo.disabled = diaAtual === ultimoDia;
}

function mostrarJogos() {

    const container = document.getElementById("jogos-do-dia");

    container.innerHTML = "";

    const jogosDoDia = jogos.filter(jogo => jogo.dia === diaAtual);


    jogosDoDia.forEach(jogo => {

        const card = document.createElement("div");

        card.classList.add("jogo");


        if (jogo.placar1 === null && jogo.placar2 === null) {

            card.innerHTML = `
                <h2>${jogo.time1} x ${jogo.time2}</h2>
                <h3>Jogo ainda não iniciado</h3>
                <p>${jogo.modalidade}</p>
                <p>${jogo.horario}</p>
                <p>${jogo.local}</p>
                <p>${jogo.status}</p>
            `;

        } else {

            card.innerHTML = `
                <h2>${jogo.time1} x ${jogo.time2}</h2>
                <h3>${jogo.placar1} x ${jogo.placar2}</h3>
                <p>${jogo.modalidade}</p>
                <p>${jogo.horario}</p>
                <p>${jogo.status}</p>
            `;
        }


        container.appendChild(card);

    });
    atualizarBotoes();
}


document.getElementById("dia-anterior").addEventListener("click", function() {

    diaAtual--;

    document.getElementById("data").textContent = diaAtual + "/10";

    mostrarJogos();

});


document.getElementById("proximo-dia").addEventListener("click", function() {

    diaAtual++;

    document.getElementById("data").textContent = diaAtual + "/10";

    mostrarJogos();

});


mostrarJogos();