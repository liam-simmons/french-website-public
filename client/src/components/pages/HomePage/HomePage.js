import React from "react";
import { Link } from "react-router-dom";
import { connect } from "react-redux";

import { createTestAccount } from "../../../actions/users";
import configuration from "../../../configuration";

class HomePage extends React.Component {
  render() {
    return (
      <div className="container full-container">
        <h2>Welcome to my website for learning French vocabulary.</h2>
        {!localStorage[configuration.JWT_TOKEN_NAME] && (
          <div>
            <button
              className="btn btn-info btn-lg"
              style={{ marginLeft: "2vw" }}
              onClick={() => {
                this.props
                  .createTestAccount()
                  .then(this.props.history.push("/dashboard"))
                  .catch(err => console.log("err", err));
              }}
            >
              Use a quick test account
            </button>
            <Link
              className="btn btn-info btn-lg"
              style={{ marginLeft: "2vw" }}
              to="/login"
            >
              Login
            </Link>
            <Link
              className="btn btn-info btn-lg"
              style={{ marginLeft: "2vw" }}
              to="/signup"
            >
              Sign up
            </Link>
          </div>
        )}
      </div>
    );
  }
}

export default connect(
  null,
  { createTestAccount }
)(HomePage);
