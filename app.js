const express = require('express');

const app = express();
const port = 3333;

const indexRouter = require('./routes/index');
const modalidadesRouter = require('./routes/modalidades');
const classificacaoRouter = require('./routes/classificacao');
const jogosRouter = require('./routes/jogos');
const estatisticasRouter = require('./routes/estatisticas');
const cursosRouter = require('./routes/cursos');

app.use(express.static('.'));

app.use('/', indexRouter);
app.use('/', modalidadesRouter);
app.use('/', classificacaoRouter);
app.use('/', jogosRouter);
app.use('/', estatisticasRouter);
app.use('/', cursosRouter);

app.listen(port, () => {
    console.log(`Servidor rodando em http://localhost:${port}`);
});