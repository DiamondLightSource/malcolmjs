/* eslint-disable */
import AttributeHandler from './attributeHandler';
import { MalcolmAttributeData } from '../malcolm.types';

const path = '';
const testDeltas = [
  {
    id: 1,
    changes: [[[], {}]],
  },
  {
    id: 1,
    changes: [[[path], {}]],
  },
  {
    id: 1,
    changes: [[[path]]],
  },
  {
    id: 1,
    changes: [[[path, path], {}]],
  },
  {
    id: 1,
    changes: [[[path], {}], [[path], {}]],
  },
  {
    id: 1,
    changes: [[[path], {}], [[path], {}]],
  },
];

describe('attribute handler', () => {
  let dispatches = [];

  beforeEach(() => {
    dispatches = [];
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
    AttributeHandler.processScalarAttribute(request, changes([]), dispatch);

    expect(dispatches.length).toEqual(1);
    expect(dispatches[0].type).toEqual(MalcolmAttributeData);
    expect(dispatches[0].payload.id).toEqual(1);
    expect(dispatches[0].payload.typeid).toEqual('NTScalar');
    expect(dispatches[0].payload.delta).toEqual(true);
  });

  it('detects group attributes', () => {
    AttributeHandler.processScalarAttribute(
      request,
      changes(['widget:group']),
      dispatch
    );
    expect(dispatches[0].payload.isGroup).toEqual(true);
  });

  it('detects attributes in groups', () => {
    AttributeHandler.processScalarAttribute(
      request,
      changes(['group:outputs']),
      dispatch
    );
    expect(dispatches[0].payload.inGroup).toEqual(true);
    expect(dispatches[0].payload.group).toEqual('outputs');
  });

  it('detects root level attributes', () => {
    AttributeHandler.processScalarAttribute(
      request,
      changes(['widget:led']),
      dispatch
    );
    expect(dispatches[0].payload.inGroup).toEqual(false);
    expect(dispatches[0].payload.isGroup).toEqual(false);
  });

  it('processes and dispatches a table attribute update', () => {
    const tableChanges = changes(['group:outputs']);
    tableChanges.typeid = 'NTTable';
    AttributeHandler.processTableAttribute(request, tableChanges, {}, dispatch);

    expect(dispatches.length).toEqual(1);
    expect(dispatches[0].type).toEqual(MalcolmAttributeData);
    expect(dispatches[0].payload.id).toEqual(1);
    expect(dispatches[0].payload.typeid).toEqual('NTTable');
    expect(dispatches[0].payload.delta).toEqual(true);
  });

  it('applies delta to whole block', () => {});

  it('applies delta to subset of block', () => {});

  it('applies delta to single value for single element path', () => {});

  it('applies delta to single value for multi element path', () => {});

  it('applies delta which deletes a field', () => {});

  it('applies delta with multiple changes', () => {});

  it('applies delta where 2nd change overwrites first', () => {});
});
