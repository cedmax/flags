import React from "react";
import { action } from "../helpers";
import { withContext } from "../store/context";

const eu = ["IT", "DE", "ES"];

const NavContinents = React.memo(
  ({ selectedContinent, view, isLoading, availableContinents, dispatch }) => {
    const isEu = eu.includes(view);

    return availableContinents.map(continent => (
      <button
        disabled={view === "US" || isLoading || isEu}
        className={`${selectedContinent === continent ? "selected" : ""}
          ${view === "US" && continent === "North America" ? "selected" : ""}
          ${isEu && continent === "Europe" ? "selected" : ""}
        `}
        key={continent}
        onClick={() => dispatch(action("filterByContinent", continent))}
      >
        <span>{continent}</span>
      </button>
    ));
  }
);

export default withContext(NavContinents);
