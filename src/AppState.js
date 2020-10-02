import React, { useReducer, useEffect, useState } from "react";
import useKey from "@rooks/use-key";
import { action, qs } from "./helpers";
import { getInitialState, reducers } from "./store";
import DispatchProvider from "./store/context";
import AppUi from "./AppUI";

import "./App.css";
let historySetup = false;

const mapping = {
  IT: "figs",
  DE: "figs",
  ES: "figs",
  SCAND: "nordic",
};

const supportOldUrls = () => {
  const params = qs.getParams(window.location.search);
  if (params.view) {
    const { view, ...otherParams } = params;
    const stringOfParams = qs.fromState(otherParams);
    window.history.replaceState(
      null,
      "",
      `${mapping[view] || view.toLowerCase()}${stringOfParams &&
        `?${stringOfParams}`}`
    );
  }
};

const setupUrlBinding = dispatch => {
  const updateStore = () => {
    const params = qs.getParams(window.location.search) || {};

    if (window.location.pathname !== "/") {
      params.view = window.location.pathname.replace("/", "").toUpperCase();
    }

    dispatch(action("updateFromUrl", params));
  };
  window.onpopstate = e => e.type === "popstate" && updateStore();
  updateStore();
  historySetup = true;
};

const viewRe = new RegExp(/view=([^&])+/g);
const updateUrl = qsFromState => {
  const viewParam =
    (qsFromState &&
      qsFromState.match(viewRe) &&
      qsFromState.match(viewRe)[0]) ||
    "";
  let otherParams = qsFromState.replace(viewRe, "");
  if (otherParams.endsWith("&")) {
    otherParams = otherParams.slice(0, -1);
  }
  const url = `/${viewParam &&
    viewParam.split("=")[1].toLowerCase()}${otherParams && `?${otherParams}`}`;

  window.history.pushState(null, "", url);
};

const App = props => {
  const [state, dispatch] = useReducer(reducers, getInitialState(props.data));
  const [context, setContext] = useState({ dispatch, view: state.view });

  useEffect(() => {
    setContext({ view: state.view, dispatch });
  }, [state.view]);

  useKey(["ArrowLeft", "ArrowRight"], e => {
    dispatch(action("navigate", e.key === "ArrowLeft" ? -1 : 1));
  });

  useEffect(() => {
    if (!historySetup) {
      supportOldUrls();
      setupUrlBinding(dispatch);
    } else {
      const qsFromState = qs.fromState(state);
      const currentSearch = qs.getCurrent();
      if (qsFromState !== currentSearch) {
        updateUrl(qsFromState);
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
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
