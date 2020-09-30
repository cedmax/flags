import React, { useState, useEffect } from "react";
import { Wrapper, Button, Menu, MenuItem } from "react-aria-menubutton";
import { action } from "../helpers";
import { withContext } from "../store/context";

const values = {
  world: "World",
  AUTONOMIST: "Secessionists groups",
  US: "United States",
  FIGS: "FIGS* regions",
  SAM: "South American regions*",
  NORDIC: "Nordic countries regions",
  JP: "Japanese prefects",
  CH: "Swiss cantons",
  RU: "Russian subjects",
};

const Header = React.memo(({ dispatch, view, children }) => {
  const [selected, setSelected] = useState(values[view]);

  useEffect(() => {
    setSelected(values[view] || values.world);
    document.title = `Flags of the ${values[view] || values.world}`;
  }, [view]);

  return (
    <Wrapper
      tag="header"
      onSelection={item => {
        setSelected(values[item]);
        dispatch(action("changeDataSource", item));
      }}
    >
      <h1>
        Flags of the <br />
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
      {view === "SAM" && <small>* Ecuador, Paraguay and Uruguay missing</small>}
      {view === "FIGS" && <small>* France / Italy / Germany / Spain</small>}

      {children}
    </Wrapper>
  );
});

export default withContext(Header);
