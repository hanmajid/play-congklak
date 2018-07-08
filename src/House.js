import React, { Component } from 'react';

class House extends Component {
  constructor(props) {
    super(props);
  }

  render() {
    return (
    	<span className={this.props.isStorehouse ? "" : "house-container"}>
	      <button 
	        className={
	          "house " 
	          + (this.props.isWhiteNext ? "white-next " : " ") 
	          + (this.props.isWhite ? "white-house " : "black-house ") 
	          + (this.props.isStorehouse ? "storehouse " : " ")
	          + (this.props.isSelected ? "is-selected " : " ")
	          + (this.props.isTravelled ? "is-travelled " : " ")
	        } 
	        onClick={this.props.onClick}>
	        {this.props.beans}
	      </button>
	      {(this.props.isStorehouse) ?
	      	<span 
	      		className={"storehouse-popup " + (this.props.isStop ? "show " : " ") + (this.props.isWhite ? "white-storehouse" : "black-storehouse")}
	      	>
	      		{this.props.isWhite ? "You enter storehouse!" : "Your opponent enters storehouse!"}
	      	</span>
	      	:
	      	<span></span>
	      }
	    </span>
      );
  }
}

export default House;