import React from 'react';
import { connect } from 'react-redux';
import { withStyles } from '@material-ui/core/styles';
import { BaseWidget } from 'storm-react-diagrams';
import Typography from '@material-ui/core/Typography';
import { idSeparator } from '../layout.component';
import { malcolmSelectLink } from '../../malcolm/malcolmActionCreators';
import navigationActions from '../../malcolm/actions/navigation.actions';
import blockUtils from '../../malcolm/blockUtils';

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
    right: '100%',
    alignItems: 'center',
    marginRight: '-4px',
  },
  hiddenLinkLine: { fontSize: '20pt', whiteSpace: 'pre' },
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

    let portDisplay = (
      <div
        className={this.props.classes.port}
        style={{
          background:
            this.state.selected &&
            ((this.props.linkInProgress && this.props.canConnectToStartPort) ||
              !this.props.linkInProgress)
              ? portColour[100]
              : portColour[500],
        }}
        role="presentation"
      />
    );
    if (this.props.portBadge) {
      switch (this.props.portBadge[1]) {
        case 'plus':
          if (this.props.badgeValue) {
            portDisplay = (
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
                  width: '24px',
                }}
                role="presentation"
              >
                <Typography style={{ fontSize: '8pt' }}>
                  {`+${this.props.badgeValue}`}
                </Typography>
              </div>
            );
          }
          break;
        default:
          break;
      }
    }

    const port =
      this.props.portType === 'HIDDEN' ? (
        <div
          {...this.getProps()}
          onMouseDown={e => e.stopPropagation()}
          data-name={this.props.portName}
          data-nodeid={this.props.nodeId}
          role="presentation"
          style={{ maxWidth: '1px', paddingLeft: '4px', zIndex: -1 }}
        >
          <div className={this.props.classes.port} />
        </div>
      ) : (
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
          onMouseUp={() => {
            if (this.props.linkInProgress && this.props.canConnectToStartPort) {
              this.props.mouseDownHandler(this.props.portId, false);
            }
          }}
        >
          {portDisplay}
        </div>
      );
    const label =
      this.props.portType === 'HIDDEN' ? null : (
        <Typography className={this.props.classes.portLabel}>
          {this.props.portLabel}
        </Typography>
      );

    return (
      <div className={this.props.classes.container}>
        {this.props.inputPort ? port : label}
        {this.props.inputPort ? label : port}
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

const mapDispatchToProps = dispatch => ({
  linkClickHandler: id => {
    const idComponents = id.split(idSeparator);
    const blockMri = idComponents[2];
    const portName = idComponents[3];
    dispatch(navigationActions.updateChildPanelWithLink(blockMri, portName));
  },
  selectHandler: (id, isSelected) => {
    dispatch(malcolmSelectLink(id, isSelected));
  },
});

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
  const blockName = ownProps.portId.split(idSeparator)[0];
  const fieldName = ownProps.portId.split(idSeparator)[1];
  const attribute = blockUtils.findAttribute(
    state.malcolm.blocks,
    blockName,
    fieldName
  );
  let portBadge = null;
  let badgeValue = null;
  if (attribute && blockUtils.attributeHasTag(attribute, 'badgevalue')) {
    const ind = attribute.raw.meta.tags.findIndex(
      tag => tag.indexOf('badgevalue') > -1
    );
    if (ind > -1) {
      portBadge = attribute.raw.meta.tags[ind].split(':');
      const badgeBlock = portBadge.slice(3).join(':');
      const badgeAttr = blockUtils.findAttribute(
        state.malcolm.blocks,
        badgeBlock,
        portBadge[2]
      );
      if (badgeAttr) {
        badgeValue = badgeAttr.raw.value;
      }
    }
  }
  return {
    inputPort: port.in,
    portName: port.name,
    portLabel: port.label,
    portType: port.portType,
    hiddenLink: port.hiddenLink,
    isSelected: state.malcolm.layoutState.selectedLinks.some(
      a =>
        a.split(idSeparator)[2] === ownProps.portId.split(idSeparator)[0] &&
        a.split(idSeparator)[3] === ownProps.portId.split(idSeparator)[1]
    ),
    portBadge,
    badgeValue,
    portValue: port.value,
    linkInProgress:
      state.malcolm.layoutState.startPortForLink !== undefined &&
      state.malcolm.layoutState.endPortForLink === undefined,
    canConnectToStartPort,
    mouseDownHandler: state.malcolm.layoutEngine.portMouseDown,
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(
  withStyles(styles, { withTheme: true })(BlockPortWidget)
);
