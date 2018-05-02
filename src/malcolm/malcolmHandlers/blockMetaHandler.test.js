import BlockMetaHandler from './blockMetaHandler';
import { MalcolmBlockMeta } from '../malcolm.types';

describe('block meta handler', () => {
  let dispatches = [];

  beforeEach(() => {
    dispatches = [];
  });

  const dispatch = action => dispatches.push(action);
  const initialPayload = {
    id: 1,
    typeid: 'DELTA',
  };

  it('processes and dispatches a block meta update', () => {
    const changes = {
      label: 'Block 1',
      fields: ['health', 'icon'],
    };

    BlockMetaHandler(initialPayload, changes, dispatch);

    expect(dispatches.length).toEqual(1);
    expect(dispatches[0].type).toEqual(MalcolmBlockMeta);
    expect(dispatches[0].payload.id).toEqual(1);
    expect(dispatches[0].payload.typeid).toEqual('DELTA');
    expect(dispatches[0].payload.delta).toEqual(true);
    expect(dispatches[0].payload.label).toEqual('Block 1');
    expect(dispatches[0].payload.fields).toEqual(['health', 'icon']);
  });
});
