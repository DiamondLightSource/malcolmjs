import React from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import { withTheme } from '@material-ui/core/styles';
import Typography from '@material-ui/core/Typography';
import Loadable from 'react-loadable';
import TabbedPanel from '../tabbedMiddlePanel.component';
import ArchiveTable from './archiveTable.container';
import {
  AlarmStates,
  AlarmStatesByIndex,
} from '../../malcolmWidgets/attributeDetails/attributeAlarm/attributeAlarm.component';

const LoadablePlotter = Loadable({
  loader: () => import('../plotter.component'),
  loading: () => <Typography>Loading...</Typography>,
});

const updatePlotData = (oldDataElement, alarmIndex, attribute) => {
  const dataElement = oldDataElement;
  const alarms = attribute.alarmState.toarray();
  dataElement.x = attribute.timeStamp.toarray();
  dataElement.y = attribute.plotValue
    .toarray()
    .map(
      (value, valIndex) =>
        alarms[valIndex] === AlarmStatesByIndex[alarmIndex] ||
        (alarms[valIndex - 1] === AlarmStatesByIndex[alarmIndex] &&
          alarms[valIndex] !== AlarmStates.UNDEFINED_ALARM)
          ? value
          : null
    );
  dataElement.visible = dataElement.y.some(val => val !== null);

  return dataElement;
};

export const deriveStateFromProps = (props, state) => {
  const { data, layout } = state;
  const dataRevision = `${props.attribute.parent}#${props.attribute.name}#${
    props.attribute.plotTime
  }#p:${props.parentPanelOpen}#c:${props.childPanelOpen}`;
  if (props.attribute && layout.datarevision !== dataRevision) {
    const newData = data.map((dataElement, index) =>
      updatePlotData(dataElement, index, props.attribute)
    );
    layout.datarevision = dataRevision;
    if (
      props.attribute.parent !== layout.parent ||
      props.attribute.name !== layout.attribute
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
  }
  return state;
};

const TAB_LABELS = ['Table', 'Plot'];

const AttributeViewer = props => (
  <TabbedPanel tabLabels={TAB_LABELS}>
    <ArchiveTable
      blockName={props.blockName}
      attributeName={props.attributeName}
    />
    <LoadablePlotter
      blockName={props.blockName}
      attributeName={props.attributeName}
      deriveState={deriveStateFromProps}
      doTick
    />
  </TabbedPanel>
);

const mapStateToProps = () => ({});

AttributeViewer.propTypes = {
  blockName: PropTypes.string.isRequired,
  attributeName: PropTypes.string.isRequired,
};

export default connect(mapStateToProps)(withTheme()(AttributeViewer));
