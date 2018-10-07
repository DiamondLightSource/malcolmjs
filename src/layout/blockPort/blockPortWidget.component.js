import React from 'react';
import { connect } from 'react-redux';
import { withStyles } from '@material-ui/core/styles';
import { BaseWidget } from 'storm-react-diagrams';
import Typography from '@material-ui/core/Typography';

const styles = () => ({
  container: {
    position: 'relative',
    display: 'flex',
    alignItems: 'center',
    height: 20,
  },
  portDropZone: {
    width: 20,
    height: 20,
    borderRadius: 10,
    // backgroundColor: 'yellow',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 10,
    border: 'dashed 2px rgba(0,0,0,0)',
  },
  port: {
    width: 12,
    height: 12,
    borderRadius: 6,
  },
  portIn: {
    marginRight: 0,
  },
  portOut: {
    marginLeft: 0,
  },
  portLabel: {
    fontSize: 12,
  },
  hiddenLink: {
    position: 'absolute',
    display: 'flex',
    flexDirection: 'column',
    paddingRight: 10,
    borderBottom: '3px dashed rgba(255,255,255,0.5)',
    right: '100%',
    bottom: '40%',
  },
  hiddenLinkLine: {
    width: '100%',
  },
});

class BlockPortWidget extends BaseWidget {
  constructor(props) {
    super('malcolm-port', props);
    this.state = {
      selected: false,
    };
  }

  getClassName() {
    return `port ${this.props.classes.portDropZone} ${super.getClassName()}${
      this.state.selected ? this.bem('--selected') : ''
    }`;
  }

  render() {
    const portColour =
      this.props.theme.portColours[this.props.portType] ||
      this.props.theme.palette.primary;

    const portStyle = {
      ...(this.props.inputPort ? styles().portIn : styles().portOut),
      borderColor:
        this.props.linkInProgress &&
        this.props.canConnectToStartPort &&
        this.state.selected
          ? this.props.theme.palette.secondary.main
          : 'rgba(0,0,0,0)',
    };

    const hiddenLink = (
      <div className={this.props.classes.hiddenLink}>
        <Typography>{this.props.portValue}</Typography>
      </div>
    );
    const port = (
      <div
        className={this.props.classes.portDropZone}
        style={portStyle}
        onMouseEnter={() => {
          this.setState({ selected: true });
        }}
        onMouseLeave={() => {
          this.setState({ selected: false });
        }}
        role="presentation"
        {...this.getProps()}
        data-name={this.props.portName}
        data-nodeid={this.props.nodeId}
        onMouseDown={e => {
          e.isPortClick = true;
          this.props.mouseDownHandler(this.props.portId, true);
        }}
        onMouseUp={() => this.props.mouseDownHandler(this.props.portId, false)}
      >
        <div
          className={this.props.classes.port}
          style={{
            background:
              this.state.selected &&
              ((this.props.linkInProgress &&
                this.props.canConnectToStartPort) ||
                !this.props.linkInProgress)
                ? portColour[100]
                : portColour[500],
          }}
          role="presentation"
        />
      </div>
    );
    const label = (
      <Typography className={this.props.classes.portLabel}>
        {this.props.portLabel}
      </Typography>
    );

    return (
      <div className={this.props.classes.container}>
        {this.props.inputPort && this.props.hiddenLink ? hiddenLink : null}
        {this.props.inputPort ? port : label}
        {this.props.inputPort ? label : port}
        {!this.props.inputPort && this.props.hiddenLink ? hiddenLink : null}
      </div>
    );
  }
}

const defaultPort = {
  in: false,
  portName: '',
  portLabel: '',
  portType: '',
  hiddenLink: false,
  value: '',
};

export const mapStateToProps = (state, ownProps) => {
  const allNodes = state.malcolm.layoutEngine.diagramModel.nodes;
  const node = allNodes[ownProps.nodeId];
  const port = node ? node.ports[ownProps.portId] : defaultPort;

  let canConnectToStartPort = false;
  if (state.malcolm.layoutState.startPortForLink) {
    const matchingNode = Object.values(allNodes).find(
      n => n.ports[state.malcolm.layoutState.startPortForLink]
    );
    if (matchingNode) {
      const startPort =
        matchingNode.ports[state.malcolm.layoutState.startPortForLink];
      canConnectToStartPort = !(
        startPort.in === port.in || startPort.portType !== port.portType
      );
    }
  }

  return {
    inputPort: port.in,
    portName: port.name,
    portLabel: port.label,
    portType: port.portType,
    hiddenLink: port.hiddenLink,
    portValue: port.value,
    linkInProgress:
      state.malcolm.layoutState.startPortForLink !== undefined &&
      state.malcolm.layoutState.endPortForLink === undefined,
    canConnectToStartPort,
    mouseDownHandler: state.malcolm.layoutEngine.portMouseDown,
  };
};

export default connect(mapStateToProps)(
  withStyles(styles, { withTheme: true })(BlockPortWidget)
);
