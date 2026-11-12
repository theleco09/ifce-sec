
const express = require('express');
const router = express.Router();
const supabase = require('../supabase');

router.get('/classificacao', async (req, res) => {
    const { data, error } = await supabase
        .from('sec_classificacao')
        .select('*')
        .order('pontos', { ascending: false })
        .order('vitorias', { ascending: false });

    if (error) {
        console.error('Erro ao buscar classificação:', error.message);
        return res.status(500).send('Erro ao carregar classificação.');
    }

    function gerarLinhas(categoria) {
        const cursos = data.filter(item => item.categoria === categoria);

        return cursos.map((item, index) => `
            <tr>
                <td>${index + 1}º</td>
                <td>${item.curso}</td>
                <td>${item.jogos}</td>
                <td>${item.vitorias}</td>
                <td>${item.empates}</td>
                <td>${item.derrotas}</td>
                <td><strong>${item.pontos}</strong></td>
            </tr>
        `).join('');
    }

    const linhasMasculino = gerarLinhas('Masculino');
    const linhasFeminino = gerarLinhas('Feminino');

    res.send(`
        <!DOCTYPE html>
        <html lang="pt-BR">

        <head>
            <meta charset="UTF-8">
            <meta name="viewport" content="width=device-width, initial-scale=1.0">

            <link rel="stylesheet" href="/css/style.css">

            <link
                href="https://cdn.jsdelivr.net/npm/bootstrap@5.0.2/dist/css/bootstrap.min.css"
                rel="stylesheet"
                crossorigin="anonymous"
            >

            <title>Classificação - SEC</title>
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
                                <a class="nav-link" href="/estatisticas">Estatísticas</a>
                            </li>

                            <li class="nav-item">
                                <a class="nav-link" href="/classificacao">Classificação</a>
                            </li>
                        </ul>
                    </div>
                </nav>

                <div class="bg-success text-black text-center p-5">
                    <h1>Classificação</h1>
                    <h3>Classificação Geral</h3>
                </div>

                <div class="container mt-5">
                    <h2 class="text-center mb-4">🏆 Classificação dos Cursos</h2>

                    <p class="text-center">
                        Acompanhe a pontuação dos cursos em todas as modalidades
                        da Semana Esportiva e Cultural.
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

                    <div class="table-responsive mt-4">
                        <table class="table table-bordered table-striped text-center">
                            <thead class="table-dark">
                                <tr>
                                    <th>Posição</th>
                                    <th>Curso</th>
                                    <th>Jogos</th>
                                    <th>Vitórias</th>
                                    <th>Empates</th>
                                    <th>Derrotas</th>
                                    <th>Pontos</th>
                                </tr>
                            </thead>

                            <tbody id="tabelaClassificacao">
                                ${linhasMasculino}
                            </tbody>
                        </table>
                    </div>

                    <div class="text-center mt-4 mb-5">
                        <a href="/" class="btn btn-secondary">
                            Voltar ao início
                        </a>
                    </div>
                </div>
            </main>

            <script>
                const linhasMasculino = ${JSON.stringify(linhasMasculino)};
                const linhasFeminino = ${JSON.stringify(linhasFeminino)};

                function mostrarCategoria(categoria) {
                    const tabela = document.getElementById('tabelaClassificacao');
                    const btnMasculino = document.getElementById('btnMasculino');
                    const btnFeminino = document.getElementById('btnFeminino');

                    tabela.innerHTML = categoria === 'Masculino'
                        ? linhasMasculino
                        : linhasFeminino;

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
    `);
});

module.exports = router;
