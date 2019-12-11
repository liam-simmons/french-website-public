import React from "react";
import { withRouter, Link } from "react-router-dom";
import { connect } from "react-redux";
import styled from "styled-components";

import "./css/NavBar.css";

const StyledLink = styled(Link)`
  text-decoration: none;

  &:focus,
  &:hover,
  &:visited,
  &:link,
  &:active {
    text-decoration: none;
  }
`;

class NavBar extends React.Component {
  handleHamburger = () => {
    const hamburgerMenu = document
      .getElementById("nav")
      .querySelector(".contents")
      .querySelector("ul");

    if (hamburgerMenu.classList.contains("burger-menu-transform")) {
      hamburgerMenu.classList.remove("burger-menu-transform");
      console.log(hamburgerMenu.offsetHeight); /*trigger reflow*/
      hamburgerMenu.classList.add("burger-menu-reverse");
      setTimeout(
        function(hamburgerMenu) {
          hamburgerMenu.classList.remove("burger-menu-reverse");
        },
        500,
        hamburgerMenu
      );
    } else if (hamburgerMenu.classList.contains("burger-menu-reverse")) {
      hamburgerMenu.classList.remove("burger-menu-reverse");
      console.log(hamburgerMenu.offsetHeight); /*trigger reflow*/
      hamburgerMenu.classList.add("burger-menu-transform");
    } else {
      hamburgerMenu.classList.add("burger-menu-transform");
    }
  };

  render() {
    const current = this.props.location.pathname;
    return (
      <div id="nav">
        <div className="nav-background shadow-sm"></div>
        <div className="container">
          <div className="contents">
            <div>
              <Link className="title" to="/">
                French
              </Link>
            </div>
            <div>
              <button
                id="hamburger-button"
                onClick={this.handleHamburger}
              ></button>
            </div>
            <ul>
              {/*<li className={current === "/" ? "active" : ""}>
                <StyledLink to="/">Home</StyledLink>
              </li>
              <li className={current === "/dashboard" ? "active" : ""}>
                <StyledLink to="dashboard">Dashboard</StyledLink>
              </li>
              <li>Help</li>
    <li>Information</li>*/}

              {!this.props.isAuthenticated && (
                <li className={current === "/" ? "active" : ""}>
                  <StyledLink to="/">Home</StyledLink>
                </li>
              )}
              {this.props.isAuthenticated && (
                <li className={current === "/dashboard" ? "active" : ""}>
                  <StyledLink to="/dashboard">Dashboard</StyledLink>
                </li>
              )}
              {this.props.isAuthenticated && (
                <li className={current === "/signout" ? "active" : ""}>
                  <StyledLink to="/signout">Sign out</StyledLink>
                </li>
              )}
              {!this.props.isAuthenticated && (
                <li className={current === "/signup" ? "active" : ""}>
                  <StyledLink to="/signup">Sign Up</StyledLink>
                </li>
              )}
              {!this.props.isAuthenticated && (
                <li className={current === "/login" ? "active" : ""}>
                  <StyledLink to="/login">Login</StyledLink>
                </li>
              )}
            </ul>
          </div>
        </div>
      </div>

      /*<nav
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
      </nav>*/
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
