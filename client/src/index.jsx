import React from 'react';
import ReactDOM from 'react-dom';
import App from './components/App.jsx';

class Index extends React.Component{
  constructor(props) {
    super(props);
    this.state = {
    }
  }

  render() {
    return (
      <div><App /></div>
    )
  }
}

ReactDOM.render(<Index />, document.getElementById('app'));
