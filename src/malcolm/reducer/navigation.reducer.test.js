import NavigationReducer, {
  processNavigationLists,
} from './navigation.reducer';
import NavTypes from '../NavTypes';
import {
  buildTestState,
  updatePanels,
  addBlock,
  buildAttribute,
  addNavigationLists,
  buildMeta,
} from '../../testState.utilities';

import blockUtils from '../blockUtils';
import { Widget } from '../../malcolmWidgets/attributeDetails/attributeSelector/attributeSelector.component';

describe('navigation reducer', () => {
  it('updateNavigationPath set navigation on state', () => {
    let state = buildTestState().malcolm;
    const blockPaths = ['PANDA', 'layout', 'PANDA:TTLIN1'];
    const payload = {
      blockPaths,
    };

    state = NavigationReducer.updateNavigationPath(state, payload);

    expect(state.navigation).not.toBeNull();
    const { navigationLists } = state.navigation;
    expect(navigationLists).not.toBeNull();
    expect(navigationLists).toHaveLength(3);
    expect(navigationLists[0].path).toEqual('PANDA');
    expect(navigationLists[0].basePath).toEqual('/PANDA/');
    expect(navigationLists[1].path).toEqual('layout');
    expect(navigationLists[1].basePath).toEqual('/PANDA/layout/');
    expect(navigationLists[2].path).toEqual('PANDA:TTLIN1');
    expect(navigationLists[2].basePath).toEqual('/PANDA/layout/PANDA:TTLIN1/');
  });

  it('resets the parent and child blocks when navigating to a different route', () => {
    let state = buildTestState().malcolm;
    updatePanels('parent', 'child', state);

    state = NavigationReducer.updateNavigationPath(state, { blockPaths: [] });

    expect(state.parentBlock).toBeUndefined();
    expect(state.childBlock).toBeUndefined();
  });
});

describe('NavigationReducer.updateNavTypes', () => {
  let state;

  beforeEach(() => {
    state = buildTestState().malcolm;
    addBlock('.blocks', undefined, state, { PANDA: {}, 'PANDA:SEQ2': {} });
    addBlock(
      'PANDA',
      [
        buildAttribute(
          'layout',
          ['PANDA', 'layout'],
          {
            name: ['SEQ1', 'SEQ2'],
            mri: ['PANDA:SEQ1', 'PANDA:SEQ2'],
          },
          0,
          buildMeta([Widget.FLOWGRAPH], true, 'Layout'),
          { SEQ1: { label: 'sequencer 1' }, SEQ2: { label: 'sequencer 2' } },
          false
        ),
      ],
      state,
      { layout: {}, health: {} }
    );

    addNavigationLists(['PANDA', 'layout', 'SEQ2', '.info'], state);
  });

  it('updateNavTypes adds the nav type for each url element', () => {
    state = NavigationReducer.updateNavTypes(state);

    expect(state.navigation.navigationLists[0].navType).toEqual(NavTypes.Block);
    expect(state.navigation.navigationLists[1].navType).toEqual(
      NavTypes.Attribute
    );
    expect(state.navigation.navigationLists[2].navType).toEqual(NavTypes.Block);
    expect(state.navigation.navigationLists[3].navType).toEqual(NavTypes.Info);
  });

  it('updateNavTypes adds the nav type for palette', () => {
    addNavigationLists(['PANDA', 'layout', '.palette'], state);
    state = NavigationReducer.updateNavTypes(state);

    expect(state.navigation.navigationLists[2].navType).toEqual(
      NavTypes.Palette
    );
  });

  it('updateNavTypes loads children for each nav element', () => {
    state = NavigationReducer.updateNavTypes(state);

    expect(state.navigation.navigationLists[0].children).toEqual({
      layout: {},
    });
    expect(state.navigation.navigationLists[0].label).toEqual('PANDA');

    expect(state.navigation.navigationLists[1].children).toEqual({
      SEQ1: { label: 'sequencer 1' },
      SEQ2: { label: 'sequencer 2' },
    });
    expect(state.navigation.navigationLists[1].label).toEqual('Layout');

    expect(state.navigation.navigationLists[2].label).toEqual('SEQ2');

    expect(state.navigation.navigationLists[3].label).toEqual('Info');
  });

  it('updateNavTypes sets parent/child blocks', () => {
    state = NavigationReducer.updateNavTypes(state);

    expect(state.parentBlock).toEqual('PANDA:SEQ2');
    expect(state.mainAttribute).toEqual(undefined);
    expect(state.childBlock).toEqual('.info');
  });

  it('updateNavTypes sets parent/child blocks if palette', () => {
    addNavigationLists(['PANDA', 'layout', '.palette'], state);
    state = NavigationReducer.updateNavTypes(state);

    expect(state.childBlock).toEqual('.palette');
  });

  it('updateNavTypes sets main attribute', () => {
    addNavigationLists(['PANDA', 'layout', 'SEQ2'], state);
    state = NavigationReducer.updateNavTypes(state);

    expect(state.parentBlock).toEqual('PANDA');
    expect(state.mainAttribute).toEqual('layout');
    expect(state.childBlock).toEqual('PANDA:SEQ2');
  });

  it('updateNavTypes sets the parent to the block element if it is the only one', () => {
    addNavigationLists(['PANDA'], state);
    state = NavigationReducer.updateNavTypes(state);

    expect(state.parentBlock).toEqual('PANDA');
  });

  it('updateNavTypes sets the parent to the last block element if there is an attribute at the end', () => {
    addNavigationLists(['PANDA', 'layout', 'SEQ2', 'table'], state);
    addBlock('PANDA:SEQ2', [buildAttribute('table')], state, ['table']);

    state = NavigationReducer.updateNavTypes(state);

    expect(state.parentBlock).toEqual('PANDA:SEQ2');
    expect(state.mainAttribute).toEqual('table');
  });

  it('handles valid sub element on nav element', () => {
    addNavigationLists(['PANDA', 'layout', 'SEQ2', 'table.row.2'], state);
    addBlock('PANDA:SEQ2', [buildAttribute('table')], state, ['table']);
    const attribute = blockUtils.findAttribute(
      state.blocks,
      'PANDA:SEQ2',
      'table'
    );
    const mockValidator = jest.fn(() => true);
    attribute.calculated.subElements = { row: mockValidator };

    state = NavigationReducer.updateNavTypes(state);

    expect(mockValidator).toHaveBeenCalledTimes(1);
    expect(mockValidator).toHaveBeenCalledWith(['2'], attribute);
    expect(state.navigation.navigationLists[3].subElements).toBeDefined();
    expect(state.navigation.navigationLists[3].subElements).toEqual([
      'row',
      '2',
    ]);
    expect(state.navigation.navigationLists[3].badUrlPart).not.toBeDefined();
    expect(state.navigation.navigationLists[3].navType).toEqual(
      NavTypes.Attribute
    );
  });

  it('handles invalid sub element on nav element', () => {
    addNavigationLists(['PANDA', 'layout', 'SEQ2', 'table.row.2'], state);
    addBlock('PANDA:SEQ2', [buildAttribute('table')], state, ['table']);
    const attribute = blockUtils.findAttribute(
      state.blocks,
      'PANDA:SEQ2',
      'table'
    );
    const mockValidator = jest.fn(() => false);
    attribute.calculated.subElements = { row: mockValidator };

    state = NavigationReducer.updateNavTypes(state);

    expect(mockValidator).toHaveBeenCalledTimes(1);
    expect(mockValidator).toHaveBeenCalledWith(['2'], attribute);
    expect(state.navigation.navigationLists[3].subElements).toBeDefined();
    expect(state.navigation.navigationLists[3].subElements).toEqual([
      undefined,
    ]);
    expect(state.navigation.navigationLists[3].badUrlPart).toBeDefined();
    expect(state.navigation.navigationLists[3].badUrlPart).toEqual([
      'row',
      '2',
    ]);
    expect(state.navigation.navigationLists[3].navType).toEqual(
      NavTypes.Attribute
    );
  });

  it('handles elements which arent child of the last attribute', () => {
    addNavigationLists(['PANDA', 'layout', 'SEQ5', 'table.row.2'], state);
    addBlock('PANDA:SEQ2', [buildAttribute('table')], state, ['table']);
    state = NavigationReducer.updateNavTypes(state);
    expect(state.navigation.navigationLists[2].navType).toEqual(NavTypes.Error);
    expect(state.navigation.navigationLists[3].navType).toEqual(NavTypes.Error);
    expect(state.navigation.navigationLists[3].subElements).not.toBeDefined();
  });
});

