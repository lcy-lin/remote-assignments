import express from 'express';
import bodyParser from 'body-parser';
import cors from 'cors';
import config from './src/config.js';
import routes from './routes/users/index.js';

const app = express()
const port = 3000

app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.json());
app.use(cors());
app.use(express.static('static'));
app.use(routes);
app.set('view engine', 'pug');

app.get('/healthcheck', (req, res) => {
  res.send('OK');
})

app.listen(port, () => {
  console.log(`Server is listening on port ${port}`)
})