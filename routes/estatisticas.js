const express = require('express');

const router = express.Router();

router.get('/estatisticas', (req, res) => {
    res.sendFile('estatisticas.html', { root: '.' });
});

module.exports = router;