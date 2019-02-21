import React from "react";
import { actionObject } from "../store/helpers";

export default React.memo(
  ({ selectedContinent, availableContinents, dispatch }) =>
    availableContinents.map(continent => (
      <button
        className={`${selectedContinent === continent ? "selected" : ""}`}
        key={continent}
        onClick={() => dispatch(actionObject("filterByContinent", continent))}
      >
        <span>{continent}</span>
      </button>
    ))
);
