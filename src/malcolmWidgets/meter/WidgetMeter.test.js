import React from 'react';
import { createShallow } from '@material-ui/core/test-utils';
import WidgetMeter from './WidgetMeter.component';

describe('WidgetMeter', () => {
  let shallow;

  const theme = {
    palette: {
      primary: {
        main: '#00f',
      },
      secondary: {
        main: '#0f0',
      },
      background: {
        paper: '#424242',
      },
      divider: '#fff',
      Error: '#f00',
    },
  };

  beforeEach(() => {
    shallow = createShallow({ dive: true });
  });

  it('matches snapshot', () => {
    const wrapper = shallow(
      <WidgetMeter value={50} theme={theme} limits={{ limitHigh: 100 }} />
    );
    expect(wrapper).toMatchSnapshot();
  });
  it('displays out-of-bounds correctly', () => {
    const wrapper = shallow(
      <WidgetMeter value={150} theme={theme} limits={{ limitHigh: 100 }} />
    );
    expect(wrapper).toMatchSnapshot();
  });
});
