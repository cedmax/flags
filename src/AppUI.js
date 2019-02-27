import React, { Fragment } from "react";
import Footer from "./components/Footer";
import List from "./components/List";
import Header from "./components/Header";
import Anthem from "./components/Anthem";
import NavSorter from "./components/NavSorter";
import Link from "./components/Link";
import Loader from "./components/Loader";
import NavSearch from "./components/NavSearch";
import NavContinents from "./components/NavContinents";
import NavFilters from "./components/NavFilters";
import { ReactComponent as Github } from "./data/octocat.svg";
import NavControls from "./components/NavControls";
import DetailsModal from "./components/DetailsModal";
import "./App.css";

const AppUI = ({ state, dispatch }) => (
  <main>
    <Link to="https://github.com/cedmax/flags" className="github-hotcorner">
      <Github />
    </Link>
    <Header view={state.view} />
    <nav>
      <NavSorter sorters={state.sorters} sortBy={state.sortBy} />
      <NavSearch query={state.q} />
      <br />
      <NavContinents
        isLoading={state.loading}
        isUS={state.view === "US"}
        selectedContinent={state.continent}
        availableContinents={state.availableContinents}
      />
      <br />
      <NavFilters
        availableFilters={state.availableFilters}
        filters={state.filters}
      />
    </nav>
    {state.loading ? (
      <div className="spinner-container">
        <Loader />
      </div>
    ) : (
      <Fragment>
        <NavControls
          total={state.filtered.length}
          isModified={
            !!state.filters.length ||
            !!state.q ||
            !!state.continent ||
            !!state.sortBy
          }
        />
        <List
          active={state.active}
          items={state.filtered}
          isSorted={!!state.sortBy || !!state.reversed}
          isUS={state.view === "US"}
        />
      </Fragment>
    )}
    <Footer />
    <Anthem playing={state.playing} />
    <DetailsModal
      detail={
        !!state.detail && state.filtered.find(flag => flag.id === state.detail)
      }
      view={state.detailView}
      isList={state.filtered.length > 1}
    />
  </main>
);

export default AppUI;
