import AttributeHandler from './attributeHandler';
import { MalcolmAttributeData } from '../malcolm.types';

let oldStyleAttribute;
let newStyleAttribute;
let testAttributeState;
let state;
const store = {
  getState: () => state,
};
let subscription;
const testDeltas = [
  {
    id: 1,
    changes: [
      [
        [],
        {
          value: { isATest: true },
          meta: { meaning: 'weird, but for the future' },
        },
      ],
    ],
  },
  {
    id: 1,
    changes: [[['meta'], { writeable: false }]],
  },
  {
    id: 1,
    changes: [[['value'], 'overwritten']],
  },
  {
    id: 1,
    changes: [[['meta', 'meaning'], 'meat, but spelt wrong']],
  },
  {
    id: 1,
    changes: [[['meta']]],
  },
  {
    id: 1,
    changes: [
      [['value', 'isATest'], 'True, but as a string'],
      [['timeStamp', 'time'], 1],
    ],
  },
  {
    id: 1,
    changes: [
      [['timeStamp'], { time: 1000, units: 'ms' }],
      [['timeStamp', 'time'], 2000],
    ],
  },
];

describe('attribute handler', () => {
  let dispatches = [];

  beforeEach(() => {
    state = {
      malcolm: {
        blocks: {
          TestBlock: {
            attributes: [oldStyleAttribute, newStyleAttribute],
          },
        },
      },
    };
    subscription = {
      id: 1,
      typeid: 'malcolm:core/Subscribtion:1.0',
      path: ['TestBlock', 'TestAttr'],
      delta: true,
    };
    testAttributeState = {};
    dispatches = [];
    oldStyleAttribute = {
      isATest: true,
      meta: {
        meaning: 'weird, but for the future',
      },
      timeStamp: {
        time: 0,
        units: 's',
      },
      name: 'TestAttr',
    };
    newStyleAttribute = {
      calculated: {
        name: 'NewTestAttr',
      },
      raw: {
        value: {
          isATest: true,
        },
        meta: {
          meaning: 'weird, but for the future',
        },
        timeStamp: {
          time: 0,
          units: 's',
        },
      },
    };
  });

  const dispatch = action => dispatches.push(action);
  const request = {
    id: 1,
    path: ['block1', 'health'],
  };

  const changes = tags => ({
    typeid: 'NTScalar',
    label: 'Block 1',
    fields: ['health', 'icon'],
    meta: {
      tags,
    },
  });

  it('processes and dispatches a scalar attribute update', () => {
    AttributeHandler.processAttribute(
      request,
      changes([]),
      store.getState,
      dispatch
    );

    expect(dispatches.length).toBeGreaterThanOrEqual(1);
    expect(dispatches[0].type).toEqual(MalcolmAttributeData);
    expect(dispatches[0].payload.id).toEqual(1);
    expect(dispatches[0].payload.typeid).toEqual('NTScalar');
    expect(dispatches[0].payload.delta).toEqual(true);
  });

  it('detects group attributes', () => {
    AttributeHandler.processAttribute(
      request,
      changes(['widget:group']),
      store.getState,
      dispatch
    );
    expect(dispatches[0].payload.calculated.isGroup).toEqual(true);
  });

  it('detects attributes in groups', () => {
    AttributeHandler.processAttribute(
      request,
      changes(['group:outputs']),
      store.getState,
      dispatch
    );
    expect(dispatches[0].payload.calculated.inGroup).toEqual(true);
    expect(dispatches[0].payload.calculated.group).toEqual('outputs');
  });

  it('detects root level attributes', () => {
    AttributeHandler.processAttribute(
      request,
      changes(['widget:led']),
      store.getState,
      dispatch
    );
    expect(dispatches[0].payload.calculated.inGroup).toEqual(false);
    expect(dispatches[0].payload.calculated.isGroup).toEqual(false);
  });

  it('processes and dispatches a table attribute update', () => {
    const tableChanges = changes(['group:outputs']);
    tableChanges.typeid = 'NTTable';
    AttributeHandler.processAttribute(
      request,
      tableChanges,
      store.getState,
      dispatch
    );

    expect(dispatches.length).toBeGreaterThanOrEqual(1);
    expect(dispatches[0].type).toEqual(MalcolmAttributeData);
    expect(dispatches[0].payload.id).toEqual(1);
    expect(dispatches[0].payload.typeid).toEqual('NTTable');
    expect(dispatches[0].payload.delta).toEqual(true);
  });

  // delta tests will run against new style attribute structure

  it('applies delta to whole attribute', () => {
    subscription.path[1] = 'NewTestAttr';
    testAttributeState = {};
    testAttributeState = AttributeHandler.processDeltaMessage(
      testDeltas[0].changes,
      {}
    );
    expect(testAttributeState).toEqual(testDeltas[0].changes[0][1]);
  });

  it('applies delta to block if path is [$blockName, "meta"]', () => {
    subscription.path[1] = 'meta';
    testAttributeState = {};
    testAttributeState = AttributeHandler.processDeltaMessage(
      testDeltas[2].changes,
      subscription,
      store.getState().malcolm.blocks
    );
    expect(testAttributeState).toEqual({
      ...store.getState().malcolm.blocks.TestBlock,
      value: 'overwritten',
    });
  });

  it('applies delta to subset of attribute', () => {
    subscription.path[1] = 'NewTestAttr';
    testAttributeState = AttributeHandler.processDeltaMessage(
      testDeltas[1].changes,
      newStyleAttribute.raw
    );
    expect(testAttributeState).toEqual({
      ...newStyleAttribute.raw,
      meta: { writeable: false },
    });
  });

  it('delta application doesnt mutate state', () => {
    subscription.path[1] = 'NewTestAttr';
    const backupAttribute = JSON.parse(JSON.stringify(newStyleAttribute));
    testAttributeState = {};
    testAttributeState = AttributeHandler.processDeltaMessage(
      testDeltas[1].changes,
      newStyleAttribute.raw
    );
    expect(newStyleAttribute).toEqual(backupAttribute);
  });

  it('applies delta to single value for single element path', () => {
    subscription.path[1] = 'NewTestAttr';
    testAttributeState = AttributeHandler.processDeltaMessage(
      testDeltas[2].changes,
      newStyleAttribute.raw
    );
    expect(testAttributeState).toEqual({
      ...newStyleAttribute.raw,
      value: 'overwritten',
    });
  });

  it('applies delta to single value for multi element path', () => {
    subscription.path[1] = 'NewTestAttr';
    testAttributeState = AttributeHandler.processDeltaMessage(
      testDeltas[3].changes,
      newStyleAttribute.raw
    );
    expect(testAttributeState).toEqual({
      ...newStyleAttribute.raw,
      meta: { meaning: 'meat, but spelt wrong' },
    });
  });

  it('applies delta which deletes a field', () => {
    subscription.path[1] = 'NewTestAttr';
    testAttributeState = AttributeHandler.processDeltaMessage(
      testDeltas[4].changes,
      newStyleAttribute.raw
    );
    expect(testAttributeState).toEqual({
      value: { isATest: true },
      timeStamp: { time: 0, units: 's' },
    });
  });

  it('applies delta with multiple changes', () => {
    subscription.path[1] = 'NewTestAttr';
    testAttributeState = AttributeHandler.processDeltaMessage(
      testDeltas[5].changes,
      newStyleAttribute.raw
    );
    expect(testAttributeState).toEqual({
      ...newStyleAttribute.raw,
      value: { isATest: 'True, but as a string' },
      timeStamp: { time: 1, units: 's' },
    });
  });

  it('applies delta where 2nd change overwrites first', () => {
    subscription.path[1] = 'NewTestAttr';
    testAttributeState = AttributeHandler.processDeltaMessage(
      testDeltas[6].changes,
      newStyleAttribute.raw
    );
    expect(testAttributeState).toEqual({
      ...newStyleAttribute.raw,
      timeStamp: { time: 2000, units: 'ms' },
    });
  });
});
