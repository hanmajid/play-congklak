import React, { Component } from 'react';
import House from './House.js';

import './Game.css';

import assistant from './assistant.png';

import * as FontAwesome from 'react-icons/lib/fa';

const whiteBeans = {
  0: 14,
  1: 13,
  2: 12,
  3: 11,
  4: 10,
  5: 9,
  6: 8,
};

const blackBeans = {
  14: 0,
  13: 1,
  12: 2,
  11: 3,
  10: 4,
  9: 5,
  8: 6,
};

class Game extends Component {
  constructor(props) {
    super(props);
    const houses = [
      7, 7, 7, 7, 7, 7, 7, 0,
      7, 7, 7, 7, 7, 7, 7, 0
    ];
    this.state = {
      houses: houses,
      selections: Array(16).fill(false),
      travels: Array(16).fill(false),
      whiteIsNext: true,
      message: this.props.texts.welcome,
      isPlaying: false,
      stops: Array(16).fill(false),
    };
  }

  handleClick(i) {  
    if(this.state.isPlaying) {
      return;
    }
    // check if it's your turn
    if(i === 7 || i === 15) {
      this.setState({
        message: this.props.texts.youCantSelectStorehouse,
      });
      return;
    }
    // check if it's your turn
    if(this.state.whiteIsNext && i > 7) {
      this.setState({
        message: this.props.texts.youCantSelectOpponentHouse,
      });
      return;
    }
    if(!this.state.whiteIsNext && i < 8) {
      this.setState({
        message: this.props.texts.youCantSelectOpponentHouse,
      });
      return;
    }
    // check if the house has no beans
    if(!this.state.houses[i]) {
      this.setState({
        message: this.props.texts.youCantSelectEmptyHouse,
      });
      return;
    }

    // style selected house
    this.selectHouse(i);
  }

  selectHouse(i) {
    // clearing travels & selections styles
    this.setState({
      travels: Array(16).fill(false), 
      selections: Array(16).fill(false),
      stops: Array(16).fill(false),
      isPlaying: true,
    }, () => {
      const selections = this.state.selections.slice();
      selections[i] = true;
      this.setState({selections: selections}, () => {
        // empty the selected house
        const houses = this.state.houses.slice();
        let beans = houses[i];
        houses[i] = 0;
        this.setState({houses: houses}, () => {
          let j = 1;
          setTimeout(function() {
            this.dropBeans(i, j, beans)
          }.bind(this), this.props.dropSpeed);
        });
      });
    });
  }

