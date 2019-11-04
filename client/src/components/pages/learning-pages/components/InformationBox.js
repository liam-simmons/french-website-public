import React from "react";

function InformationBox(props) {
  return (
    <div className="card information-box">
      <div className={`card-header ${props.headerType}`}>{props.header}</div>
      <div className="card-body">
        <p className="card-text">{props.body}</p>
      </div>
    </div>
  );
}

export default InformationBox;
