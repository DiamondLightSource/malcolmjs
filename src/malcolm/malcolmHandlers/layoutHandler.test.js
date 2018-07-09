import LayoutHandler from './layoutHandler';
import { MalcolmNewBlock, MalcolmSend } from '../malcolm.types';

describe('LayoutHandler', () => {
  let actions = [];
  let blocks = {};
  let layoutAttribute = {};
  const dispatch = action => actions.push(action);

  beforeEach(() => {
    actions = [];
    blocks = {
      block1: {
        attributes: [
          {
            name: 'layout',
            layout: {
              blocks: [
                {
                  mri: 'block2',
                  visible: 'true',
                },
              ],
            },
          },
        ],
      },
    };

    layoutAttribute = {
      name: 'layout',
      value: {
        mri: ['block2'],
        visible: [true],
      },
    };
  });

  const checkBlockAddedAndSubscribed = () => {
    expect(actions).toHaveLength(2);
    expect(actions[0].type).toEqual(MalcolmNewBlock);
    expect(actions[0].payload.blockName).toEqual('block2');
    expect(actions[0].payload.parent).toBeFalsy();
    expect(actions[0].payload.child).toBeFalsy();

    expect(actions[1].type).toEqual(MalcolmSend);
    expect(actions[1].payload.typeid).toEqual('malcolm:core/Subscribe:1.0');
    expect(actions[1].payload.path).toEqual(['block2', 'meta']);
  };

  it('layoutRouteSelected dispatches new subscriptions for visible blocks', () => {
    LayoutHandler.layoutRouteSelected(blocks, 'block1', dispatch);

    checkBlockAddedAndSubscribed();
  });

  it('layoutRouteSelected ignores blocks that are not visible', () => {
    blocks.block1.attributes[0].layout.blocks[0].visible = false;

    LayoutHandler.layoutRouteSelected(blocks, 'block1', dispatch);

    expect(actions).toHaveLength(0);
  });

  it('layoutAttributeReceived dispatches new subscriptions for visible blocks', () => {
    LayoutHandler.layoutAttributeReceived(layoutAttribute, dispatch);

    checkBlockAddedAndSubscribed();
  });

  it('layoutAttributeReceived ignores blocks that are not visible', () => {
    layoutAttribute.value.visible[0] = false;

    LayoutHandler.layoutAttributeReceived(layoutAttribute, dispatch);

    expect(actions).toHaveLength(0);
  });
});
