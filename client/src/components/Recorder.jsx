import React from 'react';
import io from 'socket.io-client';

const socket = io('https://localhost:8443')

const recordAudio = () =>
  new Promise(resolve => {
    navigator.mediaDevices.getUserMedia({ audio: true })
      .then(stream => {
        const mediaRecorder = new MediaRecorder(stream);
        const audioChunks = [];

        mediaRecorder.addEventListener("dataavailable", event => {
          audioChunks.push(event.data);
        })

        const start = () => {
          mediaRecorder.start();
        }

        const stop = () =>
          new Promise(resolve => {
            mediaRecorder.addEventListener("stop", () => {
              const audioBlob = new Blob(audioChunks);
              const audioUrl = URL.createObjectURL(audioBlob);
              const audio = new Audio(audioUrl);
              const play = () => {
                audio.play();
              };
              resolve({ audioBlob, audioUrl, play });
            });
            mediaRecorder.stop();
            audioChunks.pop();
          })

      resolve({ start, stop });
      })
  })

class Recorder extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      recorder: null,
      listen: null
    }
    this.start = this.start.bind(this);
    this.stop = this.stop.bind(this);
    this.play = this.play.bind(this);
    socket.on('listen', (audio) => {
      console.log('retrieving')
       this.setState({
         listen: audio
       })
    })
  }

  async start() {
      this.setState({
        recorder: await recordAudio()
      });
      this.state.recorder.start()
  }

  async stop() {
      console.log('stopping')
      const audio = await this.state.recorder.stop()
      console.log(audio)
      socket.emit('recording', audio)
  }

  play() {
    const audio = new Audio(this.state.listen.audioUrl)
    audio.play()
  }

  render() {
    return (
      <React.Fragment>
        <button onClick={this.start}>Record</button>
        <button id="stop" onClick={this.stop}>Stop</button>
        <button id="play" onClick={this.play}>Play</button>
      </React.Fragment>
    );
  }
}

export default Recorder;
