import React from "react";
import { action } from "../helpers";

export default React.memo(({ availableFilters, filters, dispatch }) =>
  availableFilters.map(filter => (
    <button
      className={`square${filters.includes(filter) ? " selected" : ""}`}
      style={{ color: filter }}
      key={filter}
      onClick={() => dispatch(action("filterByColor", filter))}
    >
      <span>{filter}</span>
    </button>
  ))
);
