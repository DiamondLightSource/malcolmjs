import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { withStyles } from '@material-ui/core/styles';
import CircularProgress from '@material-ui/core/CircularProgress';
import Typography from '@material-ui/core/Typography';
import GroupExpander from '../malcolmWidgets/groupExpander/groupExpander.component';
import AttributeDetails from '../malcolmWidgets/attributeDetails/attributeDetails.component';
import MethodDetails from '../malcolmWidgets/method/method.component';

const ascii404 =
  '             __   __    _____     __   __ \n' +
  '            |\\  \\ |\\  \\  |\\   __  \\  |\\  \\  |\\  \\ \n' +
  '            \\ \\  \\\\_\\  \\ \\ \\  \\|\\   \\ \\ \\  \\\\_\\  \\ \n' +
  '             \\ \\___    \\ \\ \\  \\_\\  \\ \\ \\ ___   \\ \n' +
  '              \\|___|\\__\\ \\ \\_____\\ \\|___|\\__\\ \n' +
  '                     \\|__|  \\|_____|        \\|__| \n';

const styles = theme => ({
  progressContainer: {
    marginTop: 15,
    color: theme.palette.primary.contrastText,
  },
});

const ignoredAttributes = ['widget:icon'];

export const isBlockLoading = block => {
  if (block !== undefined && block.loading === 404) {
    return 404;
  }
  return (
    block !== undefined &&
    (block.loading || block.attributes.some(a => a.loading))
  );
};
export const isRootLevelAttribute = a =>
  !a.calculated.inGroup &&
  !a.calculated.isGroup &&
  !a.calculated.isMethod &&
  !ignoredAttributes.some(
    ignored =>
      a.raw &&
      a.raw.meta &&
      a.raw.meta.tags &&
      a.raw.meta.tags.findIndex(t => t === ignored) > -1
  );
export const areAttributesAvailable = block => block && block.attributes;

const blockLoading = notFound =>
  notFound ? (
    <div>
      <div align="left" style={{ whiteSpace: 'pre' }}>
        {ascii404}
      </div>
      <br />
      <br />
      Block not found! <br />
      (hint: URLs are case sensitive)
    </div>
  ) : (
    <div>
      <CircularProgress color="secondary" />
      <Typography>Loading...</Typography>
    </div>
  );

export const areAttributesTheSame = (oldAttributes, newAttributes) =>
  oldAttributes.length === newAttributes.length &&
  oldAttributes.every(
    (old, i) => old.calculated.name === newAttributes[i].calculated.name
  ) &&
  oldAttributes.every(
    (old, i) => old.calculated.inGroup === newAttributes[i].calculated.inGroup
  ) &&
  oldAttributes.every(
    (old, i) => old.calculated.isGroup === newAttributes[i].calculated.isGroup
  ) &&
  oldAttributes.every(
    (old, i) => old.calculated.isMethod === newAttributes[i].calculated.isMethod
  ) &&
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
            key={a.calculated.name}
            attributeName={a.calculated.name}
            blockName={props.blockName}
          />
        ))}
        {props.groups.map(group => (
          <GroupExpander
            key={group.attribute.calculated.name}
            groupName={group.attribute.raw.meta.label}
            expanded={group.attribute.raw.value === 'expanded'}
          >
            {group.children.map(a => (
              <AttributeDetails
                key={a.calculated.name}
                attributeName={a.calculated.name}
                blockName={props.blockName}
              />
            ))}
          </GroupExpander>
        ))}
        {props.methods.map(method => (
          <MethodDetails
            blockName={props.blockName}
            attributeName={method.calculated.name}
          />
        ))}
      </div>
    );
  }
  return null;
};

const BlockDetails = props => (
  <div className={props.classes.progressContainer}>
    {props.blockLoading
      ? blockLoading(props.blockLoading === 404)
      : displayAttributes(props)}
  </div>
);

BlockDetails.propTypes = {
  blockLoading: PropTypes.oneOfType([PropTypes.bool, PropTypes.number])
    .isRequired,
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
  methods: PropTypes.arrayOf(PropTypes.shape({})).isRequired,
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
    stateMemory.rootAttributes = block.attributes.filter(
      a =>
        isRootLevelAttribute(a) &&
        !block.orphans.some(orphan => orphan === a.calculated.name)
    );
    stateMemory.groups = block.attributes
      .filter(a => a.calculated.isGroup)
      .map(group => ({
        attribute: group,
        children: block.attributes.filter(
          a =>
            a.calculated.group === group.calculated.name &&
            !block.orphans.some(orphan => orphan === a.calculated.name)
        ),
      }));

    stateMemory.methods = block.attributes.filter(a => a.calculated.isMethod);

    stateMemory.oldAttributes = block.attributes;
  }

  return {
    blockName: block ? block.name : '',
    blockLoading: isBlockLoading(block),
    attributesAvailable: areAttributesAvailable(block) !== undefined,
    rootAttributes: stateMemory.rootAttributes,
    groups: stateMemory.groups,
    methods: stateMemory.methods,
  };
};

const memoizedMapStateToProps = () => {
  const blockDetailsMemory = {
    oldAttributes: [],
    rootAttributes: [],
    groups: [],
    methods: [],
  };

  return (state, ownProps) =>
    mapStateToProps(state, ownProps, blockDetailsMemory);
};
export default connect(memoizedMapStateToProps)(
  withStyles(styles, { withTheme: true })(BlockDetails)
);
