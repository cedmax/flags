import React from "react";
import { action } from "../helpers";
import { withContext } from "../store/context";

const NavContinents = React.memo(
  ({ selectedContinent, isUS, isLoading, availableContinents, dispatch }) =>
    availableContinents.map(continent => (
      <button
        disabled={isUS || isLoading}
        className={`${selectedContinent === continent ? "selected" : ""} ${
          isUS && continent === "North America" ? "selected" : ""
        }`}
        key={continent}
        onClick={() => dispatch(action("filterByContinent", continent))}
      >
        <span>{continent}</span>
      </button>
    ))
);

export default withContext(NavContinents);
