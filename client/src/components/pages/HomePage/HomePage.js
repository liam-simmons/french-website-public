import React from "react";
import { Link } from "react-router-dom";
import { connect } from "react-redux";

import { createTestAccount } from "../../../actions/users";
import configuration from "../../../configuration";

class HomePage extends React.Component {
  render() {
    return (
      <div className="container full-container container-theme shadow-sm">
        <h2>Learn French vocabulary vite</h2>
        <p>
          Apply all your senses to learn new French vocabulary quickly and
          easily with our sepcifically designed spaced repetition application!
        </p>
        {!localStorage[configuration.JWT_TOKEN_NAME] && (
          <div style={{}}>
            <button
              className="btn btn-theme btn-lg shadow-sm"
              style={{ marginRight: "10px", marginTop: "5px" }}
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
              className="btn btn-theme btn-lg shadow-sm"
              style={{ marginRight: "10px", marginTop: "5px" }}
              to="/login"
            >
              Login
            </Link>
            <Link
              className="btn btn-theme btn-lg shadow-sm"
              style={{ marginRight: "10px", marginTop: "5px" }}
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

export default connect(null, { createTestAccount })(HomePage);
