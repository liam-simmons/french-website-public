import React from "react";
import { Link } from "react-router-dom";

import "./css/Dashboard.css";

class Dashboard extends React.Component {
  render() {
    return (
      <div className="container">
        <div className="row">
          <div className="col-12 col-md-8">
            <div className="container shadow" id="dashboard-main">
              <h2>Study now</h2>
              <div className="container dashboard-box shadow-sm">
                {/*<Link
                  className="btn btn-primary dashboard-button"
                  to="/study/newwords"
                >
                  New words
                </Link>*/}
                <Link
                  className="btn btn-primary dashboard-button"
                  to="/study/englishtofrench"
                >
                  English to French
                </Link>
                <Link
                  className="btn btn-primary dashboard-button"
                  to="/study/frenchtoenglish"
                >
                  French to English
                </Link>
                <Link
                  className="btn btn-primary dashboard-button"
                  to="/study/typing"
                >
                  Typing
                </Link>
                {/*<Link
                  className="btn btn-primary dashboard-button"
                  to="/study/conjugations"
                >
                  Conjugations
                </Link>*/}
              </div>
              <h2>Add more words</h2>

              <div className="container dashboard-box">
                <Link className="btn btn-primary dashboard-button" to="/words">
                  Add new words
                </Link>
                <Link
                  className="btn btn-primary dashboard-button"
                  to="/addcategories"
                >
                  Add new categories
                </Link>
              </div>
              <h2>Drawing</h2>
              <div className="container dashboard-box">
                <Link className="btn btn-primary dashboard-button" to="/draw">
                  Draw
                </Link>
              </div>
              <h2>Settings</h2>

              <div className="container dashboard-box">Coming soon</div>
            </div>
          </div>
          <div className="col-12 col-md-4">
            <div className="container shadow" id="dashboard-side">
              Unfinished Sidebar
            </div>
          </div>
        </div>
      </div>
    );
  }
}

export default Dashboard;
