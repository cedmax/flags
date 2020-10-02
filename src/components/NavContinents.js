import React from "react";
import { action } from "../helpers";
import { withContext } from "../store/context";

const eu = ["FIGS", "NORDIC", "CH", "RU"];
const asia = ["JP", "RU"];

const NavContinents = React.memo(
  ({ selectedContinent, view, isLoading, availableContinents, dispatch }) => {
    const isEu = eu.includes(view);
    const isAsia = asia.includes(view);

    return availableContinents.map(continent => (
      <button
        disabled={(!!view && view !== "AUTONOMIST") || isLoading}
        className={`${selectedContinent === continent ? "selected" : ""}
        ${isAsia && continent === "Asia" ? "selected" : ""}
        ${view === "US" && continent === "North America" ? "selected" : ""}
        ${view === "SAM" && continent === "South America" ? "selected" : ""}
        ${isEu && continent === "Europe" ? "selected" : ""}`}
        key={continent}
        onClick={() => dispatch(action("filterByContinent", continent))}
      >
        <span>{continent}</span>
      </button>
    ));
  }
);

export default withContext(NavContinents);
