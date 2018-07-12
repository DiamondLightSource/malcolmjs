import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import DrawerContainer from '../drawerContainer/drawerContainer.component';
import BlockDetails from '../blockDetails/blockDetails.component';
import MiddlePanelContainer from './middlePanel.container';
import Palette from '../layout/palette/palette.component';

const blockDetailsUrl = (rootUrl, blockTitle) =>
  `${rootUrl}/details/${blockTitle}`;

const popOutFunction = (rootUrl, width, blockTitle) =>
  window.open(
    blockDetailsUrl(rootUrl, blockTitle),
    blockTitle,
    `width=${width},height=${window.innerHeight}`
  );

const childPanelSelector = props => {
  if (props.showPalette) {
    return <Palette />;
  } else if (props.showInfo) {
    return <div>Info goes here</div>;
  }
  return <BlockDetails />;
};

const MainMalcolmView = props => (
  <div>
    <DrawerContainer
      parentTitle={props.parentBlockTitle}
      popOutAction={popOutFunction}
      childTitle={props.childBlockTitle}
    >
      <BlockDetails parent />
      <MiddlePanelContainer />
      {childPanelSelector(props)}
    </DrawerContainer>
  </div>
);

const mapStateToProps = state => {
  const parentBlock = state.malcolm.parentBlock
    ? state.malcolm.blocks[state.malcolm.parentBlock]
    : undefined;

  const childBlock = state.malcolm.childBlock
    ? state.malcolm.blocks[state.malcolm.childBlock]
    : undefined;

  const showPalette = state.malcolm.childBlock === '.palette';
  const showInfo = state.malcolm.childBlock === '.info';

  let childBlockTitle = childBlock ? childBlock.name : '';
  if (showPalette) {
    childBlockTitle = 'Palette';
  } else if (showInfo) {
    childBlockTitle = 'Info';
  }

  return {
    parentBlockTitle: parentBlock ? parentBlock.name : '',
    childBlockTitle,
    showPalette,
    showInfo,
  };
};

const mapDispatchToProps = () => ({});

MainMalcolmView.propTypes = {
  parentBlockTitle: PropTypes.string,
  childBlockTitle: PropTypes.string,
};

childPanelSelector.propTypes = {
  showPalette: PropTypes.bool.isRequired,
  showInfo: PropTypes.bool.isRequired,
};

MainMalcolmView.defaultProps = {
  parentBlockTitle: '',
  childBlockTitle: '',
};

export default connect(mapStateToProps, mapDispatchToProps)(MainMalcolmView);
