import React, { Component } from 'react';
import logo from './logo.svg';
import Game from './Game.js';
import MainMenu from './MainMenu.js'

import './App.css';

class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
      isMainMenu: false,
      isOpenSetting: false,
      isOpenBugReport: false,
      isOpenModalAbout: false,
      isBugSubmitted: false,
      language: "English",
      dropSpeed: 100,
      version: "alpha",
    };
  }

  handleClickPlay() {
    this.setState({
      isMainMenu: false,
      isOpenSetting: false,
    });
  }

  handleClickInstructions() {
    this.setState({
      isOpenSetting: false,
      isOpenModalAbout: true,
    });
  }

  handleChangeDropSpeed(e) {
    this.setState({
      dropSpeed: e.target.value,
    });
  }

  handleClickSettings() {
   this.setState({
      isOpenSetting: !this.state.isOpenSetting,
      isOpenBugReport: false,
      isBugSubmitted: false,
    }); 
  }

  handleClickFindBug(e) {
   this.setState({
      isOpenBugReport: !this.state.isOpenBugReport,
      isOpenSetting: false,
      isBugSubmitted: false,
    });  
  }

  handleClickSubmitBug(e) {
    this.setState({
      isBugSubmitted: true,
    });  
  }

  handleChangeLanguage(e) {
    this.setState({
      language: e.target.value,
    });
  }

  render() {
    let texts;
    switch(this.state.language) {
      case "English":
        texts = englishTexts;
        break;
      case "Bahasa":
        texts = bahasaTexts;
        break;
    }
    return (
      <div className="App">
        {(this.state.isMainMenu ?
          <MainMenu
            version={this.state.version}
            texts={texts}
            language={this.state.language} 
            dropSpeed={this.state.dropSpeed}
            isOpenSetting={this.state.isOpenSetting}
            onClickPlay={() => this.handleClickPlay()}
            onClickInstructions={() => this.handleClickInstructions()}
            onClickSettings={() => this.handleClickSettings()}
            onChangeLanguage={(e) => this.handleChangeLanguage(e)}
            onChangeDropSpeed={(e) => this.handleChangeDropSpeed(e)}
          /> :
          <Game
            texts={texts}
            language={this.state.language} 
            dropSpeed={this.state.dropSpeed}
            isOpenSetting={this.state.isOpenSetting}
            isOpenBugReport={this.state.isOpenBugReport}
            isBugSubmitted={this.state.isBugSubmitted}
            onClickSettings={() => this.handleClickSettings()}
            onChangeLanguage={(e) => this.handleChangeLanguage(e)}
            onChangeDropSpeed={(e) => this.handleChangeDropSpeed(e)} 
            onClickFindBug={(e) => this.handleClickFindBug(e)}
            onClickSubmitBug={(e) => this.handleClickSubmitBug(e)}
          />
        )}
      </div>
    );
  }
}

const englishTexts = {
  "play": "PLAY",
  "playNow": "Play now!",
  "instructions": "How to play?",
  "settings": "Settings",
  "language": "Language",
  "dropSpeed": "Animation Speed",
  "normal": "Normal",
  "fast": "Fast",
  "superFast": "Super Fast",
  "english": "English",
  "bahasa": "Bahasa",
  "about": "About",
  "findBug": "Find a bug?",
  "bugReport": "Bug Report",
  "bugDescription": "Bug Description",
  "submit": "Submit",
  "bugSubmitted": "Bug submitted! Thank you!",

  "gameHeader": "PLAY CONGKLAK",
  "yourTurn": "Your Turn",
  "opponentTurn": "Opponent's Turn",
}

const bahasaTexts = {
  "play": "MAIN",
  "playNow": "Mulai permainan!",
  "instructions": "Bagaimana cara bermain?",
  "settings": "Pengaturan",
  "language": "Bahasa",
  "dropSpeed": "Kecepatan Animasi",
  "normal": "Normal",
  "fast": "Cepat",
  "superFast": "Sangat Cepat",
  "english": "Bahasa Inggris",
  "bahasa": "Bahasa Indonesia",
  "about": "Tentang",
  "findBug": "Anda menemukan bug?",
  "bugReport": "Lapor Bug",
  "bugDescription": "Deskripsi Bug",
  "submit": "Submit",
  "bugSubmitted": "Bug sudah diterima! Terima kasih!",

  "gameHeader": "MAIN CONGKLAK",
  "yourTurn": "Giliran Anda",
  "opponentTurn": "Giliran Lawan",
}

export default App;