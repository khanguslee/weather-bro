const express = require('express');

const app = express();

const server = require('http').Server(app);

const bodyParser = require('body-parser');
const path = require('path');

const PORT = process.env.PORT || 5000;

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(express.static(path.join(__dirname, '..', '/client')));

// eslint-disable-next-line import/no-dynamic-require
const sockets = require(path.join(__dirname, 'js', 'sockets.js'));
sockets.init(server);

server.listen(PORT, () => {
  console.log('Example app listening at', server.address().port);
});

app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, '..', 'client', 'index.html'));
});
