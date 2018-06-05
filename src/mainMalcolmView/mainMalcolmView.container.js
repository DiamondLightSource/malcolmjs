import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import DrawerContainer from '../drawerContainer/drawerContainer.component';
import BlockDetails from '../blockDetails/blockDetails.component';
import MiddlePanelContainer from './middlePanel.container';

const blockDetailsUrl = (rootUrl, blockTitle) =>
  `${rootUrl}/details/${blockTitle}`;

const popOutFunction = (rootUrl, width, blockTitle) =>
  window.open(
    blockDetailsUrl(rootUrl, blockTitle),
    blockTitle,
    `width=${width},height=${window.innerHeight}`
  );

const MainMalcolmView = props => (
  <div>
    <DrawerContainer
      parentTitle={props.parentBlockTitle}
      popOutAction={popOutFunction}
      childTitle={props.childBlockTitle}
    >
      <BlockDetails parent />
      <MiddlePanelContainer />
      <BlockDetails />
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

  return {
    parentBlockTitle: parentBlock ? parentBlock.name : '',
    childBlockTitle: childBlock ? childBlock.name : '',
  };
};

const mapDispatchToProps = () => ({});

MainMalcolmView.propTypes = {
  parentBlockTitle: PropTypes.string,
  childBlockTitle: PropTypes.string,
};

MainMalcolmView.defaultProps = {
  parentBlockTitle: '',
  childBlockTitle: '',
};

export default connect(mapStateToProps, mapDispatchToProps)(MainMalcolmView);
