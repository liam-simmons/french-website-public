/*global responsiveVoice*/
import React from "react";
import { connect } from "react-redux";

import { getDueWords, wordResult } from "../../../actions/words";

import EnglishToFrench from "./pages/EnglishToFrench";
import FrenchToEnglish from "./pages/FrenchToEnglish";
import TypingPage from "./pages/TypingPage";
import api from "../../../api";

import "./css/LearningPage.css";

const voiceDefault = "French Female";

class LearningPage extends React.Component {
  state = {
    text: "",
    revealed: false,
    words: [],
    loading: false
  };

  componentDidMount() {
    this.getWords();
    this.parentDiv.focus({ preventScroll: true });
  }

  getWords = () => {
    this.setState({ loading: true });

    this.props.getDueWords(this.props.pageType).then(words => {
      if (words && words.length !== 0) {
        //converting the english, english2, english3 which are useful for faster searches on back end into an array which is more useful on front end
        for (let i = 0; i < words.length; i++) {
          words[i].englishArray = [];
          words[i].english && words[i].englishArray.push(words[i].english);
          words[i].english2 && words[i].englishArray.push(words[i].english2);
          words[i].english3 && words[i].englishArray.push(words[i].english3);
        }

        //get the images
        this.getImagesFromWord(words).catch(err => {
          this.setState({ words, loading: false });
        });
        //speak word if it is french -> english
        if (this.props.langTo === "english") this.speakWord(words[0].french);
      } else this.setState({ loading: false });
    });
  };

  getImagesFromWord = async words => {
    //get imageids from words

    const imageIds = [];

    for (let i = 0; i < words.length; i++) {
      for (let j = 0; j < 3; j++) {
        if (words[i].favouriteImages[j]) {
          imageIds.push(words[i].favouriteImages[j]);
        } else if (words[i].images[j]) {
          imageIds.push(words[i].images[j]);
        }
      }
    }

    await api.image.getImages({ imageIds }).then(res => {
      let k = 0;
      for (let i = 0; i < words.length; i++) {
        words[i].imageData = [];
        for (let j = 0; j < 3; j++) {
          if (words[i].images[j] || words[i].favouriteImages[j]) {
            if (res.data.images[k]) {
              words[i].imageData[j] = Buffer.from(
                res.data.images[k],
                "base64"
              ).toString("base64");
            }
            k++;
          }
        }
      }
      this.setState({ words, loading: false });
    });
  };

  handleReveal = () => {
    if (!this.state.revealed) {
      this.parentDiv.focus({ preventScroll: true });
      this.setState({ revealed: true });

      //only play the sound on reveal if we are going english to french
      if (this.props.langTo === "french") {
        this.speakWord(this.state.words[0].french);
      }
    }
  };

  handleResponse = difficulty => {
    //only sends changes to server if you hit buttons [2,3,4]
    this.setState(prevState => {
      const state = { ...prevState };
      if (difficulty > 1) {
        //send change to the server
        console.log("WORDID: ", state.words[0]._id);
        this.props.wordResult({
          wordId: state.words[0]._id,
          levelChange: difficulty - 2, //fix this later
          type: this.props.pageType
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

      //speak word if it is french -> english
      if (this.props.langTo === "english" && state.words[0])
        this.speakWord(state.words[0].french);

      return state;
    });

    //send the difficulty level to the client
    this.setState({ revealed: false });
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

  handleTextBoxChange = e => {
    this.setState({ text: e.target.value });
  };

  handleResponseText = e => {
    e.preventDefault();
    //for the text response
    const { words, text } = this.state;
    //if correct
    if (words[0][this.props.langTo].toLowerCase() === text.toLowerCase()) {
      //send result to server
      this.props.wordResult({
        wordId: this.state.words[0].id,
        levelChange: 1, //add one if it's correct - CHANGE LATER ON BOTH TO BE ABOUT RELATIVE CHANGE
        type: this.props.pageType
      });
      //reveal result as correct
      this.setState({ correct: true, revealed: true });
    } else {
      //reveal result as incorrect
      this.setState({ correct: false, revealed: true });
    }

    //always do it since typing is always english -> french
    this.speakWord(this.state.words[0].french);
  };

  handleNextWordText = () => {
    this.setState(prevState => {
      const state = { ...prevState };

      if (state.correct) {
        state.words.splice(0, 1);
      } else if (state.words.length > 2)
        state.words.splice(2, 0, state.words.splice(0, 1)[0]);
      else {
        state.words.push(state.words[0]);
        state.words.splice(0, 1);
      }

      state.correct = false;
      state.revealed = false;

      return state;
    });
  };

  speakWord = word => {
    //can change this later to using the redux state's voice of choice, or random
    responsiveVoice.speak(word, voiceDefault);
  };

  render() {
    const { pageType } = this.props;

    const componentProps = {
      handleReveal: this.handleReveal,
      handleResponse: this.handleResponse,
      handleKeyDown: this.handleKeyDown,
      handleTextBoxChange: this.handleTextBoxChange,
      handleResponseText: this.handleResponseText,
      handleNextWordText: this.handleNextWordText,
      ...this.state
    };
    return (
      <div
        onKeyDown={e => this.props.buttons && this.handleKeyDown(e)}
        tabIndex="0"
        ref={parentDiv => {
          this.parentDiv = parentDiv;
        }}
        style={{ outlineWidth: 0 }}
      >
        {pageType === "ENGLISH_TO_FRENCH" && (
          <EnglishToFrench {...componentProps} />
        )}
        {pageType === "FRENCH_TO_ENGLISH" && (
          <FrenchToEnglish {...componentProps} />
        )}
        {pageType === "TYPING" && <TypingPage {...componentProps} />}
      </div>
    );
  }
}

export default connect(
  null,
  { getDueWords, wordResult }
)(LearningPage);