  dropBeans(i, j, beans) {
    if(j <= beans) {
      // TODO: animation dropping beans
      const k = (i+j) % 16;
      // not dropping to opponent's storehouse
      if(this.state.whiteIsNext && k === 15) {
        setTimeout(function() {
          this.dropBeans(i, ++j, ++beans); // ++beans needed to skip storehouse
        }.bind(this), this.props.dropSpeed);
      }
      else if(!this.state.whiteIsNext && k === 7) {
        setTimeout(function() {
          this.dropBeans(i, ++j, ++beans); // ++beans needed to skip storehouse
        }.bind(this), this.props.dropSpeed);
      }
      else {
        const travels = this.state.travels.slice();
        const houses = this.state.houses.slice();
        travels[k] = true;
        houses[k]++;
        this.setState({travels: travels, houses: houses}, () => {
          setTimeout(function() {
            this.dropBeans(i, ++j, beans);
          }.bind(this), this.props.dropSpeed);
        });
      }
    }
    else {
      const k = (i+j-1) % 16;
      // check if stopped in own storehouse
      if(this.state.whiteIsNext && k === 7) {
        if(!this.checkCanMove() && !this.checkOpponentCanMove()) {
          let message;
          if(this.state.houses[7] > this.state.houses[15]) {
            message = this.props.texts.youWin;
          }
          else if(this.state.houses[7] < this.state.houses[15]) {
            message = this.props.texts.youLose;
          }
          else {
            message = this.props.texts.itsDraw;
          }
          this.setState({
            message: message
          });  
        }
        else if(this.checkCanMove()) {
          let stops = this.state.stops.slice();
          stops[k] = true;
          this.setState({
            stops: stops,
            isPlaying: false,
            message: this.props.texts.youGetAnotherTurn,
          });
        }
        else {
          this.setState({
            isPlaying: false,
            message: this.props.texts.youCantMove,
            whiteIsNext: !this.state.whiteIsNext,
          }); 
        }
        return;
      }
      if(!this.state.whiteIsNext && k === 15) {
        if(!this.checkCanMove() && !this.checkOpponentCanMove()) {
          let message;
          if(this.state.houses[7] > this.state.houses[15]) {
            message = this.props.texts.youWin;
          }
          else if(this.state.houses[7] < this.state.houses[15]) {
            message = this.props.texts.youLose;
          }
          else {
            message = this.props.texts.itsDraw;
          }
          this.setState({
            message: message
          });  
        }
        else if(this.checkOpponentCanMove()) {
          let stops = this.state.stops.slice();
          stops[k] = true;
          this.setState({
            stops: stops,
            isPlaying: false,
            message: this.props.texts.opponentGetAnotherTurn,
          });
        }
        else {
          this.setState({
            isPlaying: false,
            message: this.props.texts.opponentCantMove,
            whiteIsNext: !this.state.whiteIsNext,
          }); 
        }
        return;
      }

      // check if the last house is empty
      if(this.state.houses[k] > 1) {
        this.selectHouse(k);
      }
      else {
        // if yes, check if it's your side
        if(this.state.whiteIsNext && k < 7) {
          const houses = this.state.houses.slice();
          houses[7] += houses[whiteBeans[k]];
          houses[whiteBeans[k]] = 0;
          this.setState({
            houses: houses,
            message: this.props.texts.youTakeBeans,
          }, () => {
            this.changeTurn();
          }); 
        }
        else if(!this.state.whiteIsNext && k > 7) {
         const houses = this.state.houses.slice();
          houses[15] += houses[blackBeans[k]];
          houses[blackBeans[k]] = 0;
          this.setState({
            houses: houses,
            message: this.props.texts.opponentTakeBeans,
          }, () => {
            this.changeTurn();
          }); 
        }
        else {
          this.setState({
            message: "",
          }, () => {
            this.changeTurn();
          }); 
        }
      }
    }
  }

  changeTurn() {
    let canMove = this.checkCanMove();
    let opponentCanMove = this.checkOpponentCanMove();

    if(this.state.whiteIsNext && !opponentCanMove) {
      this.setState({
        isPlaying: false,
        message: this.props.texts.opponentCantMove
      });
    }
    else if(!this.state.whiteIsNext && !canMove) {
      this.setState({
        isPlaying: false,
        message: this.props.texts.youCantMove
      }); 
    }
    else if(!opponentCanMove && !canMove) {
      let message;
      if(this.state.houses[7] > this.state.houses[15]) {
        message = this.props.texts.youWin;
      }
      else if(this.state.houses[7] > this.state.houses[15]) {
        message = this.props.texts.youLose;
      }
      else {
        message = this.props.texts.itsDraw;
      }
      this.setState({
        message: message
      });  
    }
    else {
      this.setState({
        isPlaying: false,
        whiteIsNext: !this.state.whiteIsNext,
      });
    }
  }

  checkCanMove() {
    let canMove = false;
    for(let i=0; i<7; i++) {
      if(this.state.houses[i] !== 0) canMove = true;
    }
    return canMove; 
  }

  checkOpponentCanMove() {
    let opponentCanMove = false;
    for(let i=8; i<15; i++) {
      if(this.state.houses[i] !== 0) opponentCanMove = true;
    }
    return opponentCanMove;
  }

