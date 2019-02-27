import { createReducers } from "../helpers";
import sort from "./sort";
import filter from "./filter";

const urlParams = {
  detail: null,
  detailView: "",
  filters: [],
  continent: "",
  q: "",
  reversed: "",
  sortBy: "",
};

const getFilters = (data, key) =>
  data
    .reduce((acc, flag) => {
      if (flag[key]) {
        acc = acc.concat(flag[key]);
        return [...new Set(acc)];
      }
      return acc;
    }, [])
    .sort();

export const getInitialState = (data, view = "world") => ({
  ...urlParams,
  loading: true,
  active: "",
  playing: "",
  allFlags: { ...data },
  view,
  filtered: data[view],
  sorters: ["name", "adoption", "ratio"],
  availableFilters: getFilters(data[view], "tags"),
  availableContinents: getFilters(data.world, "continents"),
});

const sortResults = state => {
  let { filtered, sortBy } = state;
  switch (sortBy) {
    case "name":
      filtered = sort.byName(filtered);
      break;
    case "adoption":
      filtered = sort.byAdoption(filtered);
      break;
    case "ratio":
      filtered = sort.byRatio(filtered);
      break;
    default:
      break;
  }

  return {
    ...state,
    filtered,
  };
};

const applyFilters = state => {
  const { filters, continent, allFlags, view, q } = state;
  let { sortBy } = state;

  let filtered = [...allFlags[view]];

  if (filters.length) {
    filtered = filter.byColour(filtered, filters);
    if (!sortBy || sortBy === "colour") {
      filtered = sort.byColour(filtered, filters);
      sortBy = "colour";
    }
  } else if (sortBy === "colour") {
    sortBy = "";
  }

  if (continent) {
    filtered = filter.byContinent(filtered, continent);
  }

  if (q) {
    filtered = filter.bySearch(filtered, q);
  }

  return sortResults({ ...state, filtered, sortBy, loading: false });
};

export const reducers = createReducers({
  resetFilters: state =>
    applyFilters({
      ...state,
      q: "",
      sortBy: "",
      filters: [],
      continent: "",
    }),

  filterByColor: (state, tag) => {
    let { filters } = state;
    filters = [...filters];
    if (tag) {
      if (filters.includes(tag)) {
        filters = filters.filter(filter => filter !== tag);
      } else {
        filters.push(tag);
      }
    }

    return applyFilters({
      ...state,
      filters,
    });
  },

  filterByContinent: (state, continent) => {
    return applyFilters({
      ...state,
      continent: state.continent === continent ? "" : continent,
    });
  },

  filterString: (state, q) => {
    return applyFilters({
      ...state,
      q,
    });
  },

  sortBy: (state, sortBy) => {
    return applyFilters({
      ...state,
      sortBy: state.sortBy === sortBy ? "" : sortBy,
    });
  },

  reverse: state => {
    return {
      ...state,
      reversed: !state.reversed || "",
      filtered: [...state.filtered].reverse(),
    };
  },

  navigate: (state, increment) => {
    const { detail, filtered } = state;

    if (!detail) {
      return state;
    }

    const index = filtered.findIndex(flag => flag.id === detail);
    let newIndex = index + increment;

    if (newIndex < 0) {
      newIndex = filtered.length - 1;
    } else if (newIndex > filtered.length - 1) {
      newIndex = 0;
    }

    return {
      ...state,
      detail: filtered[newIndex].id,
    };
  },

  play: (state, videoId) => {
    return { ...state, playing: videoId };
  },

  activate: (state, active) => ({
    ...state,
    active,
  }),
  showDetails: (state, payload) => ({
    ...state,
    detail: payload.id,
    detailView: payload.detailView,
  }),
  updateDetailsView: (state, detailView) => ({
    ...state,
    detailView,
  }),
  hideDetails: state => ({
    ...state,
    detail: null,
    detailView: "",
  }),
  updateFromUrl: (state, payload) => {
    let newState = state;

    if (payload.view !== state.view) {
      newState = getInitialState(state.allFlags, payload.view);
    }
    let { filters } = payload;

    if (!filters) {
      filters = [];
    }

    if (!(filters instanceof Array)) {
      filters = [filters];
    }

    return applyFilters({
      ...newState,
      ...urlParams,
      ...payload,
      filters,
    });
  },

  changeDataSource: (state, payload) => {
    const { allFlags } = state;
    const newState = getInitialState(allFlags, payload);
    return applyFilters(newState);
  },
});
