import React from 'react';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
import Button from '@material-ui/core/Button';
import AddIcon from '@material-ui/icons/Add';
import { connect } from 'react-redux';
import Tooltip from '@material-ui/core/Tooltip';
import IconButton from '@material-ui/core/IconButton';
import JSONInput from 'react-json-editor-ajrm';
import Layout from '../layout/layout.component';
import TableContainer from '../malcolmWidgets/table/table.container';
// import AttributeViewer from '../attributeView/attributeView.container';
import MethodViewer from '../malcolmWidgets/method/methodViewer.component';
import AttributeAlarm, {
  getAlarmState,
  AlarmStates,
} from '../malcolmWidgets/attributeDetails/attributeAlarm/attributeAlarm.component';
import blockUtils from '../malcolm/blockUtils';

import navigationActions from '../malcolm/actions/navigation.actions';
import LayoutBin from '../layout/layoutBin.component';

const styles = theme => ({
  container: {
    marginTop: 64,
    height: '100%',
    width: '100%',
  },
  layoutArea: {
    display: 'flex',
    position: 'relative',
    width: '100%',
    height: 'calc(100vh - 64px)',
    backgroundColor: theme.palette.background.default,
    backgroundImage:
      'linear-gradient(0deg, transparent 24%, rgba(255, 255, 255, 0.05) 25%, rgba(255, 255, 255, 0.05) 26%, transparent 27%, transparent 74%, rgba(255, 255, 255, 0.05) 75%, rgba(255, 255, 255, 0.05) 76%, transparent 77%, transparent), linear-gradient(90deg, transparent 24%, rgba(255, 255, 255, 0.05) 25%, rgba(255, 255, 255, 0.05) 26%, transparent 27%, transparent 74%, rgba(255, 255, 255, 0.05) 75%, rgba(255, 255, 255, 0.05) 76%, transparent 77%, transparent)',
    backgroundSize: '50px 50px',
  },
  alarm: {
    display: 'flex',
    alignItems: 'center',
    position: 'absolute',
  },
  alarmText: {
    marginRight: 5,
  },
  paletteButton: {
    position: 'absolute',
  },
  tableContainer: {
    display: 'flex',
    position: 'absolute',
    height: 'calc(100vh - 64px)',
    align: 'center',
    verticalAlign: 'middle',
  },
  plainBackground: {
    display: 'flex',
    width: '100%',
    minHeight: 'calc(100vh - 64px)',
    backgroundColor: theme.palette.background.paper,
    align: 'center',
  },
  button: {
    width: '22px',
    height: '22px',
    '&:hover': {
      backgroundColor: 'transparent',
    },
  },
});

const getWidgetType = tags => {
  const widgetTagIndex = tags.findIndex(t => t.indexOf('widget:') !== -1);
  if (widgetTagIndex !== -1) {
    return tags[widgetTagIndex];
  }
  return -1;
};

