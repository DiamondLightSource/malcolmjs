// import React from 'react';
// import {
//   DefaultLinkWidget,
//   BaseWidget,
//   PointModel,
//   Toolkit,
// } from 'storm-react-diagrams';
// import PathFinding from './PathFinding';
// import SplineUtils from './splineUtils';

// class MalcolmAutoLinkSegment extends BaseWidget {
//   constructor(props) {
//     super('srd-default-link', props);

//     this.refLabels = {};
//     this.refPaths = [];
//     this.state = {
//       selected: false,
//     };
//   }

//   generatePoint(pointIndex) {
//     const { x, y } = this.props.link.points[pointIndex];

//     return (
//       <g key={`point-${this.props.link.points[pointIndex].id}`}>
//         <circle
//           cx={x}
//           cy={y}
//           r={5}
//           className={`point ${this.bem('__point')}${
//             this.props.link.points[pointIndex].isSelected()
//               ? this.bem('--point-selected')
//               : ''
//           }`}
//         />
//         <circle
//           onMouseLeave={() => {
//             this.setState({ selected: false });
//           }}
//           onMouseEnter={() => {
//             this.setState({ selected: true });
//           }}
//           data-id={this.props.link.points[pointIndex].id}
//           data-linkid={this.props.link.id}
//           cx={x}
//           cy={y}
//           r={15}
//           opacity={0}
//           className={`point ${this.bem('__point')}`}
//         />
//       </g>
//     );
//   }

//   generateLink(path, extraProps, id) {
//     const { props } = this;

//     const Bottom = React.cloneElement(
//       props.diagramEngine
//         .getFactoryForLink(this.props.link)
//         .generateLinkSegment(
//           this.props.link,
//           this,
//           this.state.selected || this.props.link.isSelected(),
//           path
//         ),
//       {
//         ref: ref => ref && this.refPaths.push(ref),
//       }
//     );

//     const Top = React.cloneElement(Bottom, {
//       ...extraProps,
//       strokeLinecap: 'round',
//       onMouseLeave: () => {
//         this.setState({ selected: false });
//       },
//       onMouseEnter: () => {
//         this.setState({ selected: true });
//       },
//       ref: null,
//       'data-linkid': this.props.link.getID(),
//       strokeOpacity: this.state.selected ? 0.1 : 0,
//       strokeWidth: 20,
//     });

//     return (
//       <g key={`link-${id}`}>
//         {Bottom}
//         {Top}
//       </g>
//     );
//   }

//   render() {
//     const { diagramEngine } = this.props;
//     if (!diagramEngine.nodesRendered) {
//       return null;
//     }

//     const { points } = this.props.link;

//     // push the link out from the block
//     let augmentedPoints = [...points];
//     if (points.length >= 2) {
//       augmentedPoints = [
//         points[0],
//         {
//           x: points[0].x + 20,
//           y: points[0].y,
//         },
//         ...points.slice(1, points.length - 2),
//         {
//           x: points[points.length - 1].x - 20,
//           y: points[points.length - 1].y,
//         },
//         points[points.length - 1],
//       ];
//     }

//     const paths = [];

//     if (paths.length === 0) {
//       const pathFinding = new PathFinding(diagramEngine);
//       const routingMatrix = diagramEngine.getRoutingMatrix();

//       const directPathCoords = pathFinding.calculateDirectPath(
//         augmentedPoints[0],
//         augmentedPoints[augmentedPoints.length - 1]
//       );

//       const smartLink = pathFinding.calculateLinkStartEndCoords(
//         routingMatrix,
//         directPathCoords
//       );
//       const { start, end, pathToStart, pathToEnd } = smartLink;

//       // second step: calculate a path avoiding hitting other elements
//       const simplifiedPath = pathFinding.calculateDynamicPath(
//         routingMatrix,
//         start,
//         end,
//         pathToStart,
//         pathToEnd
//       );

//       paths.push(
//         Toolkit.generateDynamicPath(simplifiedPath),
//         {
//           'data-linkid': this.props.link.id,
//           'data-point': 0,
//         },
//         0
//       );

//       // const pathSegments = SplineUtils.buildPath(augmentedPoints);
//       // for (let j = 0; j < pathSegments.length; j += 1) {
//       //   paths.push(
//       //     this.generateLink(
//       //       pathSegments[j],
//       //       {
//       //         'data-linkid': this.props.link.id,
//       //         'data-point': j,
//       //       },
//       //       j
//       //     )
//       //   );
//       // }

//       // render the circles
//       for (let i = 1; i < points.length - 1; i += 1) {
//         paths.push(this.generatePoint(i));
//       }

//       if (this.props.link.targetPort === null) {
//         paths.push(this.generatePoint(points.length - 1));
//       }
//     }

//     this.refPaths = [];
//     return <g {...this.getProps()}>{paths}</g>;
//   }
// }

// export default MalcolmAutoLinkSegment;
