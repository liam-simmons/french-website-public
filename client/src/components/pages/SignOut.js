import React from "react";
import { connect } from "react-redux";

import { signout } from "../../actions/users";

class SignOut extends React.Component {
  componentDidMount() {
    this.props.signout();
  }

  render() {
    return <div>You are being signed out as we speak</div>;
  }
}

export default connect(
  null,
  { signout }
)(SignOut);
