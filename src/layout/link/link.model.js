import { DefaultLinkModel, Toolkit } from 'storm-react-diagrams';
import PathFinding from './PathFinding';
import SplineUtils from './splineUtils';

class MalcolmLinkModel extends DefaultLinkModel {
  constructor() {
    super('malcolmlink');
    this.width = 3;
    this.sourceX = 10000000000;
    this.sourceY = 10000000000;
    this.targetX = 10000000000;
    this.targetY = 10000000000;
    this.pathSegments = undefined;
  }

  getPathSegments(diagramEngine) {
    // if the blocks are all moving together don't bother recalculating
    if (
      this.sourcePort &&
      this.targetPort &&
      (Math.abs(this.sourceX - this.sourcePort.x) < 0.1 &&
        Math.abs(this.sourceY - this.sourcePort.y) < 0.1) &&
      (Math.abs(this.targetX - this.targetPort.x) < 0.1 &&
        Math.abs(this.targetY - this.targetPort.y) < 0.1)
    ) {
      return this.pathSegments;
    }
    // calculate new segments
    let paths = [];

    if (diagramEngine.smartRouting) {
      // push the link out from the block
      let augmentedPoints = [...this.points];
      if (this.points.length >= 2) {
        augmentedPoints = [
          this.points[0],
          {
            x: this.points[0].x + 40,
            y: this.points[0].y,
          },
          ...this.points.slice(1, this.points.length - 2),
          {
            x: this.points[this.points.length - 1].x - 40,
            y: this.points[this.points.length - 1].y,
          },
          this.points[this.points.length - 1],
        ];
      }

      const pathFinding = new PathFinding(diagramEngine);
      const routingMatrix = diagramEngine.getRoutingMatrix();

      let directPathCoords = [];
      augmentedPoints.slice(0, -1).forEach((p, i) => {
        directPathCoords = [
          ...directPathCoords,
          ...pathFinding.calculateDirectPath(
            augmentedPoints[i],
            augmentedPoints[i + 1]
          ),
        ];
      });

      const smartLink = pathFinding.calculateLinkStartEndCoords(
        routingMatrix,
        directPathCoords
      );

      if (smartLink) {
        const { start, end, pathToStart, pathToEnd } = smartLink;

        // second step: calculate a path avoiding hitting other elements
        const simplifiedPath = pathFinding.calculateDynamicPath(
          routingMatrix,
          start,
          end,
          pathToStart,
          pathToEnd
        );

        paths.push(Toolkit.generateDynamicPath(simplifiedPath));
      }
    }

    if (paths.length === 0) {
      paths = SplineUtils.buildPath(this.points);
    }

    this.pathSegments = paths;

    // update the memoization
    if (this.sourcePort && this.targetPort) {
      this.differentInX = this.targetPort.x - this.sourcePort.x;
      this.differentInY = this.targetPort.y - this.sourcePort.y;

      this.sourceX = this.sourcePort.x;
      this.sourceY = this.sourcePort.y;
      this.targetX = this.targetPort.x;
      this.targetY = this.targetPort.y;
    }
    return this.pathSegments;
  }
}

export default MalcolmLinkModel;
