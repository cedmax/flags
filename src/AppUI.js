import React, { Fragment } from "react";
import Footer from "./components/Footer";
import List from "./components/List";
import Header from "./components/Header";
import Anthem from "./components/Anthem";
import NavSorter from "./components/NavSorter";
import NavSearch from "./components/NavSearch";
import NavContinents from "./components/NavContinents";
import NavFilters from "./components/NavFilters";
import NavControls from "./components/NavControls";
import DetailsModal from "./components/DetailsModal";
import "./App.css";

const AppUI = ({ state, dispatch }) => (
  <main>
    <Header view={state.view} dispatch={dispatch} />
    <nav>
      <NavSorter
        sorters={state.sorters}
        sortBy={state.sortBy}
        dispatch={dispatch}
      />
      <NavSearch query={state.q} dispatch={dispatch} />
      {!!state.availableContinents.length && (
        <Fragment>
          <br />
          <NavContinents
            dispatch={dispatch}
            selectedContinent={state.continent}
            availableContinents={state.availableContinents}
          />
        </Fragment>
      )}
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
      active={state.active}
      items={state.filtered}
      isSorted={!!state.sortBy}
      dispatch={dispatch}
    />
    <Footer />
    <Anthem dispatch={dispatch} playing={state.playing} />
    <DetailsModal
      detail={
        !!state.detail && state.filtered.find(flag => flag.id === state.detail)
      }
      view={state.detailView}
      dispatch={dispatch}
      isList={state.filtered.length > 1}
    />
  </main>
);

export default AppUI;
