const express = require('express');

const router = express.Router();

router.get('/modalidades', (req, res) => {
    res.sendFile('modalidades.html', { root: '.' });
});

module.exports = router;