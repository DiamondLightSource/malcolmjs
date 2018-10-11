import * as React from 'react';
import PropTypes from 'prop-types';
import CircularBuffer from 'circular-buffer';
import Typography from '@material-ui/core/Typography';
import Loadable from 'react-loadable';
import WidgetTable from '../../malcolmWidgets/table/virtualizedTable.component';
import TabbedPanel from '../tabbedMiddlePanel.component';
import {
  AlarmStates,
  AlarmStatesByIndex,
} from '../../malcolmWidgets/attributeDetails/attributeAlarm/attributeAlarm.component';

const noOp = () => {};

const LoadablePlotter = Loadable({
  loader: () => import('../plotter.component'),
  loading: () => <Typography>Loading...</Typography>,
});

const updatePlotData = (oldDataElement, alarmIndex, attribute) => {
  const dataElement = oldDataElement;
  if (attribute) {
    const alarms = [...attribute.alarmState];
    dataElement.x = [...attribute.timeStamp];
    dataElement.y = attribute.value.map(
      (value, valIndex) =>
        alarms[valIndex] === AlarmStatesByIndex[alarmIndex] ||
        (alarms[valIndex - 1] === AlarmStatesByIndex[alarmIndex] &&
          alarms[valIndex] !== AlarmStates.UNDEFINED_ALARM)
          ? value
          : null
    );
  }
  dataElement.visible = dataElement.y.some(val => val !== null);
  return dataElement;
};

export const deriveStateFromProps = (props, state) => {
  const { data, layout } = state;
  const newData = data.map((dataElement, index) =>
    updatePlotData(dataElement, index, props.attribute)
  );
  layout.datarevision += 1;
  if (
    props.attribute &&
    (props.attribute.parent !== layout.parent ||
      props.attribute.name !== layout.attribute)
  ) {
    layout.parent = props.attribute.parent;
    layout.attribute = props.attribute.name;
    layout.yaxis = {
      color: props.theme.palette.text.primary,
    };
  }
  return {
    ...state,
    data: [...newData],
    layout,
  };
};

const dummyAttribute = (methodArchive, selectedParam) => ({
  raw: {
    value: {
      timeStamp: methodArchive.timeStamp
        .toarray()
        .map(stamp => stamp.localRunTime.toISOString()),
      alarm: methodArchive.alarmState.toarray(),
      value: methodArchive.value
        .toarray()
        .map(value => value.runParameters[selectedParam[1]]),
    },
    meta: {
      elements: {
        alarm: {
          tags: ['info:alarm'],
          label: 'Method Alarm state',
        },
        timeStamp: {
          tags: ['widget:textupdate'],
          label: selectedParam[0] === 'takes' ? 'Time sent' : 'Time received',
        },
        value: {
          tags: ['widget:textupdate'],
          label: 'Parameter value',
        },
      },
    },
  },
  calculated: {},
});

export const dummyArchive = (methodArchive, selectedParam) => ({
  parent: methodArchive.parent,
  name: methodArchive.name,
  timeStamp: methodArchive.timeStamp
    .toarray()
    .map(
      stamp =>
        selectedParam[0] === 'takes'
          ? stamp.localRunTime
          : stamp.localReturnTime
    ),
  alarmState: methodArchive.alarmState.toarray(),
  value: methodArchive.value
    .toarray()
    .map(value => value.runParameters[selectedParam[1]]),
});

const MethodArchive = props => (
  <TabbedPanel
    alwaysUpdate
    openPanels={props.openPanels}
    tabLabels={['Table', 'Plot']}
    defaultTab={props.defaultTab}
  >
    <WidgetTable
      attribute={dummyAttribute(props.methodArchive, props.selectedParam)}
      hideInfo
      eventHandler={noOp}
      setFlag={noOp}
      addRow={noOp}
      infoClickHandler={noOp}
      rowClickHandler={noOp}
      closePanelHandler={noOp}
    />
    <LoadablePlotter
      attribute={dummyArchive(props.methodArchive, props.selectedParam)}
      openPanels={props.openPanels}
      deriveState={deriveStateFromProps}
    />
  </TabbedPanel>
);

MethodArchive.propTypes = {
  selectedParam: PropTypes.arrayOf(PropTypes.string).isRequired,
  methodArchive: PropTypes.shape({
    parent: PropTypes.string,
    name: PropTypes.string,
    timeStamp: PropTypes.instanceOf(CircularBuffer),
    value: PropTypes.instanceOf(CircularBuffer),
    alarmState: PropTypes.instanceOf(CircularBuffer),
  }).isRequired,
  openPanels: PropTypes.shape({
    parent: PropTypes.bool,
    child: PropTypes.bool,
  }).isRequired,
  defaultTab: PropTypes.number,
};
MethodArchive.defaultProps = {
  defaultTab: 1,
};

export default MethodArchive;
