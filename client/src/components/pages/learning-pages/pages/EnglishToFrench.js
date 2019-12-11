import React from "react";

import ResponseButtons from "../components/ResponseButtons";
import InformationSection from "../components/InformationSection";

function EnglishToFrench(props) {
  const { words, revealed, loading } = props;
  return (
    <div className="container container-theme shadow-sm answer-section">
      {loading && (
        <div>
          <div className="spinner-border" role="status">
            <span className="sr-only">Loading...</span>
          </div>
          Loading
        </div>
      )}
      {words.length > 0 && (
        <div>
          {words[0].englishArray && (
            <div className="english-words-div">
              {words[0].englishArray.map((word, index) => (
                <div className="english-word" key={index}>
                  <h4 lang="en">{word}</h4>
                </div>
              ))}
            </div>
          )}

          {words[0].imageData && (
            <div className="images-div">
              {words[0].imageData.map((image, index) => (
                <img
                  key={index}
                  className="word-image"
                  src={`data:image/png;base64,${image}`}
                  alt=""
                />
              ))}
            </div>
          )}
          {revealed && words.length > 0 ? (
            <div className="button-section">
              <h1>{words[0].french}</h1>
              <h2>{words[0].ipa}</h2>
              <div className="buttons">
                <ResponseButtons handleResponse={props.handleResponse} />
              </div>

              <InformationSection word={words[0]} />
            </div>
          ) : (
            <div>
              <button className="btn btn-theme" onClick={props.handleReveal}>
                Reveal answer
              </button>
            </div>
          )}
        </div>
      )}
      {!loading && words.length === 0 && (
        <div>You have no more words to learn!</div>
      )}
    </div>
  );
}

export default EnglishToFrench;
