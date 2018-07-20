import React from 'react';
import { BaseWidget, PointModel } from 'storm-react-diagrams';
import SplineUtils from './splineUtils';

class MalcolmLinkSegment extends BaseWidget {
  constructor(props) {
    super('srd-default-link', props);

    this.refLabels = {};
    this.refPaths = [];
    this.state = {
      selected: false,
    };
  }

  addPointToLink(event, index) {
    if (
      !event.shiftKey &&
      !this.props.diagramEngine.isModelLocked(this.props.link) &&
      this.props.link.points.length - 1 <=
        this.props.diagramEngine.getMaxNumberPointsPerLink()
    ) {
      const point = new PointModel(
        this.props.link,
        this.props.diagramEngine.getRelativeMousePoint(event)
      );
      point.setSelected(true);
      this.forceUpdate();
      this.props.link.addPoint(point, index);
      this.props.pointAdded(point, event);
    }
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
            this.setState({ selected: false });
          }}
          onMouseEnter={() => {
            this.setState({ selected: true });
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
          path
        ),
      {
        ref: ref => ref && this.refPaths.push(ref),
      }
    );

    const Top = React.cloneElement(Bottom, {
      ...extraProps,
      strokeLinecap: 'round',
      onMouseLeave: () => {
        this.setState({ selected: false });
      },
      onMouseEnter: () => {
        this.setState({ selected: true });
      },
      ref: null,
      'data-linkid': this.props.link.getID(),
      strokeOpacity: this.state.selected ? 0.1 : 0,
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

    // ensure id is present for all points on the path
    const { points } = this.props.link;
    const paths = [];

    if (paths.length === 0) {
      const pathSegments = SplineUtils.buildPath(points);
      for (let j = 0; j < pathSegments.length; j += 1) {
        paths.push(
          this.generateLink(
            pathSegments[j],
            {
              'data-linkid': this.props.link.id,
              'data-point': j,
              onMouseDown: event => {
                this.addPointToLink(event, j + 1);
              },
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
    }

    this.refPaths = [];
    return <g {...this.getProps()}>{paths}</g>;
  }
}

export default MalcolmLinkSegment;
