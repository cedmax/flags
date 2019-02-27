import React from "react";
import { action } from "../helpers";
import { withContext } from "../store/context";

const NavSearch = React.memo(({ query, dispatch }) => (
  <div className="filters">
    <label htmlFor="search">
      <span>Filter: </span>{" "}
      <input
        id="search"
        type="text"
        value={query}
        onChange={e => dispatch(action("filterString", e.target.value))}
      />
    </label>
  </div>
));

export default withContext(NavSearch);
