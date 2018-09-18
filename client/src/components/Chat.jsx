import React from 'react';
import io from 'socket.io-client';

const socket = io('https://178.128.15.133:8443')

class Chat extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      messages: [" "]
    }
    this.handleSubmit = this.handleSubmit.bind(this)
    socket.on('messages', (data)=>{
      this.setState({
        messages: data
      })
    })
  }

  handleSubmit(e){
    e.preventDefault();
    socket.emit('chat message', e.target.message.value)
  }

  render() {
    return (
      <React.Fragment>
       <ul>
         {this.state.messages.map((message, index) =>
           <li key={ index }>{message}</li>
         )}
       </ul>
       <form onSubmit={this.handleSubmit}>
         <input type="text" name="message"></input>
         <input type="submit" value="Submit"></input>
       </form>
     </React.Fragment>
    );
  }
}
export default Chat;
