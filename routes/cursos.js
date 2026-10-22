const express = require('express');

const router = express.Router();

router.get('/cursos', (req, res) => {
    res.sendFile('cursos.html', { root: '.' });
});

module.exports = router;