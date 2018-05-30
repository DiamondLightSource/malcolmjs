import React from 'react';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
import { connect } from 'react-redux';
import Layout from '../layout/layout.component';

const styles = () => ({
  container: {
    marginTop: 64,
    height: '100%',
    width: '100%',
  },
  layoutArea: {
    display: 'flex',
    width: '100%',
    height: 'calc(100vh - 64px)',
    backgroundColor: 'rgb(48, 48, 48)',
    backgroundImage:
      'linear-gradient(0deg, transparent 24%, rgba(255, 255, 255, 0.05) 25%, rgba(255, 255, 255, 0.05) 26%, transparent 27%, transparent 74%, rgba(255, 255, 255, 0.05) 75%, rgba(255, 255, 255, 0.05) 76%, transparent 77%, transparent), linear-gradient(90deg, transparent 24%, rgba(255, 255, 255, 0.05) 25%, rgba(255, 255, 255, 0.05) 26%, transparent 27%, transparent 74%, rgba(255, 255, 255, 0.05) 75%, rgba(255, 255, 255, 0.05) 76%, transparent 77%, transparent)',
    backgroundSize: '50px 50px',
  },
});

const findAttributeComponent = props => {
  if (props.mainAttribute === 'layout') {
    return (
      <div className={props.classes.layoutArea}>
        <Layout blocks={props.layout.blocks} />
      </div>
    );
  }

  return null;
};

const MiddlePanelContainer = props => (
  <div className={props.classes.container}>{findAttributeComponent(props)}</div>
);

const processLayout = malcolmState => {
  const layout = {
    blocks: [],
  };

  const parentBlock = malcolmState.blocks[malcolmState.parentBlock];
  if (parentBlock && parentBlock.attributes) {
    const attribute = malcolmState.blocks[
      malcolmState.parentBlock
    ].attributes.find(a => a.name === malcolmState.mainAttribute);

    if (attribute && attribute.layout) {
      const layoutBlocks = attribute.layout.blocks
        .filter(b => b.visible)
        .map(b => ({
          ...b,
          position: {
            x: b.position.x + window.innerWidth / 2,
            y: b.position.y + window.innerHeight / 2 - 64,
          },
        }))
        .map(b => {
          const hasMatchingBlock = Object.prototype.hasOwnProperty.call(
            malcolmState.blocks,
            b.mri
          );
          if (hasMatchingBlock) {
            const updatedBlock = { ...b };
            const matchingBlock = malcolmState.blocks[b.mri];
            if (matchingBlock.attributes) {
              const iconAttribute = matchingBlock.attributes.find(
                a => a.name === 'icon'
              );

              if (iconAttribute) {
                updatedBlock.icon = iconAttribute.value;
              }

              const inputs = matchingBlock.attributes.filter(
                a =>
                  a.meta &&
                  a.meta.tags.some(tag => tag.indexOf('inport:') !== -1)
              );
              const outputs = matchingBlock.attributes.filter(
                a =>
                  a.meta &&
                  a.meta.tags.some(tag => tag.indexOf('outport:') !== -1)
              );

              updatedBlock.ports = [
                ...inputs.map(input => ({
                  label: input.name,
                  input: true,
                })),
                ...outputs.map(output => ({
                  label: output.name,
                  input: false,
                })),
              ];

              return updatedBlock;
            }
          }

          return b;
        });
      layout.blocks = layoutBlocks;
    }
  }

  return layout;
};

const mapStateToProps = state => ({
  mainAttribute: state.malcolm.mainAttribute,
  layout: processLayout(state.malcolm),
});

const mapDispatchToProps = () => ({});

findAttributeComponent.propTypes = {
  mainAttribute: PropTypes.string.isRequired,
  classes: PropTypes.shape({
    layoutArea: PropTypes.string,
  }).isRequired,
  layout: PropTypes.shape({
    blocks: PropTypes.arrayOf(PropTypes.shape({})),
  }),
};

findAttributeComponent.defaultProps = {
  layout: {
    blocks: [],
  },
};

MiddlePanelContainer.propTypes = {
  classes: PropTypes.shape({
    container: PropTypes.string,
  }).isRequired,
};

export default connect(mapStateToProps, mapDispatchToProps)(
  withStyles(styles)(MiddlePanelContainer)
);
