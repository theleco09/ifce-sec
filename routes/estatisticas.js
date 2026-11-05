const express = require('express');
const router = express.Router();
const supabase = require('../supabase');

router.get('/estatisticas', async(req, res) => {
    const { data, error } = await supabase
        .from('Atleta')
        .select('nome, pontos, curso, esporte')
        .order('pontos', { ascending: false });

    if (error) {
        console.error('Erro ao buscar atletas:', error.message);
        return res.status(500).send('Erro ao carregar as estatísticas.');
    }

    let html = `
        <!DOCTYPE html>
        <html lang="pt-BR">
        <head>
            <meta charset="UTF-8">
            <meta name="viewport" content="width=device-width, initial-scale=1.0">
            <title>Estatísticas - SEC</title>
            <link rel="stylesheet" href="/style.css">
        </head>

        <body>

            <nav class="navbar">
                <div class="container">
                    <a class="navbar-brand" href="/">
                        Semana Esportiva e Cultural IFCE
                    </a>

                    <div class="navbar-nav">
                        <a class="nav-link" href="/cursos">Cursos</a>
                        <a class="nav-link" href="/modalidades">Modalidades</a>
                        <a class="nav-link active" href="/estatisticas">Estatísticas</a>
                        <a class="nav-link" href="/classificacao">Classificação</a>
                    </div>
                </div>
            </nav>

            <main class="estatisticas">

                <h1>Estatísticas dos Atletas</h1>

                <p class="subtitulo">
                    Confira o desempenho dos atletas na Semana Esportiva e Cultural.
                </p>
    `;

    const atletasPorEsporte = {};

    data.forEach(atleta => {
        if (!atletasPorEsporte[atleta.esporte]) {
            atletasPorEsporte[atleta.esporte] = [];
        }

        atletasPorEsporte[atleta.esporte].push(atleta);
    });

    for (const esporte in atletasPorEsporte) {

        html += `
            <section class="painel">
                <h2>🏆 ${esporte}</h2>
        `;

        atletasPorEsporte[esporte].forEach((atleta, index) => {

            html += `
                <div class="atleta">
                    <div>
                        <strong>${index + 1}º ${atleta.nome}</strong>
                        <p>${atleta.curso}</p>
                    </div>

                    <span class="pontos">
                        ${atleta.pontos} pontos
                    </span>
                </div>
            `;
        });

        html += `
            </section>
        `;
    }

    html += `
            </main>

            <footer>
                <p>SEC IFCE • Semana Esportiva e Cultural</p>
            </footer>

        </body>
        </html>
    `;

    res.send(html);
});

module.exports = router;