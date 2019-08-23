import React from 'react';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
import Typography from '@material-ui/core/Typography';
import CircularProgress from '@material-ui/core/CircularProgress';
import Paper from '@material-ui/core/Paper';
import classNames from 'classnames';
import renderHTML from 'react-render-html';
import BlockPortWidget from '../blockPort/blockPortWidget.component';
import AttributeAlarm, {
  AlarmStates,
} from '../../malcolmWidgets/attributeDetails/attributeAlarm/attributeAlarm.component';
import AttributeSelector from '../../malcolmWidgets/attributeDetails/attributeSelector/attributeSelector.component';
import { hiddenLinkIdSeparator } from '../../malcolm/reducer/layout/layout.reducer';

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
    flex: 'auto',
  },
  blockContents: {
    display: 'flex',
    position: 'relative',
    alignItems: 'center',
    marginBottom: 3,
    justifyContent: 'center',
  },
  inputPortsContainer: {
    position: 'absolute',
    top: '50%',
    transform: 'translateY(-50%)',
    left: -12,
  },
  outputPortsContainer: {
    position: 'absolute',
    top: '50%',
    transform: 'translateY(-50%)',
    right: -12,
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'flex-end',
  },
  portContainer: {
    display: 'flex',
    alignItems: 'center',
  },
  iconContents: {
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
  loadingContainer: {
    width: 120,
    height: 80,
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
  },
  alarmDiv: {
    position: 'absolute',
    top: 2,
    left: 2,
  },
});

const portHeight = 23;

const LoadingBlock = props => (
  <Paper
    className={classNames(props.classes.block, {
      [props.classes.selectedBlock]: props.node.selected,
    })}
    elevation={8}
  >
    <Typography className={props.classes.title}>{props.node.label}</Typography>
    <div className={props.classes.loadingContainer}>
      <CircularProgress size={30} />
    </div>
  </Paper>
);

const BlockWidget = props => {
  const inputPorts = Object.keys(props.node.ports).filter(
    p => props.node.ports[p].in
  );
  const outputPorts = Object.keys(props.node.ports).filter(
    p => !props.node.ports[p].in
  );

  const minHeight =
    Math.max(inputPorts.length, outputPorts.length) * portHeight;

  let blockGraphic =
    props.node.icon && props.node.icon !== '<svg/>'
      ? renderHTML(props.node.icon)
      : null;
  blockGraphic = props.node.displayAttribute ? (
    <div style={{ width: '80%', marginLeft: '16px' }}>
      <AttributeSelector
        blockName={props.node.displayAttribute[0]}
        attributeName={props.node.displayAttribute[1]}
      />
    </div>
  ) : (
    blockGraphic
  );

  const block = props.node.loading ? (
    <LoadingBlock classes={props.classes} node={props.node} />
  ) : (
    <Paper
      className={classNames(props.classes.block, {
        [props.classes.selectedBlock]: props.node.selected,
      })}
      elevation={8}
      onClick={e => props.node.clickHandler(e)}
      onMouseDown={e => {
        if (!e.isPortClick) {
          props.node.mouseDownHandler(true);
        }
      }}
      onMouseUp={() => props.node.mouseDownHandler(false)}
    >
      {props.node.alarmState !== AlarmStates.NO_ALARM ? (
        <div className={props.classes.alarmDiv} style={{ zIndex: 999 }}>
          <div
            style={{ zIndex: 1000, position: 'absolute', top: 0, left: 1.856 }}
          >
            <AttributeAlarm alarmSeverity={props.node.alarmState} />
          </div>
          <div style={{ zIndex: 999, position: 'absolute', top: 0 }}>
            <svg height="28" width="28">
              <circle
                cx="13.856"
                cy="13.856"
                r="13.856"
                fill={props.theme.palette.background.paper}
                fillOpacity={0.6}
              />
            </svg>
          </div>
        </div>
      ) : null}
      <div
        style={{
          display: 'flex',
          justifyContent: 'center',
          position: 'relative',
          top: 2,
        }}
      >
        <Typography className={props.classes.title}>
          {props.node.label}
        </Typography>
      </div>
      <div className={props.classes.blockContents} style={{ minHeight }}>
        <div className={props.classes.iconContents}>{blockGraphic}</div>
        <div className={props.classes.inputPortsContainer}>
          {inputPorts.map(p => (
            <BlockPortWidget
              key={props.node.ports[p].id}
              nodeId={props.node.id}
              portId={p}
            />
          ))}
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
  return props.node.isHiddenLink ? (
    <div
      style={{ display: 'flex', position: 'relative', maxWidth: '5px' }}
      onClick={e => props.node.clickHandler(e)}
      role="presentation"
    >
      <div style={{ position: 'absolute', right: '100%' }}>
        <Typography>
          {props.node.label.split(hiddenLinkIdSeparator)[0]}
        </Typography>
      </div>
      {outputPorts.map(p => (
        <div style={{ position: 'absolute', left: '100%' }}>
          <BlockPortWidget
            key={props.node.ports[p].id}
            nodeId={props.node.id}
            portId={p}
          />
        </div>
      ))}
    </div>
  ) : (
    block
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
    loading: PropTypes.bool,
    isHiddenLink: PropTypes.bool,
    clickHandler: PropTypes.func,
    mouseDownHandler: PropTypes.func,
    alarmState: PropTypes.number,
    displayAttribute: PropTypes.arrayOf(PropTypes.string),
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
    alarmDiv: PropTypes.string,
  }).isRequired,
  theme: PropTypes.shape({
    palette: PropTypes.shape({
      background: PropTypes.shape({
        paper: PropTypes.string,
      }),
    }),
  }).isRequired,
};

LoadingBlock.propTypes = {
  node: PropTypes.shape({
    label: PropTypes.string,
    selected: PropTypes.bool,
    isHidden: PropTypes.bool,
  }).isRequired,
  classes: PropTypes.shape({
    block: PropTypes.string,
    selectedBlock: PropTypes.string,
    title: PropTypes.string,
    loadingContainer: PropTypes.string,
  }).isRequired,
};

export default withStyles(styles, { withTheme: true })(BlockWidget);
