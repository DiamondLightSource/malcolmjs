import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { BrowserRouter } from 'react-router-dom';
import BothPanes from './views/bothPanes';
import DragDropContextProvider from 'react-dnd/lib/DragDropContextProvider';
import HTML5Backend from 'react-dnd-html5-backend';
import withStyles from 'material-ui/styles/withStyles';
import withRoot from './components/withRoot';

const styles = theme => ({
  app: {
    margin  : 0,
    padding : 0,
    flex: 1,
    flexDirection: "column",
    height: "inherit"
  }
});

class App extends Component {

  dummy()
  {

  }

  render() {
    const { classes } = this.props;
    return (
      <BrowserRouter>
        <div id="appContainer" className={classes.app}>
          <DragDropContextProvider backend={HTML5Backend}>
            <BothPanes connectDropTarget={this.dummy} isOver={false} canDrop={false}/>
          </DragDropContextProvider>
        </div>
      </BrowserRouter>
    );
  }
}

App.propTypes = {
  classes: PropTypes.object.isRequired,
};

export default withRoot(withStyles(styles)(App));
