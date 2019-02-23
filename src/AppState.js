import React, { useReducer, useEffect } from "react";
import useKey from "@rooks/use-key";
import { action, qs } from "./helpers";
import { getInitialState, reducers } from "./store";
import AppUi from "./AppUI";
import "./App.css";

const App = props => {
  const [state, dispatch] = useReducer(reducers, getInitialState(props.data));

  useKey(["ArrowLeft", "ArrowRight"], e => {
    dispatch(action("navigate", e.key === "ArrowLeft" ? -1 : 1));
  });

  useEffect(() => {
    const updateStore = () =>
      dispatch(action("updateFromUrl", qs.getParams(window.location.search)));

    window.onpopstate = e => e.type === "popstate" && updateStore();
    updateStore();
  }, []);

  useEffect(() => {
    const qsFromState = qs.fromState(state);
    const currentSearch = qs.getCurrent();
    if (qsFromState !== currentSearch) {
      const url = qsFromState ? `?${qsFromState}` : "/";
      window.history.pushState(null, "", url);
    }
  }, [
    state.filters,
    state.sortBy,
    state.q,
    state.continent,
    state.detail,
    state.detailView,
    state.view,
  ]);

  return <AppUi state={state} dispatch={dispatch} />;
};

export default App;
