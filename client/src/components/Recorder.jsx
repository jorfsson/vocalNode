import React from 'react';
import io from 'socket.io-client';

const socket = io('http://localhost:3000');

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
              resolve({ audioBlob });
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
      console.log('retrieving ' + audio)
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

      const audio = await this.state.recorder.stop()
      // const audioUrl = URL.createObjectURL(audio.audioBlob);
      // const audio2 = new Audio(audioUrl)
      let reader = new FileReader();

      let audioBuffer;

      reader.onload = (e) =>
        new Promise (resolve => {
          audioBuffer = e.target.result
          resolve(audioBuffer)
        })
      function bufferAudio(){}
      reader.readAsArrayBuffer(audio.audioBlob)
      socket.emit('recording', audioBuffer)


  }

  play() {
    const audioBlob = new Blob(this.state.listen)
    const audioUrl = window.URL.createObjectURL(this.state.listen);
    const audio = new Audio(audioUrl)
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
