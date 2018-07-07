import React, { Component } from 'react';
import logo from './logo.svg';
import './App.css';

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

class House extends Component {
  constructor(props) {
    super(props);
  }

  render() {
    return (
      <button 
        className={
          "house " 
          + (this.props.isWhite ? "white-house " : "black-house ") 
          + (this.props.isStorehouse ? "storehouse " : " ")
          + (this.props.isSelected ? "is-selected " : " ")
          + (this.props.isTravelled ? "is-travelled " : " ")
        } 
        onClick={this.props.onClick}>
        {this.props.beans}
      </button>
      );
  }
}

class Game extends Component {
  constructor(props) {
    super(props);
    const houses = [
      7, 7, 7, 7, 7, 7, 7, 0,
      7, 7, 7, 7, 7, 7, 7, 0
    ];
    this.state = {
      dropSpeed: 100,
      houses: houses,
      selections: Array(16).fill(false),
      travels: Array(16).fill(false),
      whiteIsNext: true,
      message: "",
    };
  }

  handleClick(i) {  
    // check if it's your turn
    if(i === 7 || i === 15) {
      this.setState({
        message: "You can't select a storehouse",
      });
      return;
    }
    // check if it's your turn
    if(this.state.whiteIsNext && i > 7) {
      this.setState({
        message: "You can't select your opponent's houses",
      });
      return;
    }
    if(!this.state.whiteIsNext && i < 8) {
      this.setState({
        message: "You can't select your opponent's houses",
      });
      return;
    }
    // check if the house has no beans
    if(!this.state.houses[i]) {
      this.setState({
        message: "You can't select an empty house",
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
      selections: Array(16).fill(false)
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
          }.bind(this), this.state.dropSpeed);
        });
      });
    });
  }

  dropBeans(i, j, beans) {
    if(j <= beans) {
      // TODO: animation dropping beans
      const k = (i+j) % 16;
      // not dropping to opponent's storehouse
      if(this.state.whiteIsNext && k == 15) {
        setTimeout(function() {
          this.dropBeans(i, ++j, ++beans); // ++beans needed to skip storehouse
        }.bind(this), this.state.dropSpeed);
      }
      else if(!this.state.whiteIsNext && k == 7) {
        setTimeout(function() {
          this.dropBeans(i, ++j, ++beans); // ++beans needed to skip storehouse
        }.bind(this), this.state.dropSpeed);
      }
      else {
        const travels = this.state.travels.slice();
        const houses = this.state.houses.slice();
        travels[k] = true;
        houses[k]++;
        this.setState({travels: travels, houses: houses}, () => {
          setTimeout(function() {
            this.dropBeans(i, ++j, beans);
          }.bind(this), this.state.dropSpeed);
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
            message = "You win!";
          }
          else if(this.state.houses[7] < this.state.houses[15]) {
            message = "Your opponent win!";
          }
          else {
            message = "It's a draw!";
          }
          this.setState({
            message: message
          });  
        }
        else if(this.checkCanMove()) {
          this.setState({
            message: "You get another turn",
          });
        }
        else {
          this.setState({
            message: "You can't move. Your opponent's turn again",
            whiteIsNext: !this.state.whiteIsNext,
          }); 
        }
        return;
      }
      if(!this.state.whiteIsNext && k === 15) {
        if(!this.checkCanMove() && !this.checkOpponentCanMove()) {
          let message;
          if(this.state.houses[7] > this.state.houses[15]) {
            message = "You win!";
          }
          else if(this.state.houses[7] < this.state.houses[15]) {
            message = "Your opponent win!";
          }
          else {
            message = "It's a draw!";
          }
          this.setState({
            message: message
          });  
        }
        else if(this.checkOpponentCanMove()) {
          this.setState({
            message: "Your opponent get another turn",
          });
        }
        else {
          this.setState({
            message: "Your opponent can't move. Your turn again",
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
            message: "You take the opposing house's beans",
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
            message: "Your opponent take the opposing house's beans",
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
        message: "Opponent can't move. Your turn again"
      });
    }
    else if(!this.state.whiteIsNext && !canMove) {
      this.setState({
        message: "You can't move. Your opponent's turn again"
      }); 
    }
    else if(!opponentCanMove && !canMove) {
      let message;
      if(this.state.houses[7] > this.state.houses[15]) {
        message = "You win!";
      }
      else if(this.state.houses[7] > this.state.houses[15]) {
        message = "Your opponent win!";
      }
      else {
        message = "It's a draw!";
      }
      this.setState({
        message: message
      });  
    }
    else {
      this.setState({
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
          isWhite={true} 
          isStorehouse={ i == 7 ? true : false}
          isSelected={this.state.selections[i]}
          isTravelled={this.state.travels[i]}
          onClick={() => this.handleClick(i) } />
      );
    }

    var blackHouses = [];
    for(let i=8; i<16; i++) {
      blackHouses.push(
        <House 
          beans={this.state.houses[i]} 
          isWhite={false} 
          isSelected={this.state.selections[i]}
          isTravelled={this.state.travels[i]}
          isStorehouse={ i == 15 ? true : false}
          onClick={() => this.handleClick(i) } />
      );
    }

    return (
        <div>
          <h1>{!this.state.whiteIsNext ? "Opponent's turn" : ""}</h1>
          <h1>{this.state.whiteIsNext ? "Your turn" : ""}</h1>
          {blackHouses}
          <br />
          {whiteHouses}
          <hr />
          {this.state.message}
        </div>
      );
  }
}

class App extends Component {
  render() {
    return (
      <div className="App">
        <header className="App-header">
          <img src={logo} className="App-logo" alt="logo" />
          <h1 className="App-title">Welcome to React</h1>
        </header>
        <p className="App-intro">
          To get started, edit <code>src/App.js</code> and save to reload.
        </p>
        <Game />
      </div>
    );
  }
}

export default App;