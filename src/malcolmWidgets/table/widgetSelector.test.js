import React from 'react';
import { createShallow } from '@material-ui/core/test-utils/index';

import TableWidgetSelector, { getTableWidgetTags } from './widgetSelector';
import { selectorFunction } from '../attributeDetails/attributeSelector/attributeSelector.component';

jest.mock('../attributeDetails/attributeSelector/attributeSelector.component');

describe('table widget selector', () => {
  it('finds widget tags from list', () => {
    const attribute = {
      state: {
        labels: ['a', 'b', 'c'],
        meta: {
          elements: {
            a: {
              tags: ['foo', 'bar', 'widget:baz'],
            },
            b: {
              tags: ['widget:foo', 'bar', 'baz'],
            },
            c: {
              tags: ['foo', 'bar', 'baz'],
            },
          },
        },
      },
    };
    const tags = getTableWidgetTags(attribute);
    expect(tags[0]).toEqual('widget:baz');
    expect(tags[1]).toEqual('widget:foo');
    expect(tags[2]).toEqual(-1);
  });

  it('calls selector function with right args', () => {
    const shallow = createShallow({ dive: true });
    shallow(
      <TableWidgetSelector
        columnWidgetTag="widget:foo"
        value={0}
        rowPath="test"
        rowChangeHandler="aFunction"
        columnMeta={{ choices: 'an illusion' }}
        setFlag="anotherFunction"
      />
    );
    expect(selectorFunction).toHaveBeenCalledWith(
      'widget:foo',
      'test',
      0,
      'aFunction',
      { isDirty: false, isDisabled: false, isErrorState: false },
      'anotherFunction',
      '#7986cb',
      { choices: 'an illusion' },
      false,
      true
    );
  });
});
