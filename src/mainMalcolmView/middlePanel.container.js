import React from 'react';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
import Button from '@material-ui/core/Button';
import PaletteIcon from '@material-ui/icons/Palette';
import ZoomIn from '@material-ui/icons/ZoomIn';
import ZoomOut from '@material-ui/icons/ZoomOut';
import ZoomToFit from '@material-ui/icons/ZoomOutMap';
import { connect } from 'react-redux';
import Tooltip from '@material-ui/core/Tooltip';
import IconButton from '@material-ui/core/IconButton';
import Typography from '@material-ui/core/Typography';
import { fade, emphasize } from '@material-ui/core/styles/colorManipulator';
import Layout from '../layout/layout.component';
import TableContainer from '../malcolmWidgets/table/table.container';
import AttributePlotter from '../malcolmWidgets/plotter/plotter.component';
import JSONTree from '../malcolmWidgets/jsonTree/jsonTree.component';
import MethodViewer from '../middlePanelViews/methodView/methodViewer.component';
import AttributeViewer from '../middlePanelViews/attributeView/attributeView.container';
import AttributeAlarm, {
  getAlarmState,
  AlarmStates,
} from '../malcolmWidgets/attributeDetails/attributeAlarm/attributeAlarm.component';
import blockUtils from '../malcolm/blockUtils';

import navigationActions from '../malcolm/actions/navigation.actions';
import LayoutBin from '../layout/layoutBin.component';
import ThemeEditor from './themeEditor';
import autoLayoutAction from '../malcolm/actions/autoLayout.action';
import {
  editThemeAction,
  setThemeAction,
  updateThemeAction,
} from '../viewState/viewState.actions';
import { malcolmClearLayoutSelect } from '../malcolm/malcolmActionCreators';
import { isArrayType } from '../malcolmWidgets/attributeDetails/attributeSelector/attributeSelector.component';
import layoutActions from '../malcolm/actions/layout.action';

