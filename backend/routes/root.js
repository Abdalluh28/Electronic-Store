const express = require('express');
const router = express.Router();
const path = require('path');

router.get('/', (req, res) => {
    res.sendFile(path.resolve(__dirname, '../views/one.html'));
})




module.exports = router