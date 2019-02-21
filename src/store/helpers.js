export const createReducers = (reducers = {}) => (
  state,
  { type, payload } = {}
) => (reducers[type] ? reducers[type](state, payload) : state);

export const actionObject = (type, payload) => ({ type, payload });
