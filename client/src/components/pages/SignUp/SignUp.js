import React from "react";
import { connect } from "react-redux";
import { Link } from "react-router-dom";

import { signup } from "../../../actions/users";
import Image from "../../../images/deer2.png";
import "./css/SignUp.css";

class SignUp extends React.Component {
  state = {
    data: {
      email: "",
      username: "",
      password: "",
      passwordConfirmation: ""
    },
    loading: false,
    errors: {}
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
      //create user to send and remove passwordConfirmation
      const user = this.state.data;
      delete user.passwordConfirmation;

      this.setState({ loading: true });
      this.props
        .signup(user)
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
    if (!data.email) errors.email = "Please enter an email";
    if (!data.username) errors.username = "Please enter a username";
    if (!data.password) errors.password = "Please type a password";
    else if (data.password.length < 8)
      errors.password = "Password must be at least 8 characters long";
    if (data.password !== data.passwordConfirmation)
      errors.passwordConfirmation = "Passwords do not match";
    return errors;
  };

  render() {
    const { errors } = this.state;

    return (
      <div>
        <div className="modal-dialog text-center">
          <div className="col-sm-8 signup-main-section">
            <div className="modal-content signup-modal-content">
              <img className="signup-img" src={Image} alt="img" />
              <form className="col-12" onSubmit={this.handleSubmit}>
                <div className="signup-form-group">
                  <input
                    type="email"
                    className={`form-control + ${
                      errors.email ? " is-invalid" : null
                    }`}
                    placeholder="Enter your email"
                    name="email"
                    onChange={this.handleChange}
                  />
                  {errors.email ? (
                    <div className="signup-error-message">{errors.email}</div>
                  ) : (
                    <br />
                  )}
                </div>
                <div className="signup-form-group">
                  <input
                    type="text"
                    className={`form-control + ${
                      errors.username ? " is-invalid" : null
                    }`}
                    placeholder="Pick your username"
                    name="username"
                    onChange={this.handleChange}
                  />
                  {errors.username ? (
                    <span className="signup-error-message">
                      {errors.username}
                    </span>
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
                    placeholder="Make a password"
                    name="password"
                    onChange={this.handleChange}
                  />
                  {errors.password ? (
                    <span className="signup-error-message">
                      {errors.password}
                    </span>
                  ) : (
                    <br />
                  )}
                </div>
                <div className="signup-form-group">
                  <input
                    type="password"
                    className={`form-control + ${
                      errors.passwordConfirmation ? " is-invalid" : null
                    }`}
                    placeholder="Confirm your password"
                    name="passwordConfirmation"
                    onChange={this.handleChange}
                  />
                  {errors.passwordConfirmation ? (
                    <div>
                      <span className="signup-error-message">
                        {errors.passwordConfirmation}
                      </span>
                      <br /> <br />
                    </div>
                  ) : (
                    <br />
                  )}
                </div>
                <button type="submit" className="btn signup-btn">
                  Sign up!
                </button>
                <div className="col-12 signup-forgot">
                  <Link to="/login">Already have an account? Login</Link>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
    );
  }
}

export default connect(
  null,
  { signup }
)(SignUp);
