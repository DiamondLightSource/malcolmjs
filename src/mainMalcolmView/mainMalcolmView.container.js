import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import DrawerContainer from '../drawerContainer/drawerContainer.component';
import BlockDetails from '../blockDetails/blockDetails.component';

const MainMalcolmView = props => (
  <div>
    <DrawerContainer
      parentTitle={props.parentBlockTitle}
      childTitle={props.childBlockTitle}
    >
      <BlockDetails block={props.parentBlock} />
      <div>Middle content</div>
      <BlockDetails block={props.childBlock} />
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
    parentBlock,
    parentBlockTitle: parentBlock ? parentBlock.name : '',
    childBlock,
    childBlockTitle: childBlock ? childBlock.name : '',
  };
};

const mapDispatchToProps = () => ({});

MainMalcolmView.propTypes = {
  parentBlock: PropTypes.shape({}),
  parentBlockTitle: PropTypes.string,
  childBlock: PropTypes.shape({}),
  childBlockTitle: PropTypes.string,
};

MainMalcolmView.defaultProps = {
  parentBlock: undefined,
  parentBlockTitle: '',
  childBlock: undefined,
  childBlockTitle: '',
};

export default connect(mapStateToProps, mapDispatchToProps)(MainMalcolmView);
