import React from "react";
import { connect } from "react-redux";
import { Link, withRouter } from "react-router-dom";

import { login } from "../../../actions/users";
import Image from "../../../images/deer2.png";
import "./css/SignUp.css";

class Login extends React.Component {
  state = {
    data: {
      username: "",
      password: ""
    },
    loading: false,
    errors: {},
    previousLocation: ""
  };

  handleChange = e => {
    this.setState({
      data: { ...this.state.data, [e.target.name]: e.target.value }
    });
  };

  handleSubmit = e => {
    e.preventDefault();
    const errors = this.validate(this.state.data);
    this.setState({ errors });

    if (Object.keys(errors).length === 0) {
      const user = this.state.data;

      this.setState({ loading: true });
      this.props
        .login(user)
        .then(res => {
          this.props.history.push("/");
        })
        .catch(err => {
          err.response && this.setState({ errors: err.response.data });
        });
    }
  };

  validate = data => {
    const errors = {};
    if (!data.username) errors.username = "Please enter a username";
    if (!data.password) errors.password = "Please type a password";
    return errors;
  };

  redirect = () => {
    const destination = this.state.previousLocation || "/dashboard";
    this.props.history.push(destination);
  };

  render() {
    const { errors } = this.state;

    return (
      <div>
        <div className="modal-dialog text-center">
          <div className="col-sm-8 signup-main-section">
            <div className="modal-content signup-modal-content">
              <img className="signup-form-img" src={Image} alt="img" />
              <form className="col-12" onSubmit={this.handleSubmit}>
                <div className="signup-form-group">
                  <input
                    type="text"
                    className={`form-control + ${
                      errors.username ? " is-invalid" : null
                    }`}
                    placeholder="Enter username"
                    name="username"
                    onChange={this.handleChange}
                  />
                  {errors.username ? (
                    <span class="signup-error-message">{errors.username}</span>
                  ) : (
                    <br />
                  )}
                </div>
                <div className="signup-form-group">
                  <input
                    type="password"
                    className={`form-control + ${
                      errors.password ? " is-invalid" : null
                    }`}
                    placeholder="Enter password"
                    name="password"
                    onChange={this.handleChange}
                  />
                  {errors.password ? (
                    <span class="signup-error-message">{errors.password}</span>
                  ) : (
                    <br />
                  )}
                </div>
                <button type="submit" className="btn signup-btn">
                  Login!
                </button>
                <div className="col-12 signup-forgot">
                  <Link to="/signup">Need an account? Signup!</Link>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
    );
  }
}

export default withRouter(
  connect(
    null,
    { login }
  )(Login)
);
