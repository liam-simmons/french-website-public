import React from "react";
import { Redirect } from "react-router-dom";

import "./search-pages/css/SearchPages.css";
import api from "../../api";

class AddCategories extends React.Component {
  state = {
    categories: [],

    redirect: false,
    redirectTo: ""
  };

  componentWillMount() {
    this.getCategories();
  }

  getCategories = () => {
    api.category.getCategories().then(res => {
      this.setState({ categories: res.data.categoryNames });
    });
  };

  handleOnClick = redirectTo => {
    this.setState({ redirect: true, redirectTo });
  };

  render() {
    if (this.state.redirect) {
      return <Redirect push to={this.state.redirectTo} />;
    }

    const { categories } = this.state;

    return (
      <div className="answer-section container container-theme">
        {categories.map((category, index) => {
          return (
            <div
              onClick={() => this.handleOnClick(`categories/${category}`)}
              className="category"
              key={index}
            >
              {category}

              <div>
                <div>5/6 added</div>
                <div>
                  <btn className="btn btn-primary add-all-words-button">
                    Add all words
                  </btn>
                </div>
                <div>
                  <btn className="btn btn-primary">View category</btn>
                </div>
              </div>
            </div>
          ); //not the best key indexing
        })}
      </div>
    );
  }
}

export default AddCategories;
