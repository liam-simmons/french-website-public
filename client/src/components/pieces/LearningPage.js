/*global responsiveVoice*/
import React from "react";
import { connect } from "react-redux";

import Image from "../../images/brain.svg";
import { getDueWords, wordResult } from "../../actions/words";
import ResponseButtons from "./LearningPages/ResponseButtons";

import "./FrenchToEnglish.css";

const type = "FRENCH_TO_ENGLISH",
  voiceDefault = "French Female",
  //langFrom = "french",
  langTo = "english",
  langTarget = "french";

class LearningPage extends React.Component {
  state = {
    text: "",
    revealed: false,
    words: [],
    loading: false
  };

  componentDidMount() {
    this.getWords();
    this.parentDiv.focus();
  }

  getWords = () => {
    this.setState({ loading: true });

    this.props.getDueWords(type).then(words => {
      if (words && words.length !== 0) {
        responsiveVoice.speak(words[0][langTarget], voiceDefault);
        this.setState({ words, loading: false });
      }
    });
  };

  handleReveal = () => {
    if (!this.state.revealed) {
      this.parentDiv.focus();
      this.setState({ revealed: true });
    }
  };

  handleResponse = difficulty => {
    //only sends changes to server if you hit buttons [2,3,4]
    this.setState(prevState => {
      const state = { ...prevState };
      if (difficulty > 1) {
        //send change to the server
        this.props.wordResult({
          wordId: state.words[0].id,
          levelChange: difficulty - 2, //fix this later
          type
        });
        //remove word from state
        state.words.splice(0, 1);
      } //if the length of words is longer than 2, put the word there - otherwise put it at the end
      else if (state.words.length > 2)
        state.words.splice(2, 0, state.words.splice(0, 1)[0]);
      else {
        state.words.push(state.words[0]);
        state.words.splice(0, 1);
      }
      if (state.words.length > 0)
        responsiveVoice.speak(state.words[0][langTarget], voiceDefault);
      return state;
    });

    //send the difficulty level to the client
    this.setState({ revealed: false });
  };

  handleResponseText = e => {
    e.preventDefault();
    //for the text response
    const { words, text } = this.state;

    this.setState(prevState => {
      const state = { ...prevState };
      if (words[0][langTo] === text) {
        //send change to the server
        this.props.wordResult({
          wordId: state.words[0].id,
          levelChange: 1, //add one if it's correct - CHANGE LATER ON BOTH TO BE ABOUT RELATIVE CHANGE
          type
        });
        //remove word from state
        state.words.splice(0, 1);
      } //if the length of words is longer than 2, put the word there - otherwise put it at the end
      else if (state.words.length > 2)
        state.words.splice(2, 0, state.words.splice(0, 1)[0]);
      else {
        state.words.push(state.words[0]);
        state.words.splice(0, 1);
      }
      if (state.words.length > 0)
        responsiveVoice.speak(state.words[0][langTarget], voiceDefault);
      return state;
    });
  };

  handleKeyDown = e => {
    if (this.state.revealed) {
      e.keyCode === 49 && this.handleResponse(1);
      e.keyCode === 50 && this.handleResponse(2);
      e.keyCode === 51 && this.handleResponse(3);
      e.keyCode === 52 && this.handleResponse(4);
    } else {
      e.keyCode === 82 && this.handleReveal();
    }
  };

  handleChange = e => {
    this.setState({ text: e.target.value });
  };

  render() {
    const { words, revealed, text } = this.state;

    return (
      <div
        onKeyDown={e => this.handleKeyDown(e)}
        tabIndex="0"
        ref={parentDiv => {
          this.parentDiv = parentDiv;
          // parentDiv && parentDiv.focus();
        }}
      >
        {words.length > 0 ? (
          <div className="answer-section col-6 offset-3">
            <h1>{words.length > 0 && words[0].french}</h1>
            <h2>{words.length > 0 && words[0].ipa}</h2>
            <img src={Image} alt="yo mumma" width={200} height={200} />
            <br />
            {revealed ? (
              <div className="button-section">
                <h2>{words.length > 0 && words[0].english}</h2>
                <ResponseButtons handleResponse={this.handleResponse} />
              </div>
            ) : (
              <div>
                <button
                  className="btn btn-reveal btn-dark"
                  onClick={this.handleReveal}
                >
                  Reveal answer
                </button>
                <form onSubmit={this.handleResponseText}>
                  <input
                    type="text"
                    name="answer"
                    placeholder="Response?"
                    onChange={this.handleChange}
                    value={text}
                  />
                </form>
              </div>
            )}
          </div>
        ) : (
          <div>No more words to learn</div>
        )}
      </div>
    );
  }
}

export default connect(
  null,
  { getDueWords, wordResult }
)(LearningPage);
