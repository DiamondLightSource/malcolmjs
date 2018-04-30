import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import DrawerContainer from '../drawerContainer/drawerContainer.component';
import BlockDetails from '../blockDetails/blockDetails.component';

const MainMalcolmView = props => (
  <div>
    <DrawerContainer>
      <BlockDetails block={props.parentBlock} />
      <div>Middle content</div>
      <div>Right content</div>
    </DrawerContainer>
  </div>
);

const mapStateToProps = state => ({
  parentBlock: state.malcolm.parentBlock
    ? state.malcolm.blocks[state.malcolm.parentBlock]
    : undefined,
});

const mapDispatchToProps = () => ({});

MainMalcolmView.propTypes = {
  parentBlock: PropTypes.shape({}),
};

MainMalcolmView.defaultProps = {
  parentBlock: undefined,
};

export default connect(mapStateToProps, mapDispatchToProps)(MainMalcolmView);
