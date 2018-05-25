import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import DrawerContainer from '../drawerContainer/drawerContainer.component';
import BlockDetails from '../blockDetails/blockDetails.component';

const MainMalcolmView = props => (
  <div>
    <DrawerContainer parentTitle={props.parentBlockTitle} childTitle="">
      <BlockDetails block={props.parentBlock} />
      <div>Middle content</div>
      <div>Right content</div>
    </DrawerContainer>
  </div>
);

const mapStateToProps = state => {
  const parentBlock = state.malcolm.parentBlock
    ? state.malcolm.blocks[state.malcolm.parentBlock]
    : undefined;
  return {
    parentBlock,
    parentBlockTitle: parentBlock ? parentBlock.name : '',
  };
};

const mapDispatchToProps = () => ({});

MainMalcolmView.propTypes = {
  parentBlock: PropTypes.shape({}),
  parentBlockTitle: PropTypes.string,
};

MainMalcolmView.defaultProps = {
  parentBlock: undefined,
  parentBlockTitle: '',
};

export default connect(mapStateToProps, mapDispatchToProps)(MainMalcolmView);
