import React from 'react';
import Chat from './Chat.jsx';
import Recorder from './Recorder.jsx';

const socket = new WebSocket("ws://localhost:3000");

socket.onopen = () => {
  socket.send(JSON.stringify({ type: 'login', name: 'jonson' }));
}

class App extends React.Component {
   render() {
      return (
         <div>
            <Chat />
            <Recorder />
         </div>
      );
   }
}
export default App;
