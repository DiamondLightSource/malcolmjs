import * as React from 'react';
import PropTypes from 'prop-types';
import CircularBuffer from 'circular-buffer';
import WidgetTable from '../table/table.component';

const noOp = () => {};

const MethodArchive = props => {
  const newProps = { ...props.parentProps, divStyle: props.divStyle };
  const timeStamps = newProps.methodArchive.timeStamp.toarray();
  const values = newProps.methodArchive.value.toarray();
  const dummyAttribute = {
    raw: {
      value: {
        timeStamp: timeStamps.map(stamp => stamp.localRunTime),
        alarm: newProps.methodArchive.alarmState.toarray(),
        value: values.map(
          value => value.runParameters[newProps.selectedParam[1]]
        ),
      },
      meta: {
        elements: {
          alarm: {
            tags: ['info:alarm'],
            label: 'Method Alarm state',
          },
          timeStamp: {
            tags: ['widget:textupdate'],
            label: `Time sent`,
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
  const table = (
    <div className={newProps.classes.plainBackground}>
      <div
        className={newProps.classes.tableContainer}
        style={{
          ...newProps.divStyle,
          textAlign: 'left',
          display: 'initial',
        }}
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
      </div>
    </div>
  );
  return table;
};

MethodArchive.propTypes = {
  parentProps: PropTypes.shape({
    classes: PropTypes.shape({
      plainBackground: PropTypes.string,
      tableContainer: PropTypes.string,
    }),
    methodArchive: PropTypes.shape({
      timeStamp: PropTypes.instanceOf(CircularBuffer),
      value: PropTypes.instanceOf(CircularBuffer),
      alarmState: PropTypes.instanceOf(CircularBuffer),
    }),
  }).isRequired,
  divStyle: PropTypes.shape({}).isRequired,
};

export default MethodArchive;
