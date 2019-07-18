import React from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import { withTheme } from '@material-ui/core/styles';
import Typography from '@material-ui/core/Typography';
import Loadable from 'react-loadable';
import blockUtils from '../../malcolm/blockUtils';
import { isArrayType } from '../attributeDetails/attributeSelector/attributeSelector.component';
import navigationActions from '../../malcolm/actions/navigation.actions';
import NavTypes from '../../malcolm/NavTypes';
import {
  malcolmUpdateTable,
  malcolmSetFlag,
} from '../../malcolm/malcolmActionCreators';
import WidgetTable from '../table/virtualizedTable.component';
import ComboBox from '../comboBox/muiCombobox.component';
import TextInput from '../textInput/WidgetTextInput.component';
import TabbedPanel from '../../middlePanelViews/tabbedMiddlePanel.component';

const LoadablePlotter = Loadable({
  loader: () => import('../../middlePanelViews/plotter.component'),
  loading: () => <Typography>Loading...</Typography>,
});

const updatePlotData = (attribute, nPoints, yData, xData, yAxis) => {
  const dataElement = {
    x: [],
    y: [],
    type: 'scatter',
    mode: 'lines+points',
    //  line: { shape: 'hv' },
  };
  if (yData) {
    const points = nPoints || attribute.raw.value[yData].length;
    dataElement.y = attribute.raw.value[yData].slice(0, points);
    dataElement.x =
      xData && attribute.raw.value[xData]
        ? attribute.raw.value[xData].slice(0, points)
        : attribute.raw.value[yData].slice(0, points).map((val, ind) => ind);
    dataElement.name = yData;
    dataElement.visible = attribute.raw.value[yData]
      .slice(0, points)
      .map(() => true);
  } else if (isArrayType(attribute.raw.meta)) {
    const points = nPoints || attribute.raw.value.length;
    dataElement.y = attribute.raw.value.slice(0, points);
    dataElement.x = attribute.raw.value.slice(0, points).map((val, ind) => ind);
    dataElement.visible = attribute.raw.value.slice(0, points).map(() => true);
  }
  if (yAxis) {
    dataElement.yaxis = yAxis;
  }
  return dataElement;
};

export const deriveStateFromProps = (props, state, xData, y1Data, y2Data) => {
  const { layout } = state;
  if (props.attribute && props.attribute.raw) {
    const newData = [];
    if (y1Data.length > 0) {
      y1Data.forEach((yData, ind) => {
        newData[ind] = updatePlotData(
          props.attribute,
          props.nPoints,
          yData,
          xData[0]
        );
      });
    } else if (isArrayType(props.attribute.raw.meta)) {
      newData[0] = updatePlotData(props.attribute, props.nPoints);
    }
    if (y2Data.length > 0) {
      y2Data.forEach((yData, ind) => {
        newData[ind + y1Data.length] = updatePlotData(
          props.attribute,
          props.nPoints,
          yData,
          xData[0],
          'y2'
        );
      });
    }
    layout.datarevision += 1;
    const xDisplay =
      xData.length > 0 && xData[0]
        ? props.attribute.raw.meta.elements[xData[0]].display
        : {};
    let y1Display;
    let y2Display;
    if (y1Data.length > 0 && y1Data[0]) {
      y1Display = props.attribute.raw.meta.elements[y1Data[0]].display;
    } else if (isArrayType(props.attribute.raw.meta)) {
      y1Display = props.attribute.raw.meta.display;
    }
    if (y2Data.length > 0 && y2Data[0]) {
      y2Display = props.attribute.raw.meta.elements[y2Data[0]].display;
    }
    layout.xaxis.range = undefined;
    layout.yaxis.range = undefined;
    layout.yaxis2.range = undefined;
    if (xDisplay && xDisplay.limitLow !== xDisplay.limitHigh) {
      layout.xaxis = {
        ...layout.xaxis,
        range: [xDisplay.limitLow, xDisplay.limitHigh],
      };
    }
    if (y1Display && y1Display.limitLow !== y1Display.limitHigh) {
      layout.yaxis = {
        ...layout.yaxis,
        range: [y1Display.limitLow, y1Display.limitHigh],
      };
    }
    if (y2Display && y2Display.limitLow !== y2Display.limitHigh) {
      layout.yaxis2 = {
        ...layout.yaxis2,
        range: [y2Display.limitLow, y2Display.limitHigh],
      };
    }
    return {
      ...state,
      data: [...newData],
      layout,
    };
  }
  return state;
};

