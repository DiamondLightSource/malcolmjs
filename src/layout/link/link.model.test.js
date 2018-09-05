import { Toolkit } from 'storm-react-diagrams';
import MalcolmLinkModel from './link.model';
import PathFinding from './PathFinding';

jest.mock('./PathFinding', () =>
  jest.fn().mockImplementation(() => ({
    calculateDirectPath: () => [],
    calculateLinkStartEndCoords: () => ({
      start: 'start',
      end: 'end',
      pathToStart: 'pathToStart',
      pathToEnd: 'pathToEnd',
    }),
    calculateDynamicPath: () => 'test auto routing path',
  }))
);

describe('link model', () => {
  let model;
  let diagramEngine;

  beforeEach(() => {
    diagramEngine = {
      smartRouting: false,
      getRoutingMatrix: () => [],
    };

    PathFinding.mockClear();
    Toolkit.generateDynamicPath = path => path;

    model = new MalcolmLinkModel();
    model.points = [{ x: 100, y: 100 }, { x: 200, y: 200 }];
    model.sourcePort = {
      x: 100,
      y: 100,
    };
    model.targetPort = {
      x: 200,
      y: 200,
    };
  });

  it('getPathSegments uses splines without autorouting', () => {
    const pathSegments = model.getPathSegments(diagramEngine);
    expect(pathSegments).toHaveLength(1);
    expect(pathSegments[0]).toEqual('M 100,100 C 150,100 150,200 200,200');
  });

  it('getPathSegments uses smart routing with autorouting', () => {
    diagramEngine.smartRouting = true;
    const pathSegments = model.getPathSegments(diagramEngine);

    expect(pathSegments).toHaveLength(1);
    expect(pathSegments[0]).toEqual('test auto routing path');
  });

  it('getPathSegments caches the result if the ports havent moved', () => {
    // this happens when the user pans round the view and causes a re-render even
    // though the position of the blocks hasn't changed
    const pathSegments = model.getPathSegments(diagramEngine);
    const updatedPathSegments = model.getPathSegments(diagramEngine);

    expect(updatedPathSegments).toBe(pathSegments);
  });

  it('getPathSegments does not cache the result if the blocks are the same distance apart', () => {
    const pathSegments = model.getPathSegments(diagramEngine);

    model.points = [{ x: 200, y: 200 }, { x: 300, y: 300 }];

    model.sourcePort = {
      x: 200,
      y: 200,
    };
    model.targetPort = {
      x: 300,
      y: 300,
      in: true,
    };

    const updatedPathSegments = model.getPathSegments(diagramEngine);

    expect(updatedPathSegments).not.toBe(pathSegments);
  });

  it('getPathSegments does not cache the result if the blocks move in x', () => {
    const pathSegments = model.getPathSegments(diagramEngine);

    model.points[0].x = 200;
    model.sourcePort.x = 200;

    const updatedPathSegments = model.getPathSegments(diagramEngine);

    expect(updatedPathSegments).not.toBe(pathSegments);
  });
});
