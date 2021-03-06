import React from "react";
import { action } from "../helpers";
import { withContext } from "../store/context";

const NavControls = React.memo(({ total, isModified, dispatch }) => (
  <div className="controls">
    <h3 className="count">{total} flags</h3>
    <button
      className={`flat${!isModified ? " hidden" : ""}`}
      onClick={() => dispatch(action("resetFilters"))}
    >
      <span>reset</span>
    </button>
    <button className="flat" onClick={() => dispatch(action("reverse"))}>
      <span>reverse sorting</span>
    </button>
  </div>
));

export default withContext(NavControls);
