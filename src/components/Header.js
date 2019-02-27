import React, { useState, useEffect } from "react";
import { Wrapper, Button, Menu, MenuItem } from "react-aria-menubutton";
import { action } from "../helpers";
import { withContext } from "../store/context";

const values = {
  world: "World",
  US: "United States",
  IT: "Italian regions",
  DE: "German states",
  ES: "Spanish autonomies",
};

const Header = React.memo(({ dispatch, view }) => {
  const [selected, setSelected] = useState(values[view]);

  useEffect(() => {
    setSelected(values[view] || values.world);
    document.title = `Flags of the ${values[view] || values.world}`;
  }, [view]);

  return (
    <Wrapper
      onSelection={item => {
        setSelected(values[item]);
        dispatch(action("changeDataSource", item));
      }}
    >
      <h1>
        Flags of the{" "}
        <div className="select">
          <Button className="select-button">
            <span>{selected || values.world}</span>
          </Button>
          <Menu className="select-menu">
            {Object.keys(values).map(key => (
              <MenuItem key={key} value={key} className="select-item">
                {values[key]}
              </MenuItem>
            ))}
          </Menu>
        </div>
      </h1>
    </Wrapper>
  );
});

export default withContext(Header);
