import React from "react";

import InformationBox from "./InformationBox";

function InformationSection(props) {
  return (
    <div style={{ display: "flex" }}>
      {props.word.information && (
        <InformationBox
          header="Information"
          body={props.word.information}
          headerType="information-header"
        />
      )}
      {props.word.synonyms && (
        <InformationBox
          header="Synonyms"
          body={props.word.synonyms}
          headerType="synonym-header"
        />
      )}
      {props.word.example && (
        <InformationBox
          header="Example"
          body={props.word.example}
          headerType="example-header"
        />
      )}
    </div>
  );
}

export default InformationSection;
