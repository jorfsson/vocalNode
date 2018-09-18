const express = require('express');
const bodyParser = require('body-parser');
const path = require('path');
const bcrypt = require('bcrypt');
const fs = require('fs');
const https = require('https');

const AWS = require('aws-sdk');
const S3 = new AWS.S3();

const session = require('express-session');

const port = process.env.PORT || 3000;
const app = express();

const server = require('http').Server(app);
const io = require('socket.io')(server);

const options = {
    cert: process.env.full,
    key: process.env.priv
};

app.use(express.static(path.join(__dirname, '../client/dist/')));

app.use(require('helmet')());

server.listen(port, () => {
  console.log(`Server listening on port ${port}`);
});

https.createServer(options, server).listen(8443);

let messages = [];

io.on('connection', function (socket) {
  socket.emit('news', { hello: 'world' });
  socket.on('chat message', function (data) {
    console.log(data);
    messages.push(data)
    socket.emit('messages', messages)
  });

  socket.on('recording', audio => {
    socket.emit('listen', audio)
  })
});
