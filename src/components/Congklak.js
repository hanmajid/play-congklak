import React, { Component } from 'react';
import logo from './logo.svg';
import Game from './Game.js';
import MainMenu from './MainMenu.js'

import './Congklak.css';

class Congklak extends Component {
  constructor(props) {
    super(props);
    this.state = {
      isMainMenu: true,
      isOpenSetting: false,
      isOpenBugReport: false,
      isOpenModalAbout: false,
      isBugSubmitted: false,
      language: "English",
      dropSpeed: 100,
      version: "1.0a",
      bugReportDesc: "",
    };
  }

  handleClickPlay() {
    this.setState({
      isMainMenu: false,
      isOpenSetting: false,
    });
  }

  handleClickInstructions() {
    let win = window.open("https://www.wikihow.com/Play-Congkak", "_blank");
    win.focus();
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

  handleChangeBugReportDesc(e) {
    this.setState({
      bugReportDesc: e.target.value
    });
  }

  handleClickSubmitBug(e) {
    var details = {
        'description': this.state.bugReportDesc,
    };

    var formBody = [];
    for (var property in details) {
      var encodedKey = encodeURIComponent(property);
      var encodedValue = encodeURIComponent(details[property]);
      formBody.push(encodedKey + "=" + encodedValue);
    }
    formBody = formBody.join("&");

    fetch('https://hanmajid.com/api/play-congklak/bug-report', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded;charset=UTF-8'
      },
      body: formBody
    });

    this.setState({
      isBugSubmitted: true,
      bugReportDesc: ""
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
        {
          <div></div>
        }
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
            bugReportDesc={this.state.bugReportDesc}
            isOpenSetting={this.state.isOpenSetting}
            isOpenBugReport={this.state.isOpenBugReport}
            isBugSubmitted={this.state.isBugSubmitted}
            onClickSettings={() => this.handleClickSettings()}
            onChangeLanguage={(e) => this.handleChangeLanguage(e)}
            onChangeDropSpeed={(e) => this.handleChangeDropSpeed(e)} 
            onClickFindBug={(e) => this.handleClickFindBug(e)}
            onClickSubmitBug={(e) => this.handleClickSubmitBug(e)}
            onChangeBugReportDesc={(e) => this.handleChangeBugReportDesc(e)}
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

  "youCantSelectStorehouse": "You can't select a storehouse",
  "youCantSelectOpponentHouse": "You can't select your opponent's houses",
  "youCantSelectEmptyHouse": "You can't select an empty house",
  "youWin": "You win! Thanks for playing!",
  "youLose": "You lose! Thanks for playing!",
  "itsDraw": "It's a draw! Thanks for playing!",
  "youGetAnotherTurn": "You get another turn",
  "youCantMove": "You can't move. It's your opponent's turn again",
  "opponentGetAnotherTurn": "Your opponent get another turn",
  "opponentCantMove": "Your opponent can't move. Your turn again",
  "youTakeBeans": "You take the opposing house's beans",
  "opponentTakeBeans": "Your opponent take the opposing house's beans",
  "welcome": "Let's play!",
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

  "youCantSelectStorehouse": "Anda tidak bisa memilih 'rumah besar'",
  "youCantSelectOpponentHouse": "Anda tidak bisa memilih 'rumah' lawan",
  "youCantSelectEmptyHouse": "Anda tidak bisa memilih 'rumah' kosong",
  "youWin": "Anda menang! Terima kasih sudah bermain!",
  "youLose": "Anda kalah! Terima kasih sudah bermain!",
  "itsDraw": "Seri! Terima kasih sudah bermain!",
  "youGetAnotherTurn": "Anda dapat giliran lagi",
  "youCantMove": "Anda tidak bisa jalan. Giliran lawan lagi",
  "opponentGetAnotherTurn": "Lawan dapat giliran lagi",
  "opponentCantMove": "Lawan tidak bisa jalan. Giliran Anda lagi",
  "youTakeBeans": "Anda mengambil biji lawan yang bersebrangan",
  "opponentTakeBeans": "Lawan mengambil biji Anda yang bersebrangan",
  "welcome": "Selamat bermain!",
}

export default Congklak;