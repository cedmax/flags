import React, { Fragment } from "react";
import { action } from "../helpers";
import ListItemFront from "./ListItemFront";
import ListItemBack from "./ListItemBack";
import { withContext } from "../store/context";

const List = React.memo(({ isSorted, items, dispatch, active }) => (
  <ul className="list">
    {items.map((flag, i) => {
      const imgs = {
        flag: require(`../data/flags/${flag.id}.svg`),
        map: require(`../data/maps/${flag.id}.png`),
      };

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
                <ListItemFront svgUrl={imgs.flag} country={flag.country} />
                <ListItemBack active={active === i} imgs={imgs} flag={flag} />
              </div>
            </div>
          </li>
        </Fragment>
      );
    })}
  </ul>
));

export default withContext(List);
