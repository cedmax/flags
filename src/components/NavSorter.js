import React from "react";
import { action } from "../helpers";
import { withContext } from "../store/context";

const NavSorter = React.memo(({ sorters, sortBy, view, dispatch }) =>
  sorters.map(sorter => (
    <button
      key={sorter}
      className={`sorter${sortBy === sorter ? " selected" : ""}`}
      type="button"
      disabled={
        (sorter === "ratio" && view === "IT") ||
        (sorter === "adoption" && view === "JP")
      }
      onClick={() => dispatch(action("sortBy", sorter))}
    >
      <span>{sorter}</span>
    </button>
  ))
);

export default withContext(NavSorter);
