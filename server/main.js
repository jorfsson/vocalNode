const bodyParser = require('body-parser');
const express = require('express');
const fs = require('fs');
const https = require('https');
const path = require('path');
const session = require('express-session');

const AWS = require('aws-sdk');
const S3 = new AWS.S3();

const port = process.env.PORT || 3000;

const app = express();
const server = require('http').Server(app);

app.use(bodyParser.urlencoded({ extended: false }))
app.use(bodyParser.json())
app.use(express.static(path.join(__dirname, '../client/dist/')));
app.use(require('helmet')());

const wss = require('./WebSocket/socket.js')(server);

server.listen(port, () => {
  console.log(`Server listening on port ${port}`);
});