  render() {
    var whiteHouses = [];
    for(let i=7; i>=0; i--) {
      whiteHouses.push(
        <House 
          beans={this.state.houses[i]} 
          isWhiteNext={this.state.whiteIsNext}
          isWhite={true} 
          isStorehouse={ i === 7 ? true : false}
          isSelected={this.state.selections[i]}
          isStop={this.state.stops[i]}
          isTravelled={this.state.travels[i]}
          onClick={() => this.handleClick(i) } />
      );
    }

    var blackHouses = [];
    for(let i=8; i<16; i++) {
      blackHouses.push(
        <House 
          beans={this.state.houses[i]} 
          isWhiteNext={this.state.whiteIsNext}
          isWhite={false} 
          isSelected={this.state.selections[i]}
          isStop={this.state.stops[i]}
          isTravelled={this.state.travels[i]}
          isStorehouse={ i === 15 ? true : false}
          onClick={() => this.handleClick(i) } />
      );
    }

    return (
        <div>
          <div className="game-header">
            <div className="game-title">
              {this.props.texts.play}
            </div>
          </div>
          <div className="game-body">
            <div className="game-body-left">
              <div className={"turn-indicator "+(this.state.whiteIsNext ? "white-next" : "")}></div>
              <h3 className={"opponent-turn-text "+ (!this.state.whiteIsNext ? "is-turn" : "")}>{this.props.texts.opponentTurn}</h3>
              <h3 className={"your-turn-text "+ (this.state.whiteIsNext ? "is-turn" : "")}>{this.props.texts.yourTurn}</h3>
            </div>
            <div className="game-body-main">
              <div className="game-board">
                <div className="black-houses">
                  {blackHouses}
                </div>
                <div className="white-houses">
                  {whiteHouses}
                </div>
              </div>
            </div>
            <div className="game-body-side">
              <div className="game-body-side-top">
                CONGKLAK
              </div>
              <div className="game-body-side-bottom">
                <img src={assistant} className="game-assistant" />
                <div className={this.state.message ? "message-bubble" : ""}>
                  {this.state.message}
                </div>
              </div>
            </div>
          </div>
          <div className="game-footer">
            <button className="btn-icon" onClick={this.props.onClickSettings}><FontAwesome.FaCog /></button>
            <button className="btn-link" onClick={this.props.onClickFindBug}>{this.props.texts.findBug}</button>
          </div>
          {(this.props.isOpenSetting ? 
            <div className="popup popup-setting">
              <h5>{this.props.texts.settings}</h5>
              <div>
                {this.props.texts.language}
                <select onChange={this.props.onChangeLanguage} value={this.props.language}>
                  <option value="English">{this.props.texts.english}</option>
                  <option value="Bahasa">{this.props.texts.bahasa}</option>
                </select>
              </div>
              <div>
                {this.props.texts.dropSpeed}
                <select onChange={this.props.onChangeDropSpeed} value={this.props.dropSpeed}>
                  <option value={1000}>{this.props.texts.normal}</option>
                  <option value={500}>{this.props.texts.fast}</option>
                  <option value={100}>{this.props.texts.superFast}</option>
                </select>
              </div>
              <div>
                <a href="https://hanmajid.com" target="_blank">{this.props.texts.about}</a>
              </div>
            </div> :
            <div></div>
          )}
          {(this.props.isOpenBugReport ? 
          <div className="popup popup-bug-report">
            <h5>{this.props.texts.bugReport}</h5>
            <div>
              {this.props.texts.bugDescription}
              <div>
                <textarea rows="5" cols="75" value={this.props.bugReportDesc} onChange={this.props.onChangeBugReportDesc} />
              </div>
              <button className="btn-primary" onClick={this.props.onClickSubmitBug}>{this.props.texts.submit}</button>
              {(
                this.props.isBugSubmitted ?
                  <span>{this.props.texts.bugSubmitted}</span>
                  :
                  <span></span>
                )}
            </div>
          </div> :
          <div></div>
        )}
        </div>
      );
  }
}

export default Game;