import React from "react";

import api from "../../api";

class Categories extends React.Component {
  state = {
    name: "",
    words: [],
    loading: false,
    errors: {}
  };

  componentWillMount() {
    this.getCategory();
  }

  getCategory = () => {
    api.category.getCategory({ name: this.props.match.params.name }).then(res =>
      this.setState({
        name: res.data.name,
        words: res.data.words
      })
    );
  };

  handleAddWord = index => {
    api.user.addWord({ word: this.state.words[index]._id }).then(res =>
      this.setState(prevState => {
        const state = { ...prevState };
        state.words[index].added = true;
        return state;
      })
    );
  };

  render() {
    const { words, name, loading, errors } = this.state;

    return (
      <div>
        {words.map((word, index) => (
          <div key={word._id}>
            {word.english}
            {word.french}
            <button
              className="btn-success"
              onClick={() => this.handleAddWord(index)}
              disabled={word.added}
            >
              Add word
            </button>
            {word.added && "Added"}
          </div>
        ))}
      </div>
    );
  }
}

export default Categories;
