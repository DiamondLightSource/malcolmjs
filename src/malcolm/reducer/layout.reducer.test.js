import { buildPorts, offSetPosition } from './layout.reducer';

describe('Layout Reducer', () => {
  it('buildPorts builds the port array correctly', () => {
    const block = {
      attributes: [
        {
          name: 'att1',
          meta: {
            tags: ['inport:bool:ZERO'],
          },
        },
        {
          name: 'att2',
          meta: {
            tags: ['outport:bool:SEQ1'],
          },
        },
        {
          name: 'att3',
          meta: {
            tags: ['inport:bool:ZERO'],
          },
        },
      ],
    };

    const ports = buildPorts(block);

    expect(ports).toHaveLength(3);
    expect(ports[0].label).toEqual('att1');
    expect(ports[0].input).toBeTruthy();
    expect(ports[1].label).toEqual('att3');
    expect(ports[1].input).toBeTruthy();
    expect(ports[2].label).toEqual('att2');
    expect(ports[2].input).toBeFalsy();
  });

  it('offSetPosition moves the blocks to the center of the layout area', () => {
    const layoutBlock = {
      position: {
        x: 10,
        y: 20,
      },
    };

    const updatedBlock = offSetPosition(layoutBlock);

    expect(updatedBlock.position.x).toEqual(10 + 512);
    expect(updatedBlock.position.y).toEqual(20 + 768 / 2 - 64);
  });
});
