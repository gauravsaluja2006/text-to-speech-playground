import React, { Component } from "react";
import "./voice-listing.component.scss";
import {
  Stack,
  TextField,
  PrimaryButton,
  Checkbox,
  Slider,
} from "office-ui-fabric-react";

speechSynthesis.getVoices().forEach(function (voice) {
  console.log(voice.name, voice.default ? voice.default : "");
});

export class VoicesListingComponent extends Component {
  state = {
    voices: [],
    textToSpeak: "that was really good",
    selectedVoiceIndex: 0,
    selectedVoice: null,
    volume: 1,
    isIntervalRunning: false,
    rate: 1,
    pitch: 1,
    intervalId: 0,
  };

  componentDidMount() {
    getVoicesPromise().then((voices: any) => {
      this.setState({ voices, selectedVoice: voices[0] });
    });
  }

  setSelectedVoice(voice: any, index: number) {
    this.setState({
      selectedVoice: voice,
      selectedVoiceIndex: index,
    });
    if(!this.state.isIntervalRunning) {
        this.speak();
    }
  }

  speak() {
    var msg = new SpeechSynthesisUtterance();
    msg.text = this.state.textToSpeak;
    msg.voice = this.state.voices[this.state.selectedVoiceIndex];
    msg.volume = this.state.volume; // From 0 to 1
    msg.rate = this.state.rate; // From 0.1 to 10
    msg.pitch = this.state.pitch; // From 0 to 2
    window.speechSynthesis.speak(msg);
  }

  onVolumeSliderChange = (val: any) => {
    this.setState({
      volume: val,
    });
  };

  onRateSliderChange = (val: any) => {
    this.setState({
      rate: val,
    });
  };

  onPitchSliderChange = (val: any) => {
    this.setState({
      pitch: val,
    });
  };

  onKeepPlayingChanged = (e: any) => {
    if (e.target.checked) {
      let intervalId = setInterval(() => {
        this.speak();
      }, 3000);
      this.setState({
        intervalId,
        isIntervalRunning: true
      });
    } else {
      clearInterval(this.state.intervalId);
      this.setState({
        isIntervalRunning: false
      });
    }
  };

  render() {
    return (
      <Stack horizontal>
        <Stack.Item grow={1}>
          <div id="PlaygroundScreen">
            <TextField
              label="Enter your text here"
              value={this.state.textToSpeak}
              onChange={(e) =>
                this.setState({
                  textToSpeak: (e.target as HTMLInputElement).value,
                })
              }
            />
            <br />
            <PrimaryButton
              text="Speak"
              onClick={() => this.speak()}
              allowDisabledFocus
            />
            <br />
            <br />
            <Checkbox
              label="Keep playing"
              onChange={this.onKeepPlayingChanged}
            />

            <br />
            <br />

            <Slider
              label="Volume"
              min={0}
              max={1}
              step={0.1}
              showValue
              value={this.state.volume}
              onChange={this.onVolumeSliderChange}
            />

            <br />

            <Slider
              label="Rate"
              min={0.1}
              max={3}
              step={0.1}
              showValue
              value={this.state.rate}
              onChange={this.onRateSliderChange}
            />

            <br />

            <Slider
              label="Pitch"
              min={0}
              max={2}
              step={0.1}
              showValue
              value={this.state.pitch}
              onChange={this.onPitchSliderChange}
            />
          </div>
        </Stack.Item>
        <Stack.Item grow={1} className="synth-voices">
          {this.state.voices.map((voice: any, index: number) => (
            <div
              className={
                this.state.selectedVoiceIndex === index
                  ? "synth-voice selected"
                  : "synth-voice"
              }
              key={voice.name}
            >
              <div
                onClick={() => {
                  this.setSelectedVoice(voice, index);
                }}
              >
                {(voice as any).name}
                {this.state.selectedVoiceIndex === index && (
                  <span className="checkmark"> ✔</span>
                )}
              </div>
            </div>
          ))}
        </Stack.Item>
      </Stack>
    );
  }
}

function getVoicesPromise() {
  return new Promise(function (resolve) {
    const synth = window.speechSynthesis;
    const id = setInterval(() => {
      if (synth.getVoices().length !== 0) {
        resolve(synth.getVoices());
        clearInterval(id);
      }
    }, 10);
  });
}
