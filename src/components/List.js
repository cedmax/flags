import React, { Fragment } from "react";
import Link from "./Link";
import { action } from "../helpers";
import ListItemFront from "./ListItemFront";
import ListItemBack from "./ListItemBack";

export default React.memo(({ isSorted, items, dispatch }) => (
  <ul className="list">
    {items.map((flag, i) => {
      const svgUrl = require(`../data/flags/${flag.id}.svg`);

      return (
        <Fragment key={flag.id}>
          {flag.id === "abkhazia" && !isSorted && <hr />}

          <li>
            <div
              className="flip-container"
              onMouseEnter={() => dispatch(action("activate", i))}
              onFocusCapture={() => dispatch(action("activate", i))}
            >
              <div className="flipper">
                <ListItemFront svgUrl={svgUrl} country={flag.country} />
                <ListItemBack svgUrl={svgUrl} flag={flag} dispatch={dispatch} />
              </div>
            </div>
          </li>
        </Fragment>
      );
    })}
  </ul>
));