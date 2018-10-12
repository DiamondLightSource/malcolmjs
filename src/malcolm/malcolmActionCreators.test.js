import {
  malcolmGetAction,
  malcolmSubscribeAction,
  malcolmNewBlockAction,
  malcolmLayoutUpdatePosition,
} from './malcolmActionCreators';

describe('Malcolm Action Creators', () => {
  it('malcolm GET actions have right properties', () => {
    const path = ['pathA', 'pathB'];
    const getActions = [];
    malcolmGetAction(path)(
      action => getActions.push(action),
      () => ({ malcolm: { blocks: {} } })
    );
    expect(getActions.length).toEqual(2);
    expect(getActions[0]).toEqual(malcolmNewBlockAction('pathA', false, false));
    expect(getActions[1].type).toEqual('malcolm:send');
    expect(getActions[1].payload.typeid).toEqual('malcolm:core/Get:1.0');
    expect(getActions[1].payload.path).toEqual(path);
  });

  it('malcolm GET actions fire create block if it doesnt exist in state', () => {
    const path = ['pathA', 'pathB'];
    const getActions = [];
    malcolmGetAction(path)(
      action => getActions.push(action),
      () => ({ malcolm: { blocks: { pathA: {} } } })
    );
    expect(getActions.length).toEqual(1);
    expect(getActions[0].type).toEqual('malcolm:send');
    expect(getActions[0].payload.typeid).toEqual('malcolm:core/Get:1.0');
    expect(getActions[0].payload.path).toEqual(path);
  });

  it('malcolm SUBSCRIBE actions have right properties', () => {
    const path = ['pathA', 'pathB'];
    const subscribeAction = malcolmSubscribeAction(path);

    expect(subscribeAction.type).toEqual('malcolm:send');
    expect(subscribeAction.payload.typeid).toEqual(
      'malcolm:core/Subscribe:1.0'
    );
    expect(subscribeAction.payload.path).toEqual(path);
    expect(subscribeAction.payload.delta).toEqual(true);
  });

  it('malcolm new block action has right properties', () => {
    const blockName = 'TTLIN1';
    const action = malcolmNewBlockAction(blockName, true, false);

    expect(action.type).toEqual('malcolm:newblock');
    expect(action.payload.blockName).toEqual(blockName);
    expect(action.payload.parent).toEqual(true);
    expect(action.payload.child).toEqual(false);
  });

  const runLayoutPositionUpdateTest = selectedBlocks => {
    const translation = { x: 10, y: 20 };
    const asyncAction = malcolmLayoutUpdatePosition(translation);

    const actions = [];
    const dispatch = action => actions.push(action);

    const state = {
      malcolm: {
        parentBlock: 'PANDA',
        blocks: {
          PANDA: {
            attributes: [
              {
                calculated: {
                  name: 'layout',
                },
                raw: {
                  value: {
                    mri: ['PANDA:CLOCKS'],
                    name: ['PANDA:CLOCKS'],
                    visible: [true],
                    x: [0],
                    y: [0],
                  },
                },
              },
            ],
          },
          'PANDA:CLOCKS': {},
        },
        layoutState: {
          selectedBlocks,
        },
      },
    };
    const getState = () => state;

    asyncAction(dispatch, getState);

    expect(actions).toHaveLength(3);
    expect(actions[0].type).toEqual('malcolm:updateblockposition');
    expect(actions[0].payload.translation).toEqual(translation);

    expect(actions[1].type).toEqual('malcolm:attributeflag');
    expect(actions[1].payload.path).toEqual(['PANDA', 'layout']);
    expect(actions[1].payload.flagType).toEqual('pending');
    expect(actions[1].payload.flagState).toBeTruthy();

    expect(actions[2].type).toEqual('malcolm:send');
    expect(actions[2].payload.typeid).toEqual('malcolm:core/Put:1.0');
    expect(actions[2].payload.path).toEqual(['PANDA', 'layout', 'value']);
    expect(actions[2].payload.value).toEqual({
      mri: ['PANDA:CLOCKS'],
      name: ['PANDA:CLOCKS'],
      visible: [true],
      x: [10],
      y: [20],
    });
  };

  it('malcolmLayoutUpdatePosition updates position locally and then on the server', () => {
    runLayoutPositionUpdateTest(['PANDA:CLOCKS']);
  });

  it('malcolmLayoutUpdatePosition strips out nulls and undefined from selected blocks', () => {
    runLayoutPositionUpdateTest(['PANDA:CLOCKS', null, undefined]);
  });
});
