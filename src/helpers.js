import querystring from "query-string";

const clean = obj =>
  Object.keys(obj)
    .filter(key => !!obj[key])
    .reduce((acc, key) => {
      acc[key] = obj[key];
      return acc;
    }, {});

export const qs = {
  getParams: qs => querystring.parse(qs),
  getCurrent: () => window.location.search.replace("?", ""),
  fromState: state =>
    querystring.stringify(
      clean({
        filters: state.filters,
        sortBy: state.sortBy,
        q: state.q,
        continent: state.continent,
        detail: state.detail,
        detailView: state.detailView,
      })
    ),
};

export const createReducers = (reducers = {}) => (
  state,
  { type, payload } = {}
) => (reducers[type] ? reducers[type](state, payload) : state);

export const action = (type, payload) => ({ type, payload });
