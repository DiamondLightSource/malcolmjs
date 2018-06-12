import React from 'react';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
import Typography from '@material-ui/core/Typography';
import Paper from '@material-ui/core/Paper';
import BlockPortWidget from '../blockPort/blockPortWidget.component';

const styles = {
  block: {
    position: 'relative',
    border: '1px solid rgba(0, 0, 0, 0)',
    borderRadius: 5,
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
    width: 120,
    flexGrow: 1,
    opacity: 0.35,
  },
  description: {
    width: 120,
    wordWrap: 'normal',
    textAlign: 'center',
    fontSize: 11,
  },
};

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
      className={props.classes.block}
      elevation={8}
      onClick={e => props.node.clickHandler(e)}
    >
      <Typography className={props.classes.title}>
        {props.node.label}
      </Typography>
      <div className={props.classes.blockContents} style={{ minHeight }}>
        <div className={props.classes.inputPortsContainer}>
          {inputPorts.map(p => (
            <BlockPortWidget
              key={props.node.ports[p].name}
              port={props.node.ports[p]}
              portColour={props.theme.palette.primary.main}
              node={props.node}
            />
          ))}
        </div>
        <div className={props.classes.iconContents}>
          {props.node.icon === '<svg/>' ? (
            <span />
          ) : (
            <span dangerouslySetInnerHTML={{ __html: props.node.icon }} />
          )}
        </div>
        <div className={props.classes.outputPortsContainer}>
          {outputPorts.map(p => (
            <BlockPortWidget
              key={props.node.ports[p].name}
              port={props.node.ports[p]}
              portColour={props.theme.palette.primary.main}
              node={props.node}
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
    label: PropTypes.string,
    icon: PropTypes.string,
    ports: PropTypes.shape({}),
    description: PropTypes.string,
    clickHandler: PropTypes.func,
  }).isRequired,
  classes: PropTypes.shape({
    block: PropTypes.string,
    title: PropTypes.string,
    blockContents: PropTypes.string,
    inputPortsContainer: PropTypes.string,
    outputPortsContainer: PropTypes.string,
    portContainer: PropTypes.string,
    iconContents: PropTypes.string,
    description: PropTypes.string,
  }).isRequired,
  theme: PropTypes.shape({
    palette: PropTypes.shape({
      primary: PropTypes.shape({
        main: PropTypes.string,
      }),
    }),
  }).isRequired,
};

export default withStyles(styles, { withTheme: true })(BlockWidget);
