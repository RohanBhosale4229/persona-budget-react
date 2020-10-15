const express = require('express');
const cors = require('cors');
const app = express();
const port = 3000;

app.use(cors());

const fs= require('fs');
let a=fs.readFileSync('./budget.json');
let b = JSON.parse(a);

app.get('/budget', (req, res) => {
    res.json(b); 
});

app.listen(port, () => {
    console.log(`API served at http://localhost:${port}`)
});
