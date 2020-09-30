import React from "react";
import { action } from "../helpers";
import { withContext } from "../store/context";

const NavSearch = React.memo(({ query, dispatch }) => (
  <input
    id="search"
    className="filters"
    type="text"
    value={query}
    onChange={e => dispatch(action("filterString", e.target.value))}
  />
));

export default withContext(NavSearch);