const styles = theme => {
  const gridLineColor = fade(
    emphasize(theme.palette.background.default, 0.9),
    0.05
  );
  return {
    container: {
      marginTop: 64,
      height: '100%',
      width: '100%',
    },
    layoutArea: {
      display: 'flex',
      position: 'relative',
      width: '100%',
      height: '100%',
      backgroundColor: theme.palette.background.default,
      backgroundImage: `linear-gradient(0deg, transparent 24%, ${gridLineColor} 25%, ${gridLineColor} 26%, transparent 27%, transparent 74%, ${gridLineColor} 75%, ${gridLineColor} 76%, transparent 77%, transparent), linear-gradient(90deg, transparent 24%, ${gridLineColor} 25%, ${gridLineColor} 26%, transparent 27%, transparent 74%, ${gridLineColor} 75%, ${gridLineColor} 76%, transparent 77%, transparent)`,
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
    autoLayoutButton: {
      position: 'absolute',
    },
    tableContainer: {
      display: 'flex',
      position: 'relative',
      width: '100%',
      height: '100%',
      justifyContent: 'center',
      verticalAlign: 'middle',
    },
    plainBackground: {
      display: 'flex',
      width: '100%',
      minHeight: '100%',
      height: '100%',
      backgroundColor: theme.palette.background.paper,
      align: 'center',
    },
    button: {
      width: '24px',
      height: '24px',
      padding: 0,
      '&:hover': {
        backgroundColor: 'transparent',
      },
    },
  };
};

const getWidgetType = tags => {
  const widgetTagIndex = tags.findIndex(t => t.indexOf('widget:') !== -1);
  if (widgetTagIndex !== -1) {
    return tags[widgetTagIndex];
  }
  return -1;
};

const findAttributeComponent = props => {
  const transitionWithPanelStyle = {
    left: props.openParent ? 360 : 0,
    width: `calc(100% - ${(props.openChild ? 360 : 0) +
      (props.openParent ? 360 : 0)}px)`,
    // transition: 'width 1s, left 1s',
  };
  if (props.isMethod) {
    return (
      <div className={props.classes.plainBackground}>
        <div
          className={props.classes.tableContainer}
          style={transitionWithPanelStyle}
        >
          <MethodViewer
            attributeName={props.mainAttribute}
            blockName={props.parentBlock}
            subElement={props.mainAttributeSubElements}
            classes={props.classes}
            openParent={props.openParent}
            openChild={props.openChild}
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
  } else if (props.themeEditor) {
    return (
      <div className={props.classes.plainBackground}>
        <div
          className={props.classes.tableContainer}
          style={transitionWithPanelStyle}
        >
          <ThemeEditor
            setThemeProp={props.setThemeProp}
            openParent={props.openParent}
            finishEdit={props.closeThemeEditor}
          />
        </div>
      </div>
    );
  }
  const widgetTag = getWidgetType(props.tags);
  const palettePadding = props.showBin ? 4 : 32;
  let zoomButtonIndent = props.openParent ? 360 + 29 : 29;
  zoomButtonIndent = props.mobile ? 36 : zoomButtonIndent;
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
            style={{
              right: props.openChild ? 360 + palettePadding : palettePadding,
              bottom: palettePadding,
            }}
          >
            {props.showBin ? (
              <LayoutBin />
            ) : (
              <Button
                variant="fab"
                color="secondary"
                onClick={() => props.openPalette()}
                disabled={props.layoutLocked}
                data-cy="palettebutton"
              >
                <PaletteIcon style={{ fontSize: '36px' }} />
              </Button>
            )}
          </div>
          <div
            className={props.classes.autoLayoutButton}
            style={{ right: props.openChild ? 360 + 29 : 29, top: 12 }}
          >
            <Button
              color="primary"
              variant="raised"
              onClick={() => props.runAutoLayout()}
              disabled={props.layoutLocked || props.disableAutoLayout}
            >
              Auto layout
            </Button>
          </div>
          <div
            className={props.classes.autoLayoutButton}
            style={{
              left: zoomButtonIndent,
              top: 12,
              display: 'flex',
            }}
          >
            <div style={{ padding: 4 }}>
              <Button
                variant="fab"
                color="secondary"
                style={{ width: '36px', height: '36px', padding: 4 }}
                onClick={() => props.zoomInDirection('in')}
                disabled={props.layoutLocked || props.disableAutoLayout}
              >
                <ZoomIn style={{ fontSize: '24px' }} />
              </Button>
            </div>
            <div style={{ padding: 4 }}>
              <Button
                variant="fab"
                color="secondary"
                style={{ width: '36px', height: '36px', padding: 4 }}
                onClick={() => props.zoomInDirection('out')}
                disabled={props.layoutLocked || props.disableAutoLayout}
              >
                <ZoomOut style={{ fontSize: '24px' }} />
              </Button>
            </div>
            <div style={{ padding: 4 }}>
              <Button
                variant="fab"
                color="secondary"
                style={{ width: '36px', height: '36px', padding: 4 }}
                onClick={() =>
                  props.zoomToFit(props.openParent, props.openChild)
                }
                disabled={props.layoutLocked || props.disableAutoLayout}
              >
                <ZoomToFit style={{ fontSize: '24px' }} />
              </Button>
            </div>
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
    case 'widget:multilinetextupdate':
    case 'widget:textinput':
    case 'widget:led':
    case 'widget:checkbox':
    case 'widget:combo':
      if (!isArrayType({ typeid: props.typeid })) {
        return (
          <div className={props.classes.plainBackground}>
            <div
              className={props.classes.tableContainer}
              style={transitionWithPanelStyle}
            >
              <AttributeViewer
                attributeName={props.mainAttribute}
                blockName={props.parentBlock}
                widgetTag={widgetTag}
                typeId={props.typeid}
                // openPanels={{ parent: props.openParent, child: props.openChild }}
              />
            </div>
          </div>
        );
      }
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

    case 'widget:tree':
      return (
        <div className={props.classes.plainBackground}>
          <div
            className={props.classes.tableContainer}
            style={{ ...transitionWithPanelStyle, textAlign: 'left' }}
          />
          <JSONTree
            attributeName={props.mainAttribute}
            blockName={props.parentBlock}
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
      );

    case 'widget:plot':
      return (
        <div className={props.classes.plainBackground}>
          <div
            className={props.classes.tableContainer}
            style={transitionWithPanelStyle}
          >
            <AttributePlotter
              attributeName={props.mainAttribute}
              blockName={props.parentBlock}
            />
          </div>
        </div>
      );

    default:
      return (
        <div
          className={props.classes.plainBackground}
          style={{
            justifyContent: 'center',
            flexDirection: 'column',
            width: '100%',
            height: '100%',
            textAlign: 'center',
            verticalAlign: 'middle',
          }}
        >
          <Typography style={{ fontSize: '20pt' }}>
            {`Unable to display attribute "${props.mainAttribute}"`}
          </Typography>
          <Typography style={{ fontSize: '20pt' }}>
            No valid widget tag found!
          </Typography>
        </div>
      );
  }
};

const MiddlePanelContainer = props => (
  <div
    className={props.classes.container}
    role="presentation"
    style={props.mobile && !props.openHeader ? { marginTop: 0 } : {}}
  >
    {props.mainAttribute ? (
      findAttributeComponent(props)
    ) : (
      <div
        className={props.classes.plainBackground}
        style={{
          justifyContent: 'center',
          flexDirection: 'column',
          width: '100%',
          height: '100%',
          textAlign: 'center',
          verticalAlign: 'middle',
        }}
      >
        <Typography style={{ fontSize: '20pt' }}>
          {props.parentBlock
            ? 'Please select a field to view from the left hand pane'
            : 'Please select a root block to view from the top navigation bar'}
        </Typography>
      </div>
    )}
  </div>
);

const mapStateToProps = (state, ownProps) => {
  const attribute = ownProps.mri
    ? blockUtils.findAttribute(
        state.malcolm.blocks,
        ownProps.mri[0],
        ownProps.mri[1]
      )
    : blockUtils.findAttribute(
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
    parentBlock: ownProps.mri ? ownProps.mri[0] : state.malcolm.parentBlock,
    mainAttribute: ownProps.mri ? ownProps.mri[1] : state.malcolm.mainAttribute,
    mainAttributeAlarmState: alarm,
    mainAttributeSubElements: state.malcolm.mainAttributeSubElements,
    openParent: ownProps.mobile ? false : state.viewState.openParentPanel,
    openChild: ownProps.mobile ? false : state.malcolm.childBlock !== undefined,
    openHeader: state.viewState.openHeaderBar,
    isMethod: attribute && attribute.raw.typeid === 'malcolm:core/Method:1.1',
    tags: attribute && attribute.raw.meta ? attribute.raw.meta.tags : [],
    typeid: attribute && attribute.raw.meta ? attribute.raw.meta.typeid : '',
    showBin: state.malcolm.layoutState.showBin,
    disableAutoLayout:
      state.malcolm.layout && state.malcolm.layout.blocks.length === 0,
    layoutLocked: state.malcolm.layout && state.malcolm.layout.locked,
    themeEditor: state.viewState.themeEditor,
  };
};

const mapDispatchToProps = dispatch => ({
  openPalette: () => {
    dispatch(malcolmClearLayoutSelect());
    dispatch(navigationActions.navigateToPalette());
  },
  runAutoLayout: () => dispatch(autoLayoutAction.runAutoLayout()),
  setThemeProp: (property, value) => {
    dispatch(setThemeAction(property, value));
    dispatch(updateThemeAction());
  },
  closeThemeEditor: () => dispatch(editThemeAction(false)),
  zoomToFit: (openParent, openChild) =>
    dispatch(layoutActions.zoomToFit(openParent, openChild)),
  zoomInDirection: direction =>
    dispatch(layoutActions.zoomInDirection(direction)),
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
  zoomToFit: PropTypes.func.isRequired,
  zoomInDirection: PropTypes.func.isRequired,
};

MiddlePanelContainer.propTypes = {
  mainAttribute: PropTypes.string.isRequired,
  classes: PropTypes.shape({
    container: PropTypes.string,
    plainBackground: PropTypes.string,
  }).isRequired,
  parentBlock: PropTypes.string.isRequired,
  mobile: PropTypes.bool.isRequired,
  openHeader: PropTypes.bool.isRequired,
};

export default connect(mapStateToProps, mapDispatchToProps)(
  withStyles(styles, { withTheme: true })(MiddlePanelContainer)
);
