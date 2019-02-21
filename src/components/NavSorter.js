import React from "react";
import { actionObject } from "../store/helpers";

export default React.memo(({ sorters, sortBy, dispatch }) =>
  sorters.map(sorter => (
    <button
      key={sorter}
      className={`sorter${sortBy === sorter ? " selected" : ""}`}
      type="button"
      onClick={() => dispatch(actionObject("sortBy", sorter))}
    >
      <span>{sorter}</span>
    </button>
  ))
);
