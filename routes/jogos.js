const express = require('express');
const router = express.Router();
const supabase = require('../supabase');


function escaparHTML(valor) {
    if (valor === null || valor === undefined) {
        valor = '';
    }

    return String(valor).replace(/[&<>"']/g, function(caractere) {
        const entidades = {
            '&': '&amp;',
            '<': '&lt;',
            '>': '&gt;',
            '"': '&quot;',
            "'": '&#39;'
        };

        return entidades[caractere];
    });
}

router.get('/api/jogos', async(req, res) => {
    try {
        const { data: jogos, error } = await supabase
            .from('Jogos')
            .select('*')
            .order('dia', { ascending: true })
            .order('hora', { ascending: true });

        if (error) {
            console.error('Erro ao buscar jogos:', error.message);
            return res.status(500).json({
                erro: 'Não foi possível carregar os jogos.'
            });
        }

        res.json(jogos);
    } catch (erro) {
        console.error('Erro na API de jogos:', erro);
        res.status(500).json({
            erro: 'Erro interno ao carregar os jogos.'
        });
    }
});
router.get('/jogos', async(req, res) => {
            console.log('ROTA NOVA DE JOGOS FOI EXECUTADA!');
            try {
                const { data: jogos, error } = await supabase
                    .from('Jogos')
                    .select('*')
                    .order('dia', { ascending: true })
                    .order('hora', { ascending: true });

                if (error) {
                    console.error('Erro ao buscar jogos:', error.message);
                    return res.status(500).send('Erro ao carregar os jogos da SEC.');
                }

                const cards = jogos.map(jogo => {
                    const esporte = escaparHTML(jogo.esporte);
                    const time1 = escaparHTML(jogo.time1).trim();
                    const time2 = escaparHTML(jogo.time2).trim();

                    const data = jogo.dia ?
                        jogo.dia.split('-').reverse().join('/') :
                        'Data a definir';

                    const hora = jogo.hora ?
                        jogo.hora.slice(0, 5) :
                        'Horário a definir';

                    const finalizado =
                        jogo.placarTime1 != null &&
                        jogo.placarTime2 != null;

                    const placar = finalizado ?
                        `${escaparHTML(jogo.placarTime1)} x ${escaparHTML(jogo.placarTime2)}` :
                        'VS';

                    return `
                <div class="col-md-6 col-lg-4">
                    <article class="card jogo h-100">
                        <div class="card-body">
                            <span class="badge bg-success mb-3">
                                ${esporte}
                            </span>

                            <p class="text-muted mb-3">
                                ${escaparHTML(data)} às ${escaparHTML(hora)}
                            </p>

                            <div class="equipes">
                                <span>${time1}</span>
                                <strong>${placar}</strong>
                                <span>${time2}</span>
                            </div>

                            <div class="mt-3">
                                <span class="badge ${
                                    finalizado
                                        ? 'bg-secondary'
                                        : 'bg-warning text-dark'
                                }">
                                    ${finalizado ? 'Finalizado' : 'Aguardando resultado'}
                                </span>
                            </div>
                        </div>
                    </article>
                </div>
            `;
                }).join('');

                res.send(`
            <!DOCTYPE html>
            <html lang="pt-BR">
            <head>
                <meta charset="UTF-8">
                <meta name="viewport" content="width=device-width, initial-scale=1.0">
                <title>Jogos | SEC IFCE</title>

                <link
                    href="https://cdn.jsdelivr.net/npm/bootstrap@5.0.2/dist/css/bootstrap.min.css"
                    rel="stylesheet"
                >

                <style>
                    body {
                        background: #f4f5f6;
                        color: #343a40;
                    }

                    .navbar-brand {
                        font-weight: 700;
                    }

                    .titulo {
                        font-weight: 700;
                        margin-top: 30px;
                    }

                    .jogo {
                        border: 1px solid #e3e7e5;
                        border-radius: 12px;
                        box-shadow: 0 4px 12px rgba(0, 0, 0, 0.05);
                    }

                    .equipes {
                        display: flex;
                        align-items: center;
                        justify-content: space-between;
                        gap: 10px;
                    }

                    .equipes span {
                        font-weight: 600;
                        overflow-wrap: anywhere;
                    }

                    .equipes strong {
                        white-space: nowrap;
                        color: #198754;
                        font-size: 1.15rem;
                    }
                </style>
            </head>

            <body>
                <nav class="navbar navbar-expand-lg navbar-dark bg-success">
                    <div class="container">
                        <a class="navbar-brand" href="/">
                            SEC IFCE
                        </a>

                        <div class="navbar-nav ms-auto">
                            <a class="nav-link" href="/cursos">Cursos</a>
                            <a class="nav-link" href="/modalidades">Modalidades</a>
                            <a class="nav-link active" href="/jogos">Jogos</a>
                            <a class="nav-link" href="/classificacao">Classificação</a>
                            <a class="nav-link" href="/estatisticas">Estatísticas</a>
                        </div>
                    </div>
                </nav>

                <main class="container pb-5">
                    <h1 class="titulo">Jogos da SEC</h1>
                    <p class="text-muted mb-4">
                        Confira as partidas e seus resultados.
                    </p>

                    <div class="row g-4">
                        ${cards || `
                            <div class="col-12">
                                <p>Nenhum jogo cadastrado ainda.</p>
                            </div>
                        `}
                    </div>

                    <a href="/" class="btn btn-success mt-4">
                        Voltar para o início
                    </a>
                </main>
            </body>
            </html>
        `);
    } catch (erro) {
        console.error('Erro inesperado ao carregar jogos:', erro);
        res.status(500).send('Ocorreu um erro ao carregar os jogos.');
    }
});

module.exports = router;