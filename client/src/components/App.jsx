import React from 'react';
import Chat from './Chat.jsx';
import Recorder from './Recorder.jsx';

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
