import React from 'react';
import WidgetSelector, { getTableWidgetTags } from './widgetSelector';
// eslint-disable-next-line no-unused-vars
import { selectorFunction } from '../attributeDetails/attributeSelector/attributeSelector.component';

jest.mock('../attributeDetails/attributeSelector/attributeSelector.component');

describe('table widget selector', () => {
  it('finds widget tags from list', () => {
    const attribute = {
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
    };
    const tags = getTableWidgetTags(attribute);
    expect(tags[0]).toEqual('widget:baz');
    expect(tags[1]).toEqual('widget:foo');
    expect(tags[2]).toEqual(-1);
  });

  it('calls selector function with right args', () => {
    // eslint-disable-next-line no-unused-vars
    const testSelector = <WidgetSelector />;
  });
});
