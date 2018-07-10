import AttributeHandler from './attributeHandler';
import { MalcolmAttributeData } from '../malcolm.types';

let attribute;
const store = {
  getState: () => ({
    malcolm: {
      blocks: {
        TestBlock: {
          attributes: [attribute],
        },
      },
    },
  }),
};
const subscription = {
  id: 1,
  typeid: 'malcolm:core/Subscribtion:1.0',
  path: ['TestBlock', 'TestAttr'],
  delta: true,
};
const testDeltas = [
  {
    id: 1,
    changes: [
      [[], { isATest: true, meta: { meaning: 'weird, but for the future' } }],
    ],
  },
  {
    id: 1,
    changes: [[['meta'], { writeable: false }]],
  },
  {
    id: 1,
    changes: [[['isATest'], 'True, but as a string']],
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
      [['isATest'], 'True, but as a string'],
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
    dispatches = [];
    attribute = {
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
    expect(dispatches[0].payload.isGroup).toEqual(true);
  });

  it('detects attributes in groups', () => {
    AttributeHandler.processAttribute(
      request,
      changes(['group:outputs']),
      store.getState,
      dispatch
    );
    expect(dispatches[0].payload.inGroup).toEqual(true);
    expect(dispatches[0].payload.group).toEqual('outputs');
  });

  it('detects root level attributes', () => {
    AttributeHandler.processAttribute(
      request,
      changes(['widget:led']),
      store.getState,
      dispatch
    );
    expect(dispatches[0].payload.inGroup).toEqual(false);
    expect(dispatches[0].payload.isGroup).toEqual(false);
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

  it('applies delta to whole block', () => {
    attribute = {};
    attribute = AttributeHandler.processDeltaMessage(
      testDeltas[0].changes,
      subscription,
      store.getState
    );
    expect(attribute).toEqual(testDeltas[0].changes[0][1]);
  });

  it('applies delta to subset of block', () => {
    attribute = AttributeHandler.processDeltaMessage(
      testDeltas[1].changes,
      subscription,
      store.getState
    );
    expect(attribute).toEqual({ ...attribute, meta: { writeable: false } });
  });

  it('applies delta to single value for single element path', () => {
    attribute = AttributeHandler.processDeltaMessage(
      testDeltas[2].changes,
      subscription,
      store.getState
    );
    expect(attribute).toEqual({
      ...attribute,
      isATest: 'True, but as a string',
    });
  });

  it('applies delta to single value for multi element path', () => {
    attribute = AttributeHandler.processDeltaMessage(
      testDeltas[3].changes,
      subscription,
      store.getState
    );
    expect(attribute).toEqual({
      ...attribute,
      meta: { meaning: 'meat, but spelt wrong' },
    });
  });

  it('applies delta which deletes a field', () => {
    attribute = AttributeHandler.processDeltaMessage(
      testDeltas[4].changes,
      subscription,
      store.getState
    );
    expect(attribute).toEqual({
      isATest: true,
      timeStamp: { time: 0, units: 's' },
      name: 'TestAttr',
    });
  });

  it('applies delta with multiple changes', () => {
    attribute = AttributeHandler.processDeltaMessage(
      testDeltas[5].changes,
      subscription,
      store.getState
    );
    expect(attribute).toEqual({
      ...attribute,
      isATest: 'True, but as a string',
      timeStamp: { time: 1, units: 's' },
    });
  });

  it('applies delta where 2nd change overwrites first', () => {
    attribute = AttributeHandler.processDeltaMessage(
      testDeltas[6].changes,
      subscription,
      store.getState
    );
    expect(attribute).toEqual({
      ...attribute,
      timeStamp: { time: 2000, units: 'ms' },
    });
  });
});
