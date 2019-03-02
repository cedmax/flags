import querystring from "query-string";
const slugify = require("slugify");

export const getId = (string = "") =>
  slugify(string.replace("Ō", "o").replace("ō", "o")).toLowerCase();

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
        view: state.view,
        filters: state.filters,
        sortBy: state.sortBy,
        q: state.q,
        continent: state.continent,
        detail: state.detail,
        detailView: state.detailView,
        reversed: state.reversed,
      })
    ),
};

export const createReducers = (reducers = {}) => (
  state,
  { type, payload } = {}
) => (reducers[type] ? reducers[type](state, payload) : state);

export const action = (type, payload) => ({ type, payload });

export const getDetailsImageSize = ratioString => {
  const ratioParts = ratioString.split(":");
  const ratio = parseFloat(ratioParts[0]) / parseFloat(ratioParts[1]);

  const { clientHeight, clientWidth } = document.documentElement;

  let flagHeight = (clientHeight / 100) * 60;
  let flagWidth = flagHeight / ratio;

  const maxWidth = (clientWidth / 100) * 70;
  if (flagWidth > maxWidth) {
    flagWidth = maxWidth;
    flagHeight = flagWidth * ratio;
  }

  return {
    width: flagWidth,
    height: flagHeight,
  };
};
