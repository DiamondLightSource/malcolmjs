import React from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import { withTheme } from '@material-ui/core/styles';
import Typography from '@material-ui/core/Typography';
import Loadable from 'react-loadable';
import blockUtils from '../../malcolm/blockUtils';

const LoadablePlotter = Loadable({
  loader: () => import('../../middlePanelViews/plotter.component'),
  loading: () => <Typography>Loading...</Typography>,
});

const updatePlotData = (oldDataElement, attribute) => {
  const dataElement = oldDataElement;
  if (attribute.raw.value.yData) {
    dataElement.y = attribute.raw.value.yData;
    dataElement.x =
      attribute.raw.value.xData &&
      attribute.raw.value.xData.length === attribute.raw.value.yData.length
        ? attribute.raw.value.xData
        : attribute.raw.value.yData.map((val, ind) => ind);
    dataElement.visible = attribute.raw.value.yData.map(() => true);
  } else {
    dataElement.x = attribute.raw.value.map((val, index) => index);
    dataElement.y = attribute.raw.value;
    dataElement.visible = attribute.raw.value.map(() => true);
  }
  return dataElement;
};

export const deriveStateFromProps = (props, state) => {
  const { data, layout } = state;
  if (props.attribute && props.attribute.raw) {
    const newData = [...data];
    newData[0] = updatePlotData(data[0], props.attribute);
    layout.datarevision += 1;
    const xDisplay = props.attribute.raw.meta.elements.xData.display_t;
    const yDisplay = props.attribute.raw.meta.elements.yData.display_t;
    if (xDisplay && xDisplay.limitLow !== xDisplay.limitHigh) {
      layout.xaxis = {
        ...layout.xaxis,
        range: [xDisplay.limitLow, xDisplay.limitHigh],
      };
    }
    if (yDisplay && yDisplay.limitLow !== yDisplay.limitHigh) {
      layout.yaxis = {
        ...layout.yaxis,
        range: [yDisplay.limitLow, yDisplay.limitHigh],
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

const AttributePlotter = props => (
  <LoadablePlotter
    blockName={props.blockName}
    attributeName={props.attributeName}
    deriveState={deriveStateFromProps}
    useArchive={false}
  />
);

const mapStateToProps = (state, ownProps) => {
  let attribute;
  if (ownProps.attributeName && ownProps.blockName) {
    attribute = blockUtils.findAttribute(
      state.malcolm.blocks,
      ownProps.blockName,
      ownProps.attributeName
    );
  }
  return {
    attribute,
  };
};

AttributePlotter.propTypes = {
  blockName: PropTypes.string.isRequired,
  attributeName: PropTypes.string.isRequired,
};

export default connect(mapStateToProps)(withTheme()(AttributePlotter));
