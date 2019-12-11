import React from "react";

import "./search-pages/css/SearchPages.css";
import api from "../../api";

class Words extends React.Component {
  state = {
    query: "",
    words: []
  };

  handleSearch = e => {
    e.preventDefault();
    const { query } = this.state;
    api.word.getWords({ query }).then(res => {
      this.setState({ words: res.data.words });
    });
  };

  handleChange = e => {
    this.setState({
      [e.target.name]: e.target.value
    });
  };

  handleAddWord = wordId => {
    api.user.addWord({ wordId });
  };

  render() {
    const { query, words } = this.state;

    return (
      <div className="container container-theme search-page-container">
        <form onSubmit={this.handleSearch}>
          <div className="search-bar-outer">
            <div className="search-bar-inner">
              <input
                class="form-control search-page-search-bar textbox-theme"
                placeholder="Search Words"
                name="query"
                type="text"
                value={query}
                onChange={this.handleChange}
              />
            </div>
          </div>
        </form>

        <div className="row search-page-titles">
          <div className="col-4">
            <p>English</p>
          </div>
          <div className="col-4">
            <p>French</p>
          </div>
          <div className="col-4">
            <p>Added?</p>
          </div>
        </div>

        {words.map(word => (
          <div className="row">
            <div className="col-4">
              <p>{word.english}</p>
            </div>
            <div className="col-4">
              <p>{word.french}</p>
            </div>
            <div className="col-4">
              {word.userHasWord ? (
                "You already have this word"
              ) : (
                <button onClick={() => this.handleAddWord(word._id)}>
                  Add word
                </button>
              )}
            </div>
          </div>
        ))}
      </div>
    );
  }
}

export default Words;
