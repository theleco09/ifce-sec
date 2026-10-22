const express = require('express');
const router = express.Router();

// Página de jogos da SEC
router.get('/jogos', (req, res) => {
    res.send('Página de jogos da SEC');
});

module.exports = router;