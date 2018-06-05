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

const areAttributesTheSame = (oldAttributes, newAttributes) =>
  oldAttributes.length === newAttributes.length &&
  oldAttributes.every((old, i) => old.name === newAttributes[i].name) &&
  oldAttributes.every((old, i) => old.inGroup === newAttributes[i].inGroup) &&
  oldAttributes.every((old, i) => old.isGroup === newAttributes[i].isGroup) &&
  oldAttributes.every(
    (old, i) =>
      isRootLevelAttribute(old) === isRootLevelAttribute(newAttributes[i])
  );

const displayAttributes = props => {
  if (props.attributesAvailable) {
    return (
      <div>
        {props.rootAttributes.map(a => (
          <AttributeDetails
            key={a.name}
            attributeName={a.name}
            blockName={props.blockName}
          />
        ))}
        {props.groups.map(group => (
          <GroupExpander
            key={group.attribute.name}
            groupName={group.attribute.meta.label}
            expanded={group.attribute.value === 'expanded'}
          >
            {group.children.map(a => (
              <AttributeDetails
                key={a.name}
                attributeName={a.name}
                blockName={props.blockName}
              />
            ))}
          </GroupExpander>
        ))}
      </div>
    );
  }
  return null;
};

const BlockDetails = props => (
  <div className={props.classes.progressContainer}>
    {props.blockLoading ? blockLoading() : displayAttributes(props)}
  </div>
);

BlockDetails.propTypes = {
  blockLoading: PropTypes.bool.isRequired,
  classes: PropTypes.shape({
    progressContainer: PropTypes.string,
  }).isRequired,
};

BlockDetails.defaultProps = {
  block: undefined,
};

displayAttributes.propTypes = {
  blockName: PropTypes.string.isRequired,
  attributesAvailable: PropTypes.bool.isRequired,
  rootAttributes: PropTypes.arrayOf(PropTypes.shape({})).isRequired,
  groups: PropTypes.arrayOf(PropTypes.shape({})).isRequired,
};

const mapStateToProps = (state, ownProps, memory) => {
  const stateMemory = memory;
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

  if (
    block &&
    block.attributes &&
    !areAttributesTheSame(stateMemory.oldAttributes, block.attributes)
  ) {
    stateMemory.rootAttributes = block.attributes.filter(a =>
      isRootLevelAttribute(a)
    );
    stateMemory.groups = block.attributes.filter(a => a.isGroup).map(group => ({
      attribute: group,
      children: block.attributes.filter(a => a.group === group.name),
    }));

    stateMemory.oldAttributes = block.attributes;
  }

  return {
    blockName: block ? block.name : '',
    blockLoading: isBlockLoading(block),
    attributesAvailable: areAttributesAvailable(block) !== undefined,
    rootAttributes: memory.rootAttributes,
    groups: memory.groups,
  };
};

const memoizedMapStateToProps = () => {
  const blockDetailsMemory = {
    oldAttributes: [],
    rootAttributes: [],
    groups: [],
  };

  return (state, ownProps) =>
    mapStateToProps(state, ownProps, blockDetailsMemory);
};
export default connect(memoizedMapStateToProps)(
  withStyles(styles, { withTheme: true })(BlockDetails)
);
