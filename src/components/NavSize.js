import React from "react";
import { action } from "../helpers";
import { withContext } from "../store/context";

const sizes = ["small", "medium", "large"];

const NavSearch = React.memo(({ size: selectedSize, dispatch }) =>
  sizes.map(size => (
    <button
      className={`${size === selectedSize ? "selected" : ""}`}
      key={size}
      onClick={() => dispatch(action("updateSize", size))}
    >
      <span>{size}</span>
    </button>
  ))
);

export default withContext(NavSearch);
