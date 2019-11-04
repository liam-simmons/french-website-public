import React from "react";
import { Route, Switch, withRouter } from "react-router-dom";
import { connect } from "react-redux";

import HomePage from "./components/pages/HomePage/HomePage";
import SignUp from "./components/pages/SignUp/SignUp";
import Login from "./components/pages/SignUp/Login";
import Dashboard from "./components/pages/Dashboard/Dashboard";
import LearningPage from "./components/pages/learning-pages/LearningPage";
import AddCategories from "./components/pages/AddCategories";
import Categories from "./components/pages/Categories";
import Words from "./components/pages/Words";
import NavBar from "./components/pieces/NavBar";
import DrawingPage from "./components/pages/DrawingPage/DrawingPage";
import SignOut from "./components/pages/SignOut";
import ProtectedRoute from "./components/routes/ProtectedRoute";
import GuestRoute from "./components/routes/GuestRoute";
import { checkAuthorized } from "./actions/users";

class App extends React.Component {
  componentDidMount() {
    this.props.checkAuthorized();
  }

  render() {
    const backgroundStyles = {
      backgroundImage:
        "linear-gradient(to bottom right,rgb(109, 52, 173),rgb(32, 48, 138))",
      backgroundSize: "cover",
      position: "fixed",
      top: 0,
      left: 0,
      width: "100%",
      height: "100%",
      zIndex: -1
    };

    return (
      <div>
        <NavBar />
        <div style={backgroundStyles} />
        <Switch>
          <Route component={HomePage} exact path="/" />
          <GuestRoute component={SignUp} exact path="/signup" />
          <GuestRoute component={Login} exact path="/login" />
          <ProtectedRoute component={Dashboard} exact path="/dashboard" />
          <ProtectedRoute component={SignOut} exact path="/signout" />

          {/*learning pages*/}
          <ProtectedRoute
            render={props => (
              <LearningPage
                pageType="FRENCH_TO_ENGLISH"
                langTo="english"
                buttons={true}
              />
            )}
            exact
            path="/study/frenchtoenglish"
          />
          <ProtectedRoute
            render={props => (
              <LearningPage
                pageType="ENGLISH_TO_FRENCH"
                langTo="french"
                buttons={true}
              />
            )}
            exact
            path="/study/englishtofrench"
          />
          <ProtectedRoute
            render={props => <LearningPage pageType="TYPING" langTo="french" />}
            exact
            path="/study/typing"
          />

          <ProtectedRoute
            component={AddCategories}
            exact
            path="/addcategories"
          />
          <ProtectedRoute component={Categories} path="/categories/:name" />
          <ProtectedRoute component={Words} exact path="/words" />

          <ProtectedRoute component={DrawingPage} exact path="/draw" />
        </Switch>
      </div>
    );
  }
}

export default withRouter(
  connect(
    null,
    { checkAuthorized }
  )(App)
);
