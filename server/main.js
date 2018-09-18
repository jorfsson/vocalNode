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

const options = {
    cert: fs.readFileSync(process.env.full),
    key: fs.readFileSync(process.env.priv)
};

const secure = https.createServer(options, app)
const io = require('socket.io').listen(secure);

const audioOptions = {
  Bucket: 'vocalNode'
}

app.use(express.static(path.join(__dirname, '../client/dist/')));

app.use(require('helmet')());

server.listen(port, () => {
  console.log(`Server listening on port ${port}`);
});

secure.listen(8443);

let messages = [];

io.sockets.on('connection', function (socket) {
  socket.emit('news', { hello: 'world' });
  socket.on('chat message', function (data) {
    console.log(data);
    messages.push(data)
    socket.emit('messages', messages)
  });

  socket.on('recording', audio => {
    console.log("recording: " + audio)
    socket.emit('listen', audio)
  })
});
