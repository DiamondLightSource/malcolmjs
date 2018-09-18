import React from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import { withTheme } from '@material-ui/core/styles';
import Typography from '@material-ui/core/Typography';
import Loadable from 'react-loadable';
import blockUtils from '../../malcolm/blockUtils';
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
  }#p:${props.openPanels.parent}#c:${props.openPanels.child}`;
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

const AttributeViewer = props => (
  <TabbedPanel
    useSwipeable={props.useSwipeable}
    defaultTab={props.defaultTab}
    plotTime={props.attribute.plotTime}
    openPanels={props.openPanels}
    tabLabels={['Table', 'Plot']}
  >
    <ArchiveTable attribute={props.attribute} />
    <LoadablePlotter
      attribute={props.attribute}
      openPanels={props.openPanels}
      deriveState={deriveStateFromProps}
      doTick
    />
  </TabbedPanel>
);

const mapStateToProps = (state, ownProps) => {
  let attribute;
  if (ownProps.attributeName && ownProps.blockName) {
    const attributeIndex = blockUtils.findAttributeIndex(
      state.malcolm.blocks,
      ownProps.blockName,
      ownProps.attributeName
    );
    if (attributeIndex !== -1) {
      attribute =
        state.malcolm.blockArchive[ownProps.blockName].attributes[
          attributeIndex
        ];
    }
  }
  return {
    attribute,
  };
};

AttributeViewer.propTypes = {
  attribute: PropTypes.shape({
    refreshRate: PropTypes.number,
    value: PropTypes.arrayOf(PropTypes.number),
    timeSinceConnect: PropTypes.arrayOf(PropTypes.number),
    plotTime: PropTypes.number,
    isBool: PropTypes.bool,
  }).isRequired,
  // widgetTag: PropTypes.string.isRequired,
  // typeId: PropTypes.string.isRequired,
  useSwipeable: PropTypes.bool,
  defaultTab: PropTypes.number,
  openPanels: PropTypes.shape({
    parent: PropTypes.bool,
    child: PropTypes.bool,
  }).isRequired,
};

AttributeViewer.defaultProps = {
  defaultTab: 0,
  useSwipeable: false,
};

export default connect(mapStateToProps)(withTheme()(AttributeViewer));
