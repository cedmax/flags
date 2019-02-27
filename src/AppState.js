import React, { useReducer, useEffect, useState } from "react";
import useKey from "@rooks/use-key";
import { action, qs } from "./helpers";
import { getInitialState, reducers } from "./store";
import DispatchProvider from "./store/context";
import AppUi from "./AppUI";

import "./App.css";
let historySetup = false;

const setupUrlBinding = dispatch => {
  const updateStore = () =>
    dispatch(action("updateFromUrl", qs.getParams(window.location.search)));
  window.onpopstate = e => e.type === "popstate" && updateStore();
  updateStore();
  historySetup = true;
};

const updateUrl = qsFromState => {
  const url = qsFromState ? `?${qsFromState}` : "/";
  window.history.pushState(null, "", url);
};

const App = props => {
  const [state, dispatch] = useReducer(reducers, getInitialState(props.data));
  const [context] = useState({ dispatch });
  useKey(["ArrowLeft", "ArrowRight"], e => {
    dispatch(action("navigate", e.key === "ArrowLeft" ? -1 : 1));
  });

  useEffect(() => {
    if (!historySetup) {
      setupUrlBinding(dispatch);
    } else {
      const qsFromState = qs.fromState(state);
      const currentSearch = qs.getCurrent();
      if (qsFromState !== currentSearch) {
        updateUrl(qsFromState);
      }
    }
  }, [
    state.filters,
    state.sortBy,
    state.q,
    state.continent,
    state.detail,
    state.detailView,
    state.view,
    state.reversed,
  ]);

  return (
    <DispatchProvider value={context}>
      <AppUi state={state} />
    </DispatchProvider>
  );
};

export default App;