const findAttributeComponent = props => {
  if (props.isMethod) {
    return (
      <div className={props.classes.plainBackground}>
        <MethodViewer
          attributeName={props.mainAttribute}
          blockName={props.parentBlock}
          subElement={props.mainAttributeSubElements}
          classes={props.classes}
          openParent={props.openParent}
          openChild={props.openChild}
        />
      </div>
    );
  }
  const widgetTag = getWidgetType(props.tags);
  const transitionWithPanelStyle = {
    left: props.openParent ? 360 : 0,
    width: `calc(100% - ${(props.openChild ? 360 : 0) +
      (props.openParent ? 360 : 0)}px)`,
    // transition: 'width 1s, left 1s',
  };
  switch (widgetTag) {
    case 'widget:flowgraph':
      return (
        <div className={props.classes.layoutArea}>
          <Layout />
          <div
            className={props.classes.alarm}
            style={{ left: props.openParent ? 360 + 29 : 29, bottom: 12 }}
          >
            <AttributeAlarm alarmSeverity={props.mainAttributeAlarmState} />
          </div>
          <div
            className={props.classes.paletteButton}
            style={{ right: props.openChild ? 360 + 29 : 29, bottom: 12 }}
          >
            {props.showBin ? (
              <LayoutBin />
            ) : (
              <Button
                variant="fab"
                color="secondary"
                onClick={() => props.openPalette()}
              >
                <AddIcon />
              </Button>
            )}
          </div>
        </div>
      );
    case 'widget:table':
      return (
        <div className={props.classes.plainBackground}>
          <div
            className={props.classes.tableContainer}
            style={transitionWithPanelStyle}
          >
            <TableContainer
              attributeName={props.mainAttribute}
              blockName={props.parentBlock}
              subElement={props.mainAttributeSubElements}
              footerItems={[
                <Tooltip id="1" title={props.errorMessage} placement="right">
                  <IconButton className={props.classes.button} disableRipple>
                    <AttributeAlarm
                      alarmSeverity={props.mainAttributeAlarmState}
                    />
                  </IconButton>
                </Tooltip>,
              ]}
            />
          </div>
        </div>
      );
    case 'widget:textupdate':
    case 'widget:textinput':
    case 'widget:led':
    case 'widget:checkbox':
    case 'widget:combo':
      return (
        <div className={props.classes.plainBackground}>
          <div
            className={props.classes.tableContainer}
            style={transitionWithPanelStyle}
          />
        </div>
      );
    case 'widget:tree':
      return (
        <div className={props.classes.plainBackground}>
          <div
            className={props.classes.tableContainer}
            style={{ ...transitionWithPanelStyle, textAlign: 'left' }}
          >
            <JSONInput
              id={[props.parentBlock, props.mainAttribute]}
              height="100%"
              width="100%"
              style={{ body: { fontSize: '150%' } }}
            />
          </div>
        </div>
      );
    default:
      return <div className={props.classes.plainBackground} />;
  }
};

const MiddlePanelContainer = props => (
  <div className={props.classes.container} role="presentation">
    {findAttributeComponent(props)}
  </div>
);

const mapStateToProps = state => {
  const attribute = blockUtils.findAttribute(
    state.malcolm.blocks,
    state.malcolm.parentBlock,
    state.malcolm.mainAttribute
  );

  let alarm = AlarmStates.PENDING;
  let errorMessage;
  if (attribute) {
    alarm = getAlarmState(attribute);
    alarm =
      state.malcolm.layout && state.malcolm.layout.blocks.some(b => b.loading)
        ? AlarmStates.PENDING
        : alarm;
    errorMessage = attribute.calculated.errorState
      ? attribute.calculated.errorMessage
      : '';
  }
  return {
    errorMessage,
    parentBlock: state.malcolm.parentBlock,
    mainAttribute: state.malcolm.mainAttribute,
    mainAttributeAlarmState: alarm,
    mainAttributeSubElements: state.malcolm.mainAttributeSubElements,
    openParent: state.viewState.openParentPanel,
    openChild: state.malcolm.childBlock !== undefined,
    isMethod: attribute && attribute.raw.typeid === 'malcolm:core/Method:1.0',
    tags: attribute && attribute.raw.meta ? attribute.raw.meta.tags : [],
    typeId: attribute && attribute.raw.meta ? attribute.raw.meta.typeid : '',
    showBin: state.malcolm.layoutState.showBin,
  };
};

const mapDispatchToProps = dispatch => ({
  openPalette: () => dispatch(navigationActions.navigateToPalette()),
});

findAttributeComponent.propTypes = {
  mainAttribute: PropTypes.string.isRequired,
  tags: PropTypes.arrayOf(PropTypes.string).isRequired,
  typeId: PropTypes.string.isRequired,
  mainAttributeAlarmState: PropTypes.number.isRequired,
  mainAttributeSubElements: PropTypes.arrayOf(PropTypes.string).isRequired,
  openParent: PropTypes.bool.isRequired,
  openChild: PropTypes.bool.isRequired,
  errorMessage: PropTypes.string.isRequired,
  classes: PropTypes.shape({
    button: PropTypes.string,
    layoutArea: PropTypes.string,
    alarm: PropTypes.string,
    alarmText: PropTypes.string,
    tableContainer: PropTypes.string,
    plainBackground: PropTypes.string,
  }).isRequired,
  openPalette: PropTypes.func.isRequired,
};

MiddlePanelContainer.propTypes = {
  classes: PropTypes.shape({
    container: PropTypes.string,
  }).isRequired,
};

export default connect(mapStateToProps, mapDispatchToProps)(
  withStyles(styles, { withTheme: true })(MiddlePanelContainer)
);
