import React, { Fragment } from "react";
import Footer from "./components/Footer";
import List from "./components/List";
import Anthem from "./components/Anthem";
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
import Banner from "./components/Banner";

const FilterBlock = React.memo(({ title, children }) => (
  <div>
    {title && <strong>{title}</strong>}
    {children}
  </div>
));

const AppUI = ({ state }) => (
  <main>
    <Banner />
    <Header>
      <Link to="https://github.com/cedmax/flags" className="github-hotcorner">
        <Github />
      </Link>
      <nav>
        <FilterBlock title="Sort by">
          <NavSorter sorters={state.sorters} sortBy={state.sortBy} />
        </FilterBlock>
        <FilterBlock title="Size">
          <NavSize size={state.size} />
        </FilterBlock>
        <FilterBlock title="Continents">
          <NavContinents
            isLoading={state.loading}
            selectedContinent={state.continent}
            availableContinents={state.availableContinents}
          />
        </FilterBlock>
        <FilterBlock title="Colors">
          <NavFilters
            availableFilters={state.availableFilters}
            filters={state.filters}
          />
        </FilterBlock>
        <FilterBlock>
          <label htmlFor="search">Filter</label>
          <NavSearch query={state.q} />
        </FilterBlock>
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
          view={state.view}
          size={state.size}
          active={state.active}
          items={state.filtered}
          isSorted={!!state.sortBy || !!state.reversed}
        />
      </Fragment>
    )}
    <Footer />
    <Anthem playing={state.playing} />
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
