import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { withStyles } from '@material-ui/core/styles';
import CircularProgress from '@material-ui/core/CircularProgress';
import Typography from '@material-ui/core/Typography';
import GroupExpander from '../malcolmWidgets/groupExpander/groupExpander.component';
import AttributeDetails from '../malcolmWidgets/attributeDetails/attributeDetails.component';

const styles = theme => ({
  progressContainer: {
    marginTop: 15,
    color: theme.palette.primary.contrastText,
  },
});

const ignoredAttributes = ['widget:icon', 'widget:title'];

export const isBlockLoading = block =>
  block && (block.loading || block.attributes.some(a => a.loading));
export const isRootLevelAttribute = a =>
  !a.inGroup &&
  !a.isGroup &&
  !ignoredAttributes.some(
    ignored =>
      a.meta && a.meta.tags && a.meta.tags.findIndex(t => t === ignored) > -1
  );
export const areAttributesAvailable = block => block && block.attributes;

const blockLoading = () => (
  <div>
    <CircularProgress color="secondary" />
    <Typography>Loading...</Typography>
  </div>
);

const displayAttributes = block => {
  if (areAttributesAvailable(block)) {
    return (
      <div>
        {block.attributes.filter(a => isRootLevelAttribute(a)).map(a => (
          <AttributeDetails key={a.name} attribute={a}>
            <div>Hello</div>
          </AttributeDetails>
        ))}
        {block.attributes.filter(a => a.isGroup).map(group => (
          <GroupExpander
            key={group.name}
            groupName={group.meta.label}
            expanded={group.value === 'expanded'}
          >
            {block.attributes
              .filter(a => a.group === group.name)
              .map(a => <AttributeDetails key={a.name} attribute={a} />)}
          </GroupExpander>
        ))}
      </div>
    );
  }
  return null;
};

const BlockDetails = props => (
  <div className={props.classes.progressContainer}>
    {isBlockLoading(props.block)
      ? blockLoading()
      : displayAttributes(props.block)}
  </div>
);

BlockDetails.propTypes = {
  block: PropTypes.shape({
    loading: PropTypes.bool,
  }),
  classes: PropTypes.shape({
    progressContainer: PropTypes.string,
  }).isRequired,
};

BlockDetails.defaultProps = {
  block: undefined,
};

const mapStateToProps = (state, ownProps) => {
  let block;
  if (ownProps.parent) {
    block = state.malcolm.parentBlock
      ? state.malcolm.blocks[state.malcolm.parentBlock]
      : undefined;
  } else {
    block = state.malcolm.childBlock
      ? state.malcolm.blocks[state.malcolm.childBlock]
      : undefined;
  }

  return {
    block,
  };
};

const mapDispatchToProps = () => ({});

export default connect(mapStateToProps, mapDispatchToProps)(
  withStyles(styles, { withTheme: true })(BlockDetails)
);
