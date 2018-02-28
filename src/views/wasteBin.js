/**
 * Created by ig43 on 03/10/16.
 */
import * as React from 'react';
import * as ReactDOM from 'react-dom';
import PropTypes from 'prop-types';
import interact from 'interactjs';
import flowChartActions from '../actions/flowChartActions';
import {Icon, withStyles} from 'material-ui';

const styles = theme => ({
  bin: {
    position: "fixed",
    bottom: theme.size.fab / 2,
    right: theme.size.fab / 2,
    fontSize: theme.size.fab * 2,
    cursor: "auto",
  },
});

/*
 * @class WasteBin
 * @extends React.Component
 */
class WasteBin extends React.Component {
  constructor(props) {
    super(props);
    this.state = {isOver: false};
  }

  handleOver = (value) => {
    this.setState({isOver: value});
  };


  componentDidMount() {
    this.setState({isOver: false});
    //interact(ReactDOM.findDOMNode(this))
    interact(ReactDOM.findDOMNode(this)).dropzone({
      ondrop: (event) => {
        console.log(`WasteBin: ondrop ununsed?`);
      },
      // allow multiple drags on the same element
      maxPerElement: Infinity
    })
      .on('drop', (event) => {
        console.log(`WasteBin: ondrop()`);
        flowChartActions.removeBlock(event.relatedTarget.id);
        flowChartActions.releaseBlock(event.relatedTarget.id);
        flowChartActions.deselectAllBlocks("deselect all blocks");
        flowChartActions.deselectAllEdges("deselect all edges");
      })
      .on('dragenter', (event) => {
        console.log(`WasteBin: ondragenter()`);
        this.handleOver(true);
      }).on('dragleave', (event) => {
      console.log(`WasteBin: ondragleave()`);
      this.handleOver(false);
    })
  }

  componentWillUnmount() {
    /*interact(ReactDOM.findDOMNode(this))
     .on('dropdeactivate', function (event)
     {
     event.target.classList.add('drop-deactivated');
     });
     */
  }


  render() {
    let color;
    if (this.state.isOver) {
      color = "primary";
    } else {
      color = 'action';
    }

    return (
      <Icon color={color} className={this.props.classes.bin}>
        delete_forever
      </Icon>
    );
  }
}


WasteBin.propTypes = {
  classes: PropTypes.object.isRequired,
};


export default withStyles(styles)(WasteBin);