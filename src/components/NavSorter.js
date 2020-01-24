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
        view === "CH" ||
        sorter === "ratio" ||
        (sorter === "adoption" && view === "SAM") ||
        (sorter === "adoption" && view === "RU") ||
        (sorter === "adoption" && view === "NORDIC")
      }
      onClick={() => dispatch(action("sortBy", sorter))}
    >
      <span>{sorter}</span>
    </button>
  ))
);

export default withContext(NavSorter);
