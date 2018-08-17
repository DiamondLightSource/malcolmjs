import React from 'react';
import { createShallow } from '@material-ui/core/test-utils';
import { InfoDetails } from './infoDetails.component';

describe('InfoDetails', () => {
  let shallow;
  const testInfo = {
    simpleValue: 1.0,
    inlineValue: {
      value: 'test',
      inline: true,
      label: 'inline info',
      alarmState: 2,
    },
    inlineWithPaths: {
      valuePath: 'something.on.attribute',
      inline: true,
      label: 'inline info',
      alarmStatePath: 'something.else.on.attribute',
      disabledPath: 'some.flag.somewhere',
    },
    inlineWithTag: {
      value: 'test in',
      inline: true,
      label: 'inline input',
      tag: 'widget:textinput',
    },
    groupValues: {
      simpleInGroup: 'zap',
      inlineInGroupWithPaths: {
        valuePath: 'something.on.attribute',
        inline: true,
        label: 'in-group info',
        alarmStatePath: 'something.else.on.attribute',
        disabledPath: 'some.flag.somewhere',
      },
      arbitraryObject: {
        a: 'b',
        c: 'd',
        e: {
          f: 'g',
        },
      },
    },
  };
  beforeEach(() => {
    shallow = createShallow();
  });
  it('renders correctly', () => {
    const wrapper = shallow(<InfoDetails info={testInfo} isLinkInfo={false} />);
    expect(wrapper).toMatchSnapshot();
  });
});
