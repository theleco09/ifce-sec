
const express = require('express');
const router = express.Router();
const supabase = require('../supabase');

router.get('/estatisticas', async (req, res) => {
    const { data, error } = await supabase
        .from('sec_ranking_atletas')
        .select('*')
        .order('total_pontos', { ascending: false });

    if (error) {
        console.error('Erro ao buscar atletas:', error.message);
        return res.status(500).send('Erro ao carregar as estatísticas.');
    }

    function gerarRanking(sexo) {
        const atletas = data.filter(atleta => atleta.sexo === sexo);

        const atletasPorEsporte = {};

        atletas.forEach(atleta => {
            if (!atletasPorEsporte[atleta.esporte]) {
                atletasPorEsporte[atleta.esporte] = [];
            }

            atletasPorEsporte[atleta.esporte].push(atleta);
        });

        let html = '';

        for (const esporte in atletasPorEsporte) {
            html += `
                <section class="painel">
                    <h2>🏆 ${esporte}</h2>
            `;

            atletasPorEsporte[esporte].forEach((atleta, index) => {
                html += `
                    <div class="atleta">
                        <div>
                            <strong>${index + 1}º ${atleta.atleta}</strong>
                            <p>${atleta.curso}</p>
                        </div>

                        <span class="pontos">
                            ${atleta.total_pontos} pontos
                        </span>
                    </div>
                `;
            });

            html += '</section>';
        }

        return html || '<p class="text-center">Nenhum atleta encontrado nesta categoria.</p>';
    }

    const rankingMasculino = gerarRanking('Masculino');
    const rankingFeminino = gerarRanking('Feminino');

    const html = `
        <!DOCTYPE html>
        <html lang="pt-BR">

        <head>
            <meta charset="UTF-8">
            <meta name="viewport" content="width=device-width, initial-scale=1.0">

            <link rel="stylesheet" href="/css/style.css">

            <link
                href="https://cdn.jsdelivr.net/npm/bootstrap@5.0.2/dist/css/bootstrap.min.css"
                rel="stylesheet"
            >

            <title>Estatísticas - SEC</title>
        </head>

        <body>
            <main>

                <nav class="navbar navbar-light bg-secondary navbar-expand-lg">
                    <div class="container">
                        <a class="navbar-brand" href="/">
                            Semana Esportiva e Cultural IFCE
                        </a>

                        <ul class="navbar-nav ms-auto">
                            <li class="nav-item">
                                <a class="nav-link" href="/cursos">Cursos</a>
                            </li>

                            <li class="nav-item">
                                <a class="nav-link" href="/modalidades">Modalidades</a>
                            </li>

                            <li class="nav-item">
                                <a class="nav-link active" href="/estatisticas">Estatísticas</a>
                            </li>

                            <li class="nav-item">
                                <a class="nav-link" href="/classificacao">Classificação</a>
                            </li>
                        </ul>
                    </div>
                </nav>

                <div class="bg-success text-black text-center p-5">
                    <h1>Estatísticas</h1>
                    <h3>Estatísticas dos Atletas</h3>
                </div>

                <section class="estatisticas">

                    <h1>🏆 Ranking dos Atletas</h1>

                    <p class="subtitulo">
                        Confira o desempenho dos atletas na Semana Esportiva e Cultural.
                    </p>

                    <div class="seletor-categoria">
                        <button
                            id="btnMasculino"
                            class="categoria-ativa"
                            onclick="mostrarCategoria('Masculino')"
                        >
                            Masculino
                        </button>

                        <button
                            id="btnFeminino"
                            onclick="mostrarCategoria('Feminino')"
                        >
                            Feminino
                        </button>
                    </div>

                    <div id="rankingMasculino">
                        ${rankingMasculino}
                    </div>

                    <div id="rankingFeminino" style="display: none;">
                        ${rankingFeminino}
                    </div>

                </section>

                <div class="text-center mt-4 mb-5">
                    <a href="/" class="btn btn-secondary">
                        Voltar ao início
                    </a>
                </div>

                <footer>
                    <p>SEC IFCE • Semana Esportiva e Cultural</p>
                </footer>

            </main>

            <script>
                function mostrarCategoria(categoria) {
                    const masculino = document.getElementById('rankingMasculino');
                    const feminino = document.getElementById('rankingFeminino');

                    const btnMasculino = document.getElementById('btnMasculino');
                    const btnFeminino = document.getElementById('btnFeminino');

                    masculino.style.display =
                        categoria === 'Masculino' ? 'block' : 'none';

                    feminino.style.display =
                        categoria === 'Feminino' ? 'block' : 'none';

                    btnMasculino.classList.toggle(
                        'categoria-ativa',
                        categoria === 'Masculino'
                    );

                    btnFeminino.classList.toggle(
                        'categoria-ativa',
                        categoria === 'Feminino'
                    );
                }
            </script>

        </body>
        </html>
    `;

    res.send(html);
});

module.exports = router;
    