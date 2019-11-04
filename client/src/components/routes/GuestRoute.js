import React from "react";

import { Route, Redirect } from "react-router-dom";
import { connect } from "react-redux";

const PrivateRoute = props => {
  const { component: Component, isAuthenticated, render, ...rest } = props;

  if (isAuthenticated) {
    return <Route {...rest} render={props => <Redirect to="/dashboard" />} />;
  } else if (render) {
    return <Route {...rest} render={render} />;
  } else {
    return <Route {...rest} render={props => <Component {...props} />} />;
  }
};

const mapStateToProps = state => {
  const props = {
    isAuthenticated: state.user.token ? true : false
  };

  return props;
};

export default connect(mapStateToProps)(PrivateRoute);