describe('processNavigationLists', () => {
  let blocks;

  beforeEach(() => {
    const state = buildTestState().malcolm;
    addBlock('.blocks', undefined, state, ['block1', 'block2']);
    const attribute = buildAttribute('layout', ['block1', 'layout'], {
      mri: ['block5', 'block6'],
      name: ['block5 display name', 'block6 display name'],
    });
    attribute.children = ['block5', 'block6'];
    addBlock('block1', [attribute], state, ['block2']);
    addBlock('block2', [], state, ['block3', 'block4']);

    ({ blocks } = state);
  });

  it('returns the .block blocks in the rootNav', () => {
    const navLists = processNavigationLists([], blocks, 'gui');

    expect(navLists.rootNav.path).toBe('');
    expect(navLists.rootNav.children).toBe(blocks['.blocks'].children);
  });

  it('populates nav lists from blocks if present', () => {
    const paths = ['block1', 'block2'];
    const navLists = processNavigationLists(paths, blocks, 'gui')
      .navigationLists;

    expect(navLists).toHaveLength(2);
    expect(navLists[0].path).toBe('block1');
    expect(navLists[0].label).toBe('block1');

    expect(navLists[1].path).toBe('block2');
    expect(navLists[1].label).toBe('block2');
  });

  it('populates nav lists from attributes of the previous block if no block is found', () => {
    const paths = ['block1', 'layout', 'block3'];
    const navLists = processNavigationLists(paths, blocks, 'gui')
      .navigationLists;

    expect(navLists).toHaveLength(3);
    expect(navLists[0].path).toBe('block1');
    expect(navLists[0].label).toBe('block1');

    expect(navLists[1].path).toBe('layout');
    expect(navLists[1].label).toBe('layout');

    expect(navLists[2].path).toBe('block3');
    expect(navLists[2].label).toBe('block3');
  });
});
