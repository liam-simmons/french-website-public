import React from "react";
import { Link } from "react-router-dom";

import "./ImageLink.css";

function ImageLink(props) {
  return (
    <Link to={props.to}>
      <img
        className={props.imageClass}
        style={props.imageStyle}
        src={props.image}
        alt="Link"
        width={props.width}
        height={props.height}
        {...props.imageProps}
      />
    </Link>
  );
}

export default ImageLink;