const findDataColumn = (attribute, axis) => {
  if (isArrayType(attribute.raw.meta)) {
    return '';
  } else if (attribute.calculated) {
    return attribute.calculated[`plotAs${axis}`] || [];
  }
  return '';
};

// const hasAxesToPlot = attribute => {
//   if (isArrayType(attribute.raw.meta)) {
//     return true;
//   } else if (attribute.calculated) {
//     return (
//       Object.keys(attribute.calculated).filter(
//         flag =>
//           typeof flag === 'string' &&
//           flag.indexOf('plotAs') !== -1 &&
//           attribute.calculated[flag] !== ''
//       ).length > 1
//     );
//   }
//   return false;
// };

const WidgetPlotContainer = props => {
  const pad = child => (
    <div style={{ padding: '4px', flexGrow: 1 }}>{child}</div>
  );
  const labels = isArrayType(props.attribute.raw.meta)
    ? ['val']
    : Object.keys(props.attribute.raw.meta.elements);
  const xSet = findDataColumn(props.attribute, 'X');
  const y1Set = findDataColumn(props.attribute, 'Y1');
  const y2Set = findDataColumn(props.attribute, 'Y2');
  const axesSelectors = isArrayType(props.attribute.raw.meta)
    ? []
    : [
        pad(<Typography>X: </Typography>),
        pad(
          <ComboBox
            Multi
            Choices={[...labels]}
            Value={xSet.length > 0 ? xSet : []}
            selectEventHandler={event => {
              props.setFlag(
                props.attribute.calculated.path,
                'plotAsX',
                event.target.value.slice(-1)
              );
            }}
          />
        ),
        pad(<Typography>Y1: </Typography>),
        pad(
          <ComboBox
            Multi
            Choices={[...labels]}
            Value={y1Set.length > 0 ? y1Set : []}
            selectEventHandler={event => {
              props.setFlag(
                props.attribute.calculated.path,
                'plotAsY1',
                event.target.value
              );
            }}
          />
        ),
        pad(<Typography>Y2: </Typography>),
        pad(
          <ComboBox
            Multi
            Choices={[...labels]}
            Value={y2Set.length > 0 ? y2Set : []}
            selectEventHandler={event => {
              props.setFlag(
                props.attribute.calculated.path,
                'plotAsY2',
                event.target.value
              );
            }}
          />
        ),
      ];
  const footerItems = [
    ...props.footerItems,
    ...axesSelectors,
    pad(<Typography>N Points: </Typography>),
    pad(
      <TextInput
        submitEventHandler={event => {
          props.setFlag(
            props.attribute.calculated.path,
            'nPoints',
            parseInt(event.target.value, 10)
          );
        }}
        setFlag={() => {}}
      />
    ),
  ];
  const TAB_LABELS = ['Data Table', 'Plot'];
  return (
    <div style={{ width: '100%', height: '100%' }}>
      <TabbedPanel
        tabLabels={TAB_LABELS}
        defaultTab={1}
        blockName={props.blockName}
        attributeName={props.attributeName}
        alwaysUpdate
      >
        <WidgetTable
          attribute={props.attribute}
          eventHandler={props.eventHandler}
          setFlag={props.setFlag}
          showFooter
          addRow={props.addRow}
          infoClickHandler={props.infoClickHandler}
          rowClickHandler={props.rowClickHandler}
          closePanelHandler={props.closePanelHandler}
          selectedRow={props.selectedRow}
        />
        <div style={{ height: 'calc(100% - 40px)' }}>
          <LoadablePlotter
            blockName={props.blockName}
            attributeName={props.attributeName}
            deriveState={(ownProps, state) =>
              deriveStateFromProps(
                ownProps,
                state,
                findDataColumn(props.attribute, 'X'),
                findDataColumn(props.attribute, 'Y1'),
                findDataColumn(props.attribute, 'Y2')
              )
            }
            nPoints={props.attribute.calculated.nPoints}
            useRaw
          />
          <div
            style={{
              display: 'flex',
              position: 'bottom',
              padding: '4px',
              alignItems: 'center',
            }}
          >
            {footerItems}
          </div>
        </div>
      </TabbedPanel>
    </div>
  );
};

