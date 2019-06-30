const express = require('express');

const app = express();

const server = require('http').Server(app);

const bodyParser = require('body-parser');
const path = require('path');

const PORT = process.env.PORT || 5000;

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

server.listen(PORT, () => {
  console.log('Example app listening at', server.address().port);
});

app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, '..', 'client', 'index.html'));
});
