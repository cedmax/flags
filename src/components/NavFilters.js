import React from "react";
import { action } from "../helpers";
import { withContext } from "../store/context";

const NavFilters = React.memo(({ availableFilters, filters, dispatch }) =>
  availableFilters.map((filter) => (
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

export default withContext(NavFilters);
