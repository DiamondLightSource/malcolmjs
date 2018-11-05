function createReducer(initialState, handlers) {
  return function reducer(state = initialState, action = {}) {
    if (Object.prototype.hasOwnProperty.call(handlers, action.type)) {
      return handlers[action.type](state, action.payload);
    }
    return state;
  };
}

export default createReducer;
