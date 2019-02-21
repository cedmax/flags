import React from "react";
import { actionObject } from "../store/helpers";

export default React.memo(({ availableFilters, filters, dispatch }) =>
  availableFilters.map(filter => (
    <button
      className={`square${filters.includes(filter) ? " selected" : ""}`}
      style={{ color: filter }}
      key={filter}
      onClick={() => dispatch(actionObject("filterByColor", filter))}
    >
      <span>{filter}</span>
    </button>
  ))
);
