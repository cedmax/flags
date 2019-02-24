import React from "react";
import { action } from "../helpers";
import { withContext } from "../store/context";

const NavSearch = React.memo(({ query, dispatch }) => (
  <div className="filters">
    <span>Filter: </span>{" "}
    <input
      type="text"
      value={query}
      onChange={e => dispatch(action("filterString", e.target.value))}
    />
  </div>
));

export default withContext(NavSearch);
