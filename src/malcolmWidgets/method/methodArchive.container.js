import * as React from 'react';
import PropTypes from 'prop-types';
import CircularBuffer from 'circular-buffer';
import Typography from '@material-ui/core/Typography';
import Loadable from 'react-loadable';
import WidgetTable from '../table/table.component';
// import MethodPlot from './methodPlot.component';
import TabbedPanel from '../../attributeView/tabbedMiddlePanel.component';

const noOp = () => {};

const LoadableMethodPlot = Loadable({
  loader: () => import('./methodPlot.component'),
  loading: () => <Typography>Loading...</Typography>,
});

const MethodArchive = props => {
  const timeStamps = props.methodArchive.timeStamp.toarray();
  const values = props.methodArchive.value.toarray();
  const dummyAttribute = {
    raw: {
      value: {
        timeStamp: timeStamps.map(stamp => stamp.localRunTime.toISOString()),
        alarm: props.methodArchive.alarmState.toarray(),
        value: values.map(value => value.runParameters[props.selectedParam[1]]),
      },
      meta: {
        elements: {
          alarm: {
            tags: ['info:alarm'],
            label: 'Method Alarm state',
          },
          timeStamp: {
            tags: ['widget:textupdate'],
            label:
              props.selectedParam[0] === 'takes'
                ? 'Time sent'
                : 'Time received',
          },
          value: {
            tags: ['widget:textupdate'],
            label: 'Parameter value',
          },
        },
      },
    },
    calculated: {},
  };
  const dummyArchive = {
    parent: props.methodArchive.parent,
    name: props.methodArchive.name,
    timeStamp: timeStamps.map(
      stamp =>
        props.selectedParam[0] === 'takes'
          ? stamp.localRunTime
          : stamp.localReturnTime
    ),
    alarmState: props.methodArchive.alarmState.toarray(),
    value: values.map(value => value.runParameters[props.selectedParam[1]]),
  };
  return (
    <TabbedPanel
      alwaysUpdate
      openPanels={props.openPanels}
      tabLabels={['Table', 'Plot']}
      defaultTab={props.defaultTab}
    >
      <WidgetTable
        attribute={dummyAttribute}
        hideInfo
        eventHandler={noOp}
        setFlag={noOp}
        addRow={noOp}
        infoClickHandler={noOp}
        rowClickHandler={noOp}
      />
      <LoadableMethodPlot
        attribute={dummyArchive}
        openPanels={props.openPanels}
      />
    </TabbedPanel>
  );
};

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
  defaultTab: 0,
};

export default MethodArchive;
