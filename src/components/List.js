import React, { Fragment } from "react";
import { action, getId } from "../helpers";
import ListItemFront from "./ListItemFront";
import ListItemBack from "./ListItemBack";
import { withContext } from "../store/context";

const List = React.memo(({ isSorted, size, items, dispatch, active }) => (
  <ul className={`list ${size}`}>
    {items.map((flag, i) => {
      const flagPath = getId(flag.belongsTo);
      const flagUrl = require(`../data/flags/${
        flagPath ? `${flagPath}/${flag.id}` : flag.id
      }.svg`);

      return (
        <Fragment key={flag.id}>
          {(flag.id === "abkhazia" || flag.id === "american-samoa") &&
            !isSorted && <hr />}

          <li>
            <div
              className="flip-container"
              onMouseEnter={() => dispatch(action("activate", i))}
              onFocusCapture={() => dispatch(action("activate", i))}
            >
              <div className="flipper">
                <ListItemFront svgUrl={flagUrl} country={flag.country} />
                <ListItemBack
                  active={active === i}
                  svgUrl={flagUrl}
                  flag={flag}
                />
              </div>
            </div>
          </li>
        </Fragment>
      );
    })}
  </ul>
));

export default withContext(List);
