import React from 'react';
import renderer from 'react-test-renderer';
import { MuiThemeProvider, createMuiTheme } from 'material-ui';
import DrawerHeader from './drawerHeader.component';

describe('DrawerHeader', () => {
  const theme = createMuiTheme({
    palette: {
      type: 'dark',
    },
  });

  const closeAction = () => {};

  it('renders correctly', () => {
    expect(
      renderer
        .create(
          <MuiThemeProvider theme={theme}>
            <DrawerHeader closeAction={closeAction} />
          </MuiThemeProvider>
        )
        .toJSON()
    ).toMatchSnapshot();
  });
});
