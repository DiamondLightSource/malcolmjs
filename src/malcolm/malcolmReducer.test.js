import malcolmReducer from './malcolmReducer';

const buildAction = type => ({
  type,
  typeid: 'malcolm:core/Get:1.0',
});

describe('malcolm reducer', () => {
  let state = {};

  beforeEach(() => {
    state = {
      messagesInFlight: [],
    };
  });

  it("doesn't affect state for non-malcolm messages", () => {
    const newState = malcolmReducer(state, buildAction('not malcolm:send'));

    expect(newState).toEqual(state);
  });

  it('tracks malcolm messages in the state', () => {
    const newState = malcolmReducer(state, buildAction('malcolm:send'));

    expect(newState.messagesInFlight.length).toEqual(1);
    expect(newState.messagesInFlight[0].type).not.toBeDefined();
    expect(newState.messagesInFlight[0].typeid).toEqual('malcolm:core/Get:1.0');
  });

  it('tracks multiple malcolm messages in the state', () => {
    state = malcolmReducer(state, buildAction('malcolm:send'));
    state = malcolmReducer(state, buildAction('malcolm:send'));

    expect(state.messagesInFlight.length).toEqual(2);
  });
});
