import React from "react";

import LearningPage from "./LearningPage";

class Comp extends React.Component {
  render() {
    return (
      <div>
        <LearningPage
          type="FRENCH_TO_ENGLISH"
          responseType="BUTTONS"
          check="english"
        />
      </div>
    );
  }
}

export default Comp;
