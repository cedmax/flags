import { createReducers } from "../helpers";

const urlParams = {
  detail: null,
  detailView: "",
  filters: [],
  continent: "",
  q: "",
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

export const getInitialState = ({ US: dataSet }) => ({
  ...urlParams,
  active: "",
  playing: "",
  worldFlags: [...dataSet],
  filtered: [...dataSet],
  sorters: ["name", "adoption", "ratio"],
  availableFilters: getFilters(dataSet, "tags"),
  availableContinents: getFilters(dataSet, "continents"),
});

const sort = state => {
  let { filtered, sortBy } = state;
  switch (sortBy) {
    case "name":
      filtered = filtered.sort((a, b) =>
        a.country.toLowerCase().localeCompare(b.country.toLowerCase())
      );
      break;
    case "adoption":
      filtered = filtered.sort((a, b) => a.adoption - b.adoption);
      break;
    case "ratio":
      filtered = filtered.sort((a, b) => {
        const aParts = a.ratio.split(":");
        const aRatio = parseFloat(aParts[0]) / parseFloat(aParts[1]);
        const bParts = b.ratio.split(":");
        const bRatio = parseFloat(bParts[0]) / parseFloat(bParts[1]);

        return bRatio - aRatio;
      });
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
  const { filters, continent, worldFlags, q } = state;
  let { sortBy } = state;

  let filtered = [...worldFlags];

  if (filters.length) {
    filtered = filtered.filter(({ tags }) =>
      filters.every(tag => tags.includes(tag))
    );

    if (!sortBy) {
      sortBy = "colour";
      filtered = filtered.sort((flagA, flagB) => {
        const coverageA = filters.reduce((acc, filter) => {
          const { percent } = flagA.colors.find(({ tag }) => tag === filter);
          acc += percent;
          return acc;
        }, 0);

        const coverageB = filters.reduce((acc, filter) => {
          const { percent } = flagB.colors.find(({ tag }) => tag === filter);
          acc += percent;
          return acc;
        }, 0);

        if (coverageA < coverageB) {
          return 1;
        } else {
          return -1;
        }
      });
    }
  } else if (sortBy ==='colour'){
    sortBy = ''
  }

  if (continent) {
    filtered = filtered.filter(flag => flag.continents.includes(continent));
  }

  if (q) {
    const qF = q.toLowerCase();
    const matches = ["(", " "].map(sign => sign + qF);
    filtered = filtered.filter(flag => {
      const country = flag.country.toLowerCase();
      return (
        country.startsWith(qF) || matches.some(match => country.includes(match))
      );
    });
  }

  return sort({ ...state, filtered, sortBy });
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
    if (tag) {
      if (filters.includes(tag)) {
        filters = filters.filter(filter => filter !== tag);
      } else {
        filters.push(tag);
      }
    }

    return applyFilters({
      ...state,
      filters: [...filters],
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
    let { filters } = payload;

    if (!filters) {
      filters = [];
    }

    if (!(filters instanceof Array)) {
      filters = [filters];
    }

    return applyFilters({
      ...state,
      ...urlParams,
      ...payload,
      filters,
    });
  },
});
