import React, { useReducer, useEffect } from "react";
import useKey from "@rooks/use-key";
import querystring from "query-string";
import Footer from "./components/Footer";
import List from "./components/List";
import Anthem from "./components/Anthem";
import NavSorter from "./components/NavSorter";
import NavSearch from "./components/NavSearch";
import NavContinents from "./components/NavContinents";
import NavFilters from "./components/NavFilters";
import NavControls from "./components/NavControls";
import DetailsModal from "./components/DetailsModal";
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

  return (
    <main>
      <h1>Flags of the World</h1>
      <nav>
        <NavSorter
          sorters={state.sorters}
          sortBy={state.sortBy}
          dispatch={dispatch}
        />
        <NavSearch query={state.q} dispatch={dispatch} />
        <br />
        <NavContinents
          dispatch={dispatch}
          selectedContinent={state.continent}
          availableContinents={state.availableContinents}
        />
        <br />
        <NavFilters
          availableFilters={state.availableFilters}
          filters={state.filters}
          dispatch={dispatch}
        />
        <NavControls
          dispatch={dispatch}
          total={state.filtered.length}
          isModified={
            !!state.filters.length ||
            !!state.q ||
            !!state.continent ||
            !!state.sortBy
          }
        />
      </nav>
      <List
        items={state.filtered}
        isSorted={!!state.sortBy}
        dispatch={dispatch}
      />
      <Footer />
      <Anthem dispatch={dispatch} playing={state.playing} />
      <DetailsModal
        detail={
          !!state.detail &&
          state.filtered.find(flag => flag.id === state.detail)
        }
        view={state.detailView}
        dispatch={dispatch}
        isList={state.filtered.length > 1}
      />
    </main>
  );
};

export default App;
