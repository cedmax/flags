import React, { Fragment } from "react";
import Footer from "./components/Footer";
import List from "./components/List";
import Header from "./components/Header";
import NavSorter from "./components/NavSorter";
import Link from "./components/Link";
import NavSearch from "./components/NavSearch";
import NavSize from "./components/NavSize";
import NavContinents from "./components/NavContinents";
import NavFilters from "./components/NavFilters";
import { ReactComponent as Github } from "./data/octocat.svg";
import NavControls from "./components/NavControls";
import DetailsModal from "./components/DetailsModal";
import "./App.css";

const AppUI = ({ state }) => (
  <main>
    <Link to="https://github.com/cedmax/flags" className="github-hotcorner">
      <Github />
    </Link>
    <Header>
      <nav>
        <div>
          <strong>Sort by</strong>
          <NavSorter sorters={state.sorters} sortBy={state.sortBy} />
        </div>

        <div>
          <strong>Size</strong>
          <NavSize size={state.size} />
        </div>
        <div>
          <strong>Continents</strong>
          <NavContinents
            isLoading={state.loading}
            selectedContinent={state.continent}
            availableContinents={state.availableContinents}
          />
        </div>
        <div>
          <strong>Colors</strong>
          <NavFilters
            availableFilters={state.availableFilters}
            filters={state.filters}
          />
        </div>
        <div>
          <strong>
            <label htmlFor="search">Filter</label>
          </strong>
          <NavSearch query={state.q} />
        </div>
      </nav>
    </Header>

    {!state.loading && (
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
          size={state.size}
          active={state.active}
          items={state.filtered}
          isSorted={!!state.sortBy || !!state.reversed}
        />
      </Fragment>
    )}
    <Footer />
    <DetailsModal
      detail={
        !!state.detail && state.filtered.find(flag => flag.id === state.detail)
      }
      type={state.detailView}
      isList={state.filtered.length > 1}
    />
  </main>
);

export default AppUI;
