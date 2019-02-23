import React from "react";
import { action } from "../helpers";

export default React.memo(
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
