const event = require('./eventHandlers.js');

module.exports = (server) => {
  const WebSocket = require('ws');
  const wss = new WebSocket.Server({ server });

  wss.on('connection', (ws) => {
    ws.on('message', inc = (message) => {
      let data;

      try {
        data = JSON.parse(message);
      } catch (e) {
        console.log('Invalid JSON');
        data = {};
      }

      event[data.type](ws, data);

    });
    ws.send('Message received');
  });
}
