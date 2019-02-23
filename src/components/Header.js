import React, { useState, useEffect } from "react";
import { Wrapper, Button, Menu, MenuItem } from "react-aria-menubutton";
import { action } from "../helpers";

const values = {
  world: "World",
  US: "United States",
};

export default ({ dispatch }) => {
  const [selected, setSelected] = useState("World");

  useEffect(() => {
    document.title = `Flags of the ${selected}`;
  }, [selected]);

  return (
    <Wrapper
      onSelection={item => {
        dispatch(action("changeDataSource", item));
        setSelected(values[item]);
      }}
    >
      <h1>
        Flags of the{" "}
        <div className="select">
          <Button className="select-button">{selected}</Button>
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
};
