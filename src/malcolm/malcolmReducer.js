const initialMalcolmState = {
  messagesInFlight: [],
};

function trackAction(action) {
  const trackableAction = { ...action };
  delete trackableAction.type;
  return trackableAction;
}

function updateMessagesInFlight(state, action) {
  const newState = state;
  newState.messagesInFlight = [...state.messagesInFlight, trackAction(action)];
  return newState;
}

const malcolmReducer = (state = initialMalcolmState, action) => {
  switch (action.type) {
    case 'malcolm:send':
      return updateMessagesInFlight(state, action);

    default:
      return state;
  }
};

export default malcolmReducer;
