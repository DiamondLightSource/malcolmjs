// a clone of https://github.com/projectstorm/react-diagrams/blob/master/src/routing/PathFinding.ts because the export didn't work properly
// and we needed to customise the auto routing
// ideally we want to get to the point we can just import this from react diagrams.
import * as PF from 'pathfinding';

/*
it can be very expensive to calculate routes when every single pixel on the canvas
is individually represented. Using the factor below, we combine values in order
to achieve the best trade-off between accuracy and performance.
*/
export const ROUTING_SCALING_FACTOR = 5;

const pathFinderInstance = new PF.JumpPointFinder({
  heuristic: PF.Heuristic.manhattan,
  diagonalMovement: PF.DiagonalMovement.Never,
});

export default class PathFinding {
  constructor(diagramEngine) {
    this.instance = pathFinderInstance;
    this.diagramEngine = diagramEngine;
  }

  /**
   * Taking as argument a fully unblocked walking matrix, this method
   * finds a direct path from point A to B.
   */
  calculateDirectPath(from, to) {
    const matrix = this.diagramEngine.getCanvasMatrix();
    const grid = new PF.Grid(matrix);

    return pathFinderInstance.findPath(
      this.diagramEngine.translateRoutingX(
        Math.floor(from.x / ROUTING_SCALING_FACTOR)
      ),
      this.diagramEngine.translateRoutingY(
        Math.floor(from.y / ROUTING_SCALING_FACTOR)
      ),
      this.diagramEngine.translateRoutingX(
        Math.floor(to.x / ROUTING_SCALING_FACTOR)
      ),
      this.diagramEngine.translateRoutingY(
        Math.floor(to.y / ROUTING_SCALING_FACTOR)
      ),
      grid
    );
  }

  /**
   * Using @link{#calculateDirectPath}'s result as input, we here
   * determine the first walkable point found in the matrix that includes
   * blocked paths.
   */
  /* eslint-disable class-methods-use-this */
  calculateLinkStartEndCoords(matrix, path) {
    const startIndex = path.findIndex(
      point => matrix[point[1]][point[0]] === 0
    );
    const endIndex =
      path.length -
      1 -
      path
        .slice()
        .reverse()
        .findIndex(point => matrix[point[1]][point[0]] === 0);

    // are we trying to create a path exclusively through blocked areas?
    // if so, let's fallback to the linear routing
    if (startIndex === -1 || endIndex === -1) {
      return undefined;
    }

    const pathToStart = path.slice(0, startIndex);
    const pathToEnd = path.slice(endIndex);

    return {
      start: {
        x: path[startIndex][0],
        y: path[startIndex][1],
      },
      end: {
        x: path[endIndex][0],
        y: path[endIndex][1],
      },
      pathToStart,
      pathToEnd,
    };
  }
  /* eslint-enable */

  /**
   * Puts everything together: merges the paths from/to the centre of the ports,
   * with the path calculated around other elements.
   */
  calculateDynamicPath(routingMatrix, start, end, pathToStart, pathToEnd) {
    // generate the path based on the matrix with obstacles
    const grid = new PF.Grid(routingMatrix);
    const dynamicPath = pathFinderInstance.findPath(
      start.x,
      start.y,
      end.x,
      end.y,
      grid
    );

    // aggregate everything to have the calculated path ready for rendering
    const pathCoords = pathToStart
      .concat(dynamicPath, pathToEnd)
      .map(coords => [
        this.diagramEngine.translateRoutingX(coords[0], true),
        this.diagramEngine.translateRoutingY(coords[1], true),
      ]);
    return PF.Util.compressPath(pathCoords);
  }
}
