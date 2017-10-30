/* eslint-disable flowtype/require-valid-file-annotation */

import { create, SheetsRegistry } from 'jss';
import preset from 'jss-preset-default';
import { createMuiTheme } from 'material-ui/styles';
import { lightBlue, orange } from 'material-ui/colors';
import createGenerateClassName from 'material-ui/styles/createGenerateClassName';
import MalcolmActionCreators from '../actions/MalcolmActionCreators';

let themeType = MalcolmActionCreators.qp.getTheme();


const theme = createMuiTheme({
  palette: {
    primary: lightBlue,
    secondary: orange,
    warning: orange[500],
    type: themeType,
    background: {
      selected: themeType === "dark" ? "#565656" : "#fff"
    },
    ports: {
      bool: lightBlue,
      int32: orange
    },
  },
  size: {
    // Custom variable for sidepane width
    drawer: 360,
    // And param label and value
    param: "calc(50% - 40px)",
    // Size of plus button
    fab: 56,
  },
  // Filled in below
  dropShadows: []
});


for (let elevation = 0; elevation < theme.shadows.length; elevation++) {
  // Turn box-shadow CSS property into drop-shadow
  let arr = theme.shadows[elevation].split("),");
  let out = [];
  for (let i = 0; i < arr.length; i++) {
    let split = arr[i].split(" ");
    split.splice(3, 1);
    out.push("drop-shadow(" + split.join(" ") + ")");
  }
  theme.dropShadows.push(out.join(") "));
}

// Configure JSS
const jss = create(preset());
jss.options.createGenerateClassName = createGenerateClassName;

export const sheetsManager = new Map();

export default function createContext() {
  return {
    jss,
    theme,
    // This is needed in order to deduplicate the injection of CSS in the page.
    sheetsManager,
    // This is needed in order to inject the critical CSS.
    sheetsRegistry: new SheetsRegistry(),
  };
}
