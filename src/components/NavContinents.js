import React from "react";
import { action } from "../helpers";
import { withContext } from "../store/context";

const NavContinents = React.memo(
  ({ selectedContinent, view, isLoading, availableContinents, dispatch }) =>
    availableContinents.map(continent => (
      <button
        disabled={view === "US" || isLoading || view === "IT"}
        className={`${selectedContinent === continent ? "selected" : ""}
          ${view === "US" && continent === "North America" ? "selected" : ""}
          ${view === "IT" && continent === "Europe" ? "selected" : ""}
        `}
        key={continent}
        onClick={() => dispatch(action("filterByContinent", continent))}
      >
        <span>{continent}</span>
      </button>
    ))
);

export default withContext(NavContinents);
