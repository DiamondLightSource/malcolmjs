import React from 'react';
import { BaseWidget } from 'storm-react-diagrams';

class MalcolmAutoLinkSegment extends BaseWidget {
  constructor(props) {
    super('srd-default-link', props);

    this.refLabels = {};
    this.refPaths = [];
    this.state = {
      selected: false,
      hovering: false,
    };
  }

  generatePoint(pointIndex) {
    const { x, y } = this.props.link.points[pointIndex];

    return (
      <g key={`point-${this.props.link.points[pointIndex].id}`}>
        <circle
          cx={x}
          cy={y}
          r={5}
          className={`point ${this.bem('__point')}${
            this.props.link.points[pointIndex].isSelected()
              ? this.bem('--point-selected')
              : ''
          }`}
        />
        <circle
          onMouseLeave={() => {
            this.setState({ ...this.state, hovering: false });
          }}
          onMouseEnter={() => {
            this.setState({ ...this.state, hovering: true });
          }}
          data-id={this.props.link.points[pointIndex].id}
          data-linkid={this.props.link.id}
          cx={x}
          cy={y}
          r={15}
          opacity={0}
          className={`point ${this.bem('__point')}`}
        />
      </g>
    );
  }

  generateLink(path, extraProps, id) {
    const { props } = this;

    const Bottom = React.cloneElement(
      props.diagramEngine
        .getFactoryForLink(this.props.link)
        .generateLinkSegment(
          this.props.link,
          this,
          this.state.selected || this.props.link.isSelected(),
          this.state.hovering,
          path
        ),
      {
        ref: ref => ref && this.refPaths.push(ref),
      }
    );

    const Top = React.cloneElement(Bottom, {
      ...extraProps,
      strokeLinecap: 'butt',
      onMouseLeave: () => {
        this.setState({ ...this.state, hovering: false });
      },
      onMouseEnter: () => {
        this.setState({ ...this.state, hovering: true });
      },
      ref: null,
      'data-linkid': this.props.link.getID(),
      strokeOpacity: this.state.hovering ? 0.1 : 0,
      strokeWidth: 20,
    });

    return (
      <g key={`link-${id}`}>
        {Bottom}
        {Top}
      </g>
    );
  }

  render() {
    const { diagramEngine } = this.props;
    if (!diagramEngine.nodesRendered) {
      return null;
    }

    const { points } = this.props.link;
    const pathSegments = this.props.link.getPathSegments(diagramEngine);

    const paths = [];

    for (let j = 0; j < pathSegments.length; j += 1) {
      paths.push(
        this.generateLink(
          pathSegments[j],
          {
            'data-linkid': this.props.link.id,
            'data-point': j,
          },
          j
        )
      );
    }

    // render the circles
    for (let i = 1; i < points.length - 1; i += 1) {
      paths.push(this.generatePoint(i));
    }

    if (this.props.link.targetPort === null) {
      paths.push(this.generatePoint(points.length - 1));
    }

    this.refPaths = [];
    return <g {...this.getProps()}>{paths}</g>;
  }
}

export default MalcolmAutoLinkSegment;
