import React from "react";
import { action } from "../helpers";

export default React.memo(({ query, dispatch }) => (
  <div className="filters">
    <span>Filter: </span>{" "}
    <input
      type="text"
      value={query}
      onChange={e => dispatch(action("filterString", e.target.value))}
    />
  </div>
));
