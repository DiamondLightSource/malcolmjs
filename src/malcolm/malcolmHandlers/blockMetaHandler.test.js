import BlockMetaHandler from './blockMetaHandler';
import { MalcolmBlockMeta, MalcolmSend } from '../malcolm.types';

describe('block meta handler', () => {
  let dispatches = [];

  beforeEach(() => {
    dispatches = [];
  });

  const dispatch = action => dispatches.push(action);
  const request = {
    id: 1,
    path: ['block1', 'meta'],
  };

  it('processes and dispatches a block meta update', () => {
    const changes = {
      typeid: 'DELTA',
      label: 'Block 1',
      fields: ['health', 'icon'],
    };

    BlockMetaHandler(request, changes, dispatch);

    expect(dispatches.length).toEqual(3);
    expect(dispatches[0].type).toEqual(MalcolmBlockMeta);
    expect(dispatches[0].payload.id).toEqual(1);
    expect(dispatches[0].payload.typeid).toEqual('DELTA');
    expect(dispatches[0].payload.delta).toEqual(true);
    expect(dispatches[0].payload.label).toEqual('Block 1');
    expect(dispatches[0].payload.fields).toEqual(['health', 'icon']);

    expect(dispatches[1].type).toEqual(MalcolmSend);
    expect(dispatches[1].payload.path).toEqual(['block1', 'health']);

    expect(dispatches[2].type).toEqual(MalcolmSend);
    expect(dispatches[2].payload.path).toEqual(['block1', 'icon']);
  });
});
