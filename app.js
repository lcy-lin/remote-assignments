const express = require('express')
const mysql = require('mysql2');
const bodyParser = require('body-parser');
require('dotenv').config();

const app = express()
const port = 3000
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.json());
const routes = require('./routes/users');
app.use(routes);
app.set('view engine', 'pug');


app.get('/healthcheck', (req, res) => {
  res.send('OK');
})

app.listen(port, () => {
  console.log(`Server is listening on port ${port}`)
})