import React from "react";
import { withRouter, Link } from "react-router-dom";
import { connect } from "react-redux";

class NavBar extends React.Component {
  render() {
    const current = this.props.location.pathname;
    return (
      <nav
        className="navbar navbar-expand-lg navbar-light"
        style={{ backgroundColor: "#4398f2" }}
      >
        <Link className="navbar-brand" to="/">
          Learn French
        </Link>
        <ul className="navbar-nav">
          <li className="nav-item">
            <Link
              className={`nav-link ${current === "/" ? "active" : ""}`}
              to="/"
            >
              Home
            </Link>
          </li>
          {this.props.isAuthenticated && (
            <li className="nav-item">
              <Link
                className={`nav-link ${
                  current === "/dashboard" ? "active" : ""
                }`}
                to="/dashboard"
              >
                Dashboard
              </Link>
            </li>
          )}
          {this.props.isAuthenticated && (
            <li className="nav-item">
              <Link
                className={`nav-link ${current === "/signout" ? "active" : ""}`}
                to="/signout"
              >
                Sign out
              </Link>
            </li>
          )}
          {!this.props.isAuthenticated && (
            <li className="nav-item">
              <Link
                className={`nav-link ${current === "/signup" ? "active" : ""}`}
                to="/signup"
              >
                Sign Up
              </Link>
            </li>
          )}
          {!this.props.isAuthenticated && (
            <li className="nav-item">
              <Link
                className={`nav-link ${current === "/login" ? "active" : ""}`}
                to="/login"
              >
                Login
              </Link>
            </li>
          )}
        </ul>
      </nav>
    );
  }
}

const mapStateToProps = (state, ownProps) => {
  const props = {
    ...ownProps,
    isAuthenticated: !!state.user.token
  };

  return props;
};

export default withRouter(connect(mapStateToProps)(NavBar));

/*
<Nav.Link href="/dashboard">Dashboard</Nav.Link>
<Nav.Link href="/login">Login</Nav.Link>
<Nav.Link href="/signup">Signup</Nav.Link>*/

/* <Navbar variant="dark" bg="#FFFFFF">
          <LinkContainer to="/" exact>
            <Navbar.Brand>Learn French Epic Website</Navbar.Brand>
          </LinkContainer>
          <Nav className="mr-auto">
            <LinkContainer to="/" exact>
              <Nav.Link exact>Home</Nav.Link>
            </LinkContainer>
            <LinkContainer to="/dashboard">
              <Nav.Link>Dashboard</Nav.Link>
            </LinkContainer>
            <LinkContainer to="/signup">
              <Nav.Link>Signup</Nav.Link>
            </LinkContainer>
            <LinkContainer to="/login">
              <Nav.Link>Login</Nav.Link>
            </LinkContainer>
          </Nav>
        </Navbar>*/
