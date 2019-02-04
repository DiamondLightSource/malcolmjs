import {
  buildMethodUpdate,
  malcolmUpdateMethodInput,
  malcolmIntialiseMethodParam,
} from './method.actions';
import {
  MalcolmAttributeData,
  MalcolmUpdateMethodInputType,
} from '../malcolm.types';

describe('method actions', () => {
  let actions;
  let state;
  let getState;
  const dispatch = action => actions.push(action);
  beforeEach(() => {
    actions = [];
    state = {
      malcolm: {
        blocks: {
          test: {
            attributes: [
              {
                calculated: {
                  isMethod: true,
                  name: 'method',
                  inputs: {},
                },
              },
            ],
          },
        },
      },
    };
    getState = () => state;
  });

  it('buildMethodUpdate sends an attribute update message', () => {
    const action = buildMethodUpdate(123, { prop: 'test' });

    expect(action.type).toEqual(MalcolmAttributeData);
    expect(action.payload.id).toEqual(123);
    expect(action.payload.prop).toEqual('test');
    expect(action.payload.calculated.isMethod).toBeTruthy();
    expect(action.payload.delta).toBeTruthy();
    expect(action.payload.calculated.pending).toBeFalsy();
  });

  it('malcolmUpdateMethodInput sends the info needed to update an input', () => {
    const action = malcolmUpdateMethodInput(
      ['PANDA', 'save'],
      'design',
      'test'
    );

    expect(action.type).toEqual(MalcolmUpdateMethodInputType);
    expect(action.payload.path).toEqual(['PANDA', 'save']);
    expect(action.payload.name).toEqual('design');
    expect(action.payload.value).toEqual('test');
  });

  it('malcolmInitialiseMethodParam fires action if param not initialised', () => {
    malcolmIntialiseMethodParam(['test', 'method'], ['takes', 'param'])(
      dispatch,
      getState
    );
    expect(actions.length).toEqual(1);
    expect(actions[0]).toEqual({
      payload: { doInitialise: true, name: 'param', path: ['test', 'method'] },
      type: 'malcolm:updatemethodinput',
    });
  });

  it('malcolmInitialiseMethodParam fires action if param has flags but not initialised', () => {
    state.malcolm.blocks.test.attributes[0].calculated.inputs.param = {
      flags: {},
    };
    malcolmIntialiseMethodParam(['test', 'method'], ['takes', 'param'])(
      dispatch,
      getState
    );
    expect(actions.length).toEqual(1);
    expect(actions[0]).toEqual({
      payload: { doInitialise: true, name: 'param', path: ['test', 'method'] },
      type: 'malcolm:updatemethodinput',
    });
  });

  it('malcolmInitialiseMethodParam doesnt fire action if param already initialised', () => {
    state.malcolm.blocks.test.attributes[0].calculated.inputs.param = {
      value: {},
    };
    malcolmIntialiseMethodParam(['test', 'method'], ['takes', 'param'])(
      dispatch,
      getState
    );
    expect(actions.length).toEqual(0);
  });
});
