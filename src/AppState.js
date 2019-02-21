import React, { useReducer, useEffect } from "react";
import useKey from "@rooks/use-key";
import querystring from "query-string";
import AppUi from "./AppUI";
import { getInitialState, reducers } from "./store";
import { actionObject } from "./store/helpers";
import "./App.css";

const clean = obj =>
  Object.keys(obj)
    .filter(key => !!obj[key])
    .reduce((acc, key) => {
      acc[key] = obj[key];
      return acc;
    }, {});

const App = props => {
  const [state, dispatch] = useReducer(reducers, getInitialState(props.data));
  useKey(["ArrowLeft", "ArrowRight"], e => {
    dispatch(actionObject("navigate", e.key === "ArrowLeft" ? -1 : 1));
  });

  useEffect(() => {
    const searchParams = querystring.parse(window.location.search);
    dispatch(actionObject("updateFiltersFromUrl", searchParams));

    window.onpopstate = e => {
      if (e.type === "popstate") {
        const searchParams = querystring.parse(window.location.search);
        dispatch(actionObject("updateFiltersFromUrl", searchParams));
      }
    };
  }, []);

  useEffect(() => {
    const qs = querystring.stringify(
      clean({
        filters: state.filters,
        sortBy: state.sortBy,
        q: state.q,
        continent: state.continent,
        detail: state.detail,
        detailView: state.detailView,
      })
    );

    if (qs !== window.location.search && `?${qs}` !== window.location.search)
      window.history.pushState(null, "", `?${qs}`);
  }, [
    state.filters,
    state.sortBy,
    state.q,
    state.continent,
    state.detail,
    state.detailView,
  ]);

  return <AppUi state={state} dispatch={dispatch} />;
};

export default App;