const mapStateToProps = (state, ownProps) => {
  let attribute;
  if (ownProps.attributeName && ownProps.blockName) {
    attribute = blockUtils.findAttribute(
      state.malcolm.blocks,
      ownProps.blockName,
      ownProps.attributeName
    );
  }
  let subElement;
  let selectedRow;
  const navLists = state.malcolm.navigation.navigationLists.slice(-3);
  const blockIndex = navLists.findIndex(nav => nav.navType === NavTypes.Block);
  const blockName =
    blockIndex !== -1 ? navLists[blockIndex].blockMri : undefined;
  const attributeName =
    navLists[blockIndex + 1].navType === NavTypes.Attribute
      ? navLists[blockIndex + 1].path
      : undefined;
  if (
    attribute &&
    attribute.calculated &&
    attribute.calculated.path &&
    attribute.calculated.path[0] === blockName &&
    attribute.calculated.path[1] === attributeName
  ) {
    subElement =
      navLists[blockIndex + 1].navType === NavTypes.Attribute &&
      navLists[blockIndex + 1].subElements
        ? navLists[blockIndex + 1].subElements
        : undefined;
  }
  if (subElement && subElement[0] === 'row') {
    selectedRow = parseInt(subElement[1], 10);
  }
  return {
    attribute,
    selectedRow,
  };
};

const mapDispatchToProps = dispatch => ({
  rowClickHandler: (path, subElement) => {
    dispatch(
      navigationActions.navigateToSubElement(path[0], path[1], subElement)
    );
  },
  infoClickHandler: (path, subElement) => {
    dispatch(navigationActions.navigateToInfo(path[0], path[1], subElement));
  },
  closePanelHandler: () => {
    dispatch(navigationActions.updateChildPanel(''));
  },
  eventHandler: (path, value, row) => {
    dispatch(malcolmUpdateTable(path, value, row));
  },
  setFlag: (path, flagType, flagState) => {
    dispatch(malcolmSetFlag(path, flagType, flagState));
  },
});

WidgetPlotContainer.propTypes = {
  blockName: PropTypes.string.isRequired,
  attributeName: PropTypes.string.isRequired,
  attribute: PropTypes.shape({
    calculated: PropTypes.shape({
      path: PropTypes.arrayOf(PropTypes.string),
      nPoints: PropTypes.number,
    }).isRequired,
    raw: PropTypes.shape({
      meta: PropTypes.shape({
        elements: PropTypes.shape({}),
      }),
      timeStamp: PropTypes.shape({
        secondsPastEpoch: PropTypes.string,
      }),
    }),
  }).isRequired,
  selectedRow: PropTypes.number.isRequired,
  eventHandler: PropTypes.func.isRequired,
  infoClickHandler: PropTypes.func.isRequired,
  closePanelHandler: PropTypes.func.isRequired,
  rowClickHandler: PropTypes.func.isRequired,
  setFlag: PropTypes.func.isRequired,
  addRow: PropTypes.func.isRequired,
  footerItems: PropTypes.arrayOf(PropTypes.node),
  /* theme: PropTypes.shape({
    palette: PropTypes.shape({
      primary: PropTypes.shape({
        light: PropTypes.string,
      }),
      background: PropTypes.shape({
        paper: PropTypes.string,
      }),
    }),
  }).isRequired, */
};

WidgetPlotContainer.defaultProps = {
  footerItems: [],
};

export default connect(mapStateToProps, mapDispatchToProps)(
  withTheme()(WidgetPlotContainer)
);
