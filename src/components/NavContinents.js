import React from "react";
import { action } from "../helpers";

export default React.memo(
  ({ selectedContinent, availableContinents, dispatch }) =>
    availableContinents.map(continent => (
      <button
        className={`${selectedContinent === continent ? "selected" : ""}`}
        key={continent}
        onClick={() => dispatch(action("filterByContinent", continent))}
      >
        <span>{continent}</span>
      </button>
    ))
);
