import React from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import { withTheme } from '@material-ui/core/styles';
import { Typography } from '@material-ui/core';
import Loadable from 'react-loadable';
import blockUtils from '../malcolm/blockUtils';
import TabbedPanel from './tabbedMiddlePanel.component';
import ArchiveTable from './archiveTable.container';
// import AttributePlot from './attributePlot.component';
// import { malcolmTypes } from '../malcolmWidgets/attributeDetails/attributeSelector/attributeSelector.component';

const LoadableAttributePlot = Loadable({
  loader: () => import('./attributePlot.component'),
  loading: () => <Typography>Loading...</Typography>,
});

const AttributeViewer = props => (
  <TabbedPanel
    useSwipeable={props.useSwipeable}
    defaultTab={props.defaultTab}
    plotTime={props.attribute.plotTime}
    openPanels={props.openPanels}
    tabLabels={['Table', 'Plot']}
  >
    <ArchiveTable attribute={props.attribute} />
    <LoadableAttributePlot
      attribute={props.attribute}
      openPanels={props.openPanels}
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
