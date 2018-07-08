import React, { Component } from 'react';

import * as FontAwesome from 'react-icons/lib/fa';

class MainMenu extends Component {
  render() {
    return (
      <div className="mm-container">
        <div className="mm-header">
          <div className="mm-play-text">{this.props.texts.play}</div>
        </div>
        <div className="mm-body">
          <div className="mm-congklak-text">CONGKLAK <span className="mm-version"> (ver.{this.props.version})</span></div>
          <button className="btn-primary" onClick={this.props.onClickPlay}>{this.props.texts.playNow}</button>
          <button className="btn-secondary" onClick={this.props.onClickInstructions}>{this.props.texts.instructions}</button>
        </div>
        <div className="mm-footer">
          <button className="btn-icon" onClick={this.props.onClickSettings}><FontAwesome.FaCog /></button>
        </div>
        {(this.props.isOpenSetting ? 
          <div className="popup-setting">
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
      </div>
    );
  }
}

export default MainMenu;