import React from "react";
import { action } from "../helpers";

export default React.memo(({ sorters, sortBy, dispatch }) =>
  sorters.map(sorter => (
    <button
      key={sorter}
      className={`sorter${sortBy === sorter ? " selected" : ""}`}
      type="button"
      onClick={() => dispatch(action("sortBy", sorter))}
    >
      <span>{sorter}</span>
    </button>
  ))
);
