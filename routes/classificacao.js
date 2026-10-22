const express = require('express');
const router = express.Router();
const supabase = require('../supabase');

router.get('/classificacao', async(req, res) => {
            const { data, error } = await supabase
                .from('Basquete')
                .select('*')
                .order('pontos', { ascending: false });

            if (error) {
                console.error('Erro ao buscar classificação:', error.message);
                return res.status(500).send('Erro ao carregar a classificação.');
            }

            const linhas = data.map((item, index) => `
        <tr>
            <td>
                <span class="posicao ${index < 3 ? 'destaque' : ''}">
                    ${index + 1}º
                </span>
            </td>
            <td class="curso">${item.curso}</td>
            <td>
                <span class="pontos">${item.pontos}</span>
            </td>
        </tr>
    `).join('');

            res.send(`
        <!DOCTYPE html>
        <html lang="pt-BR">
        <head>
            <meta charset="UTF-8">
            <meta name="viewport" content="width=device-width, initial-scale=1.0">

            <title>Classificação | SEC IFCE</title>

            <link
                href="https://cdn.jsdelivr.net/npm/bootstrap@5.0.2/dist/css/bootstrap.min.css"
                rel="stylesheet"
                integrity="sha384-EVSTQN3/azprG1Anm3QDgpJLIm9Nao0Yz1ztcQTwFspd3yD65VohhpuuCOmLASjC"
                crossorigin="anonymous"
            >

            <style>
                body {
                    background-color: #f4f5f6;
                    color: #343a40;
                }

                .navbar-brand {
                    font-weight: 600;
                }

                .titulo {
                    margin: 25px 0 10px;
                    font-weight: 700;
                }

                .subtitulo {
                    color: #6c757d;
                    margin-bottom: 30px;
                }

                .botao-inicio {
                    margin-top: 25px;
                    border-radius: 8px;
                    padding: 9px 15px;
                    font-weight: 600;
                }

                .painel {
                    background: #fff;
                    border-radius: 12px;
                    padding: 25px;
                    box-shadow: 0 4px 15px rgba(0, 0, 0, 0.06);
                    border: 1px solid #e9ecef;
                }

                .cabecalho-tabela {
                    display: flex;
                    justify-content: space-between;
                    align-items: center;
                    flex-wrap: wrap;
                    gap: 10px;
                    margin-bottom: 20px;
                }

                .cabecalho-tabela h2 {
                    font-size: 1.25rem;
                    font-weight: 700;
                    margin: 0;
                }

                .badge-modalidade {
                    background: #d1e7dd;
                    color: #146c43;
                    border-radius: 20px;
                    padding: 7px 12px;
                    font-size: 0.85rem;
                }

                .table thead th {
                    color: #6c757d;
                    font-size: 0.85rem;
                    text-transform: uppercase;
                    border-bottom-width: 2px;
                }

                .table td,
                .table th {
                    padding: 16px;
                    vertical-align: middle;
                }

                .posicao {
                    display: inline-block;
                    min-width: 42px;
                    text-align: center;
                    padding: 7px 9px;
                    border-radius: 8px;
                    background: #f1f3f5;
                    font-weight: 700;
                }

                .posicao.destaque {
                    background: #d1e7dd;
                    color: #146c43;
                }

                .curso {
                    font-weight: 600;
                    text-transform: capitalize;
                }

                .pontos {
                    display: inline-block;
                    background: #d1e7dd;
                    color: #146c43;
                    border-radius: 8px;
                    padding: 7px 12px;
                    font-weight: 700;
                }

                .mensagem-vazia {
                    text-align: center;
                    color: #6c757d;
                    padding: 30px !important;
                }

                footer {
                    text-align: center;
                    color: #6c757d;
                    font-size: 0.9rem;
                    margin: 30px 0 20px;
                }

                @media (max-width: 576px) {
                    .titulo {
                        margin-top: 20px;
                    }

                    .painel {
                        padding: 15px;
                    }

                    .table td,
                    .table th {
                        padding: 12px 9px;
                    }
                }
            </style>
        </head>

        <body>
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
                            <a class="nav-link active" href="/classificacao">
                                Classificação
                            </a>
                        </li>
                    </ul>
                </div>
            </nav>

            <main class="container">
                <a href="/" class="btn btn-success botao-inicio">
                    ← Voltar para o início
                </a>

                <h1 class="titulo">Classificação</h1>

                <p class="subtitulo">
                    Confira a pontuação dos cursos na Semana Esportiva e Cultural.
                </p>

                <section class="painel">
                    <div class="cabecalho-tabela">
                        <h2>Quadro de pontuação</h2>

                        <span class="badge-modalidade">
                            🏀 Basquete
                        </span>
                    </div>

                    <div class="table-responsive">
                        <table class="table table-hover mb-0">
                            <thead>
                                <tr>
                                    <th>Posição</th>
                                    <th>Curso</th>
                                    <th>Pontos</th>
                                </tr>
                            </thead>

                            <tbody>
                                ${linhas || `
                                    <tr>
                                        <td colspan="3" class="mensagem-vazia">
                                            Nenhuma pontuação cadastrada ainda.
                                        </td>
                                    </tr>
                                `}
                            </tbody>
                        </table>
                    </div>
                </section>

                <footer>
                    SEC IFCE • Semana Esportiva e Cultural
                </footer>
            </main>
        </body>
        </html>
    `);
});

module.exports = router;