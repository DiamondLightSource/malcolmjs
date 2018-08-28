import React from 'react';
import PropTypes from 'prop-types';
import renderHTML from 'react-render-html';
import { withStyles } from '@material-ui/core/styles';
import Typography from '@material-ui/core/Typography';
import Paper from '@material-ui/core/Paper';
import classNames from 'classnames';
import BlockPortWidget from '../blockPort/blockPortWidget.component';

const styles = theme => ({
  block: {
    position: 'relative',
    border: '2px solid rgba(0, 0, 0, 0)',
    borderRadius: 5,
  },
  selectedBlock: {
    borderColor: `${theme.palette.secondary.main} !important`,
  },
  title: {
    textAlign: 'center',
    marginTop: 2,
    marginBottom: 1,
    fontSize: 14,
  },
  blockContents: {
    display: 'flex',
    position: 'relative',
    alignItems: 'center',
    marginBottom: 3,
  },
  inputPortsContainer: {
    position: 'absolute',
    top: '50%',
    transform: 'translateY(-50%)',
    left: -8,
  },
  outputPortsContainer: {
    position: 'absolute',
    top: '50%',
    transform: 'translateY(-50%)',
    right: -8,
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'flex-end',
  },
  portContainer: {
    display: 'flex',
    alignItems: 'center',
  },
  iconContents: {
    flexGrow: 1,
    height: '100%',
    width: 120,
    opacity: 0.5,
    lineHeight: 0,
  },
  description: {
    width: 120,
    wordWrap: 'normal',
    textAlign: 'center',
    fontSize: 11,
    paddingLeft: 4,
    paddingRight: 4,
  },
});

const portHeight = 23;

const BlockWidget = props => {
  const inputPorts = Object.keys(props.node.ports).filter(
    p => props.node.ports[p].in
  );
  const outputPorts = Object.keys(props.node.ports).filter(
    p => !props.node.ports[p].in
  );

  const minHeight =
    Math.max(inputPorts.length, outputPorts.length) * portHeight;

  return (
    <Paper
      className={classNames(props.classes.block, {
        [props.classes.selectedBlock]: props.node.selected,
      })}
      elevation={8}
      onClick={e => props.node.clickHandler(e)}
      onMouseDown={() => props.node.mouseDownHandler(true)}
      onMouseUp={() => props.node.mouseDownHandler(false)}
    >
      <Typography className={props.classes.title}>
        {props.node.label}
      </Typography>
      <div className={props.classes.blockContents} style={{ minHeight }}>
        <div className={props.classes.inputPortsContainer}>
          {inputPorts.map(p => (
            <BlockPortWidget
              key={props.node.ports[p].id}
              nodeId={props.node.id}
              portId={p}
            />
          ))}
        </div>
        <div className={props.classes.iconContents}>
          {props.node.icon && props.node.icon !== '<svg/>'
            ? renderHTML(props.node.icon)
            : null}
        </div>
        <div className={props.classes.outputPortsContainer}>
          {outputPorts.map(p => (
            <BlockPortWidget
              key={props.node.ports[p].id}
              nodeId={props.node.id}
              portId={p}
            />
          ))}
        </div>
      </div>
      <Typography className={props.classes.description}>
        {props.node.description}
      </Typography>
    </Paper>
  );
};

BlockWidget.propTypes = {
  node: PropTypes.shape({
    id: PropTypes.string,
    label: PropTypes.string,
    icon: PropTypes.string,
    ports: PropTypes.shape({}),
    description: PropTypes.string,
    selected: PropTypes.bool,
    clickHandler: PropTypes.func,
    mouseDownHandler: PropTypes.func,
  }).isRequired,
  classes: PropTypes.shape({
    block: PropTypes.string,
    selectedBlock: PropTypes.string,
    title: PropTypes.string,
    blockContents: PropTypes.string,
    inputPortsContainer: PropTypes.string,
    outputPortsContainer: PropTypes.string,
    portContainer: PropTypes.string,
    iconContents: PropTypes.string,
    description: PropTypes.string,
  }).isRequired,
};

export default withStyles(styles, { withTheme: true })(BlockWidget);
