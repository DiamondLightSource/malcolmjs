import AttributeHandler from './attributeHandler';
import { MalcolmAttributeData } from '../malcolm.types';

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

  it('processes and dispatches a scalar attribute update', () => {
    const changes = {
      typeid: 'NTScalar',
      label: 'Block 1',
      fields: ['health', 'icon'],
      meta: {
        tags: [],
      },
    };

    AttributeHandler.processScalarAttribute(request, changes, dispatch);

    expect(dispatches.length).toEqual(1);
    expect(dispatches[0].type).toEqual(MalcolmAttributeData);
    expect(dispatches[0].payload.id).toEqual(1);
    expect(dispatches[0].payload.typeid).toEqual('NTScalar');
    expect(dispatches[0].payload.delta).toEqual(true);
  });
});
