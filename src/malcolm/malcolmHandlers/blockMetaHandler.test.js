import { BlockMetaHandler } from './blockMetaHandler';
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

    BlockMetaHandler(request, changes, dispatch, {});

    expect(dispatches.length).toEqual(3);
    expect(dispatches[0].type).toEqual(MalcolmBlockMeta);
    expect(dispatches[0].payload.id).toEqual(1);
    expect(dispatches[0].payload.typeid).toEqual('DELTA');
    expect(dispatches[0].payload.delta).toEqual(true);
    expect(dispatches[0].payload.label).toEqual('Block 1');
    expect(dispatches[0].payload.fields).toEqual(['health', 'icon']);

    expect(dispatches[1].type).toEqual(MalcolmSend);
    expect(dispatches[1].payload.typeid).toEqual('malcolm:core/Subscribe:1.0');
    expect(dispatches[1].payload.path).toEqual(['block1', 'health']);

    expect(dispatches[2].type).toEqual(MalcolmSend);
    expect(dispatches[2].payload.typeid).toEqual('malcolm:core/Subscribe:1.0');
    expect(dispatches[2].payload.path).toEqual(['block1', 'icon']);
  });

  it('doesnt send duplicate subscription', () => {
    const changes = {
      typeid: 'DELTA',
      label: 'Block 1',
      fields: ['health', 'icon'],
    };

    BlockMetaHandler(request, changes, dispatch, {
      test: {
        typeid: 'malcolm:core/Subscribe:1.0',
        path: ['block1', 'health'],
      },
    });

    expect(dispatches.length).toEqual(2);
    expect(dispatches[0].type).toEqual(MalcolmBlockMeta);
    expect(dispatches[0].payload.id).toEqual(1);
    expect(dispatches[0].payload.typeid).toEqual('DELTA');
    expect(dispatches[0].payload.delta).toEqual(true);
    expect(dispatches[0].payload.label).toEqual('Block 1');
    expect(dispatches[0].payload.fields).toEqual(['health', 'icon']);
    expect(dispatches[1].type).toEqual(MalcolmSend);
    expect(dispatches[1].payload.path).toEqual(['block1', 'icon']);
  });

  it('doesnt send subscription if flag set to false', () => {
    const changes = {
      typeid: 'DELTA',
      label: 'Block 1',
      fields: ['health', 'icon'],
    };

    BlockMetaHandler(request, changes, dispatch, {}, false);

    expect(dispatches.length).toEqual(1);
    expect(dispatches[0].type).toEqual(MalcolmBlockMeta);
    expect(dispatches[0].payload.id).toEqual(1);
    expect(dispatches[0].payload.typeid).toEqual('DELTA');
    expect(dispatches[0].payload.delta).toEqual(true);
    expect(dispatches[0].payload.label).toEqual('Block 1');
  });

  it('sends gets if flag true', () => {
    const changes = {
      typeid: 'DELTA',
      label: 'Block 1',
      fields: ['health', 'icon'],
    };

    BlockMetaHandler(request, changes, dispatch, {}, false, true);

    expect(dispatches.length).toEqual(3);
    expect(dispatches[0].type).toEqual(MalcolmBlockMeta);
    expect(dispatches[0].payload.id).toEqual(1);
    expect(dispatches[0].payload.typeid).toEqual('DELTA');
    expect(dispatches[0].payload.delta).toEqual(true);
    expect(dispatches[0].payload.label).toEqual('Block 1');
    expect(dispatches[0].payload.fields).toEqual(['health', 'icon']);

    dispatches[1](dispatch, () => ({ malcolm: { blocks: { block1: {} } } }));
    dispatches[2](dispatch, () => ({ malcolm: { blocks: { block1: {} } } }));
    expect(dispatches[3].type).toEqual(MalcolmSend);
    expect(dispatches[3].payload.typeid).toEqual('malcolm:core/Get:1.0');
    expect(dispatches[3].payload.path).toEqual(['block1', 'health']);

    expect(dispatches[4].type).toEqual(MalcolmSend);
    expect(dispatches[4].payload.typeid).toEqual('malcolm:core/Get:1.0');
    expect(dispatches[4].payload.path).toEqual(['block1', 'icon']);
  });
});
