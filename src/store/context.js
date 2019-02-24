import React, { createContext } from "react";

const DispatchContext = createContext();
export default DispatchContext.Provider;

export const withContext = Component =>
  React.memo(props => (
    <DispatchContext.Consumer>
      {({ dispatch }) => <Component dispatch={dispatch} {...props} />}
    </DispatchContext.Consumer>
  ));
