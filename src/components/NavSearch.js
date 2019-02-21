import React from "react";
import { actionObject } from "../store/helpers";

export default React.memo(({ query, dispatch }) => (
  <div className="filters">
    <span>Filter: </span>{" "}
    <input
      type="text"
      value={query}
      onChange={e => dispatch(actionObject("filterString", e.target.value))}
    />
  </div>
));
