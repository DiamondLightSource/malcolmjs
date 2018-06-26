import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { withStyles } from '@material-ui/core/styles';
import CircularProgress from '@material-ui/core/CircularProgress';
import Typography from '@material-ui/core/Typography';
import GroupExpander from '../malcolmWidgets/groupExpander/groupExpander.component';
import AttributeDetails from '../malcolmWidgets/attributeDetails/attributeDetails.component';
import MethodDetails from '../malcolmWidgets/method/method.component';

const error404 = [
  '             __   __    _____     __   __',
  '            |\\  \\ |\\  \\  |\\   __  \\  |\\  \\  |\\  \\',
  '            \\ \\  \\\\_\\  \\ \\ \\  \\|\\   \\ \\ \\  \\\\_\\  \\',
  '             \\ \\___    \\ \\ \\  \\_\\  \\ \\ \\ ___   \\',
  '              \\|___|\\__\\ \\ \\_____\\ \\|___|\\__\\',
  '                     \\|__|  \\|_____|        \\|__|',
];

const styles = theme => ({
  progressContainer: {
    marginTop: 15,
    color: theme.palette.primary.contrastText,
  },
});

const ignoredAttributes = ['widget:icon', 'widget:title'];

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
  !a.inGroup &&
  !a.isGroup &&
  !a.isMethod &&
  !ignoredAttributes.some(
    ignored =>
      a.meta && a.meta.tags && a.meta.tags.findIndex(t => t === ignored) > -1
  );
export const areAttributesAvailable = block => block && block.attributes;

const blockLoading = notFound =>
  notFound ? (
    <div>
      <div align="left" style={{ whiteSpace: 'pre' }}>
        {error404.map(line => (
          <span>
            {line}
            <br />
          </span>
        ))}
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
  oldAttributes.every((old, i) => old.name === newAttributes[i].name) &&
  oldAttributes.every((old, i) => old.inGroup === newAttributes[i].inGroup) &&
  oldAttributes.every((old, i) => old.isGroup === newAttributes[i].isGroup) &&
  oldAttributes.every((old, i) => old.isMethod === newAttributes[i].isMethod) &&
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
        {props.methods.map(method => (
          <GroupExpander key={method.name} groupName={method.label} expanded>
            <MethodDetails
              blockName={props.blockName}
              attributeName={method.name}
            />
          </GroupExpander>
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
    stateMemory.rootAttributes = block.attributes.filter(a =>
      isRootLevelAttribute(a)
    );
    stateMemory.groups = block.attributes.filter(a => a.isGroup).map(group => ({
      attribute: group,
      children: block.attributes.filter(a => a.group === group.name),
    }));

    stateMemory.methods = block.attributes.filter(a => a.isMethod);

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
