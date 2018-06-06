import splineUtils from './splineUtils';

const pointsMatch = (actual, expected) => {
  const regex = new RegExp('[-\\d.]+,[-\\d.]+', 'g'); // match number pairs ##.###,##.####
  const matches = [];
  let match = regex.exec(actual);
  while (match != null) {
    const point = match[0].split(',');
    matches.push({ x: parseFloat(point[0]), y: parseFloat(point[1]) });
    match = regex.exec(actual);
  }

  expect(matches).toHaveLength(expected.length);
  matches.forEach((actualPoint, i) => {
    expect(actualPoint.x).toBeCloseTo(expected[i].x, 5);
    expect(actualPoint.y).toBeCloseTo(expected[i].y, 5);
  });
};

describe('SplineUtils', () => {
  it('generates spline between two normal points', () => {
    const points = [{ x: 0, y: 0 }, { x: 50, y: 0 }];
    const spline = splineUtils.buildPath(points);

    expect(spline).toHaveLength(1);
    pointsMatch(spline[0], [
      { x: 0, y: 0 },
      { x: 50, y: 0 },
      { x: 0, y: 0 },
      { x: 50, y: 0 },
    ]);
  });

  it('generates spline between two points where the target is behind', () => {
    const points = [{ x: 0, y: 0 }, { x: -200, y: 200 }];
    const spline = splineUtils.buildPath(points);

    expect(spline).toHaveLength(1);
    pointsMatch(spline[0], [
      { x: 0, y: 0 },
      { x: 133.33333333333, y: 133.33333333333 },
      { x: -333.3333333333, y: 66.66666666666 },
      { x: -200, y: 200 },
    ]);
  });

  it('generates loopback spline between two points where the target is behind but at the same level', () => {
    const points = [{ x: 0, y: 0 }, { x: -200, y: 0 }];
    const spline = splineUtils.buildPath(points);

    expect(spline).toHaveLength(1);
    pointsMatch(spline[0], [
      { x: 0, y: 0 },
      { x: 133.3333333333, y: -133.3333333333 },
      { x: -333.3333333333, y: -133.3333333333 },
      { x: -200, y: 0 },
    ]);
  });

  it('generates spline between three normal points', () => {
    const points = [{ x: 0, y: 0 }, { x: 200, y: 200 }, { x: 400, y: 0 }];
    const spline = splineUtils.buildPath(points);

    expect(spline).toHaveLength(2);
    pointsMatch(spline[0], [
      { x: 0, y: 0 },
      { x: 66.66666666667, y: 100 },
      { x: 133.333333333, y: 200 },
      { x: 200, y: 200 },
    ]);

    pointsMatch(spline[1], [
      { x: 200, y: 200 },
      { x: 266.666666666, y: 200 },
      { x: 333.333333333, y: 100 },
      { x: 400, y: 0 },
    ]);
  });

  it('generates spline between four normal points', () => {
    const points = [
      { x: 0, y: 0 },
      { x: 200, y: 200 },
      { x: 400, y: 0 },
      { x: 600, y: -200 },
    ];
    const spline = splineUtils.buildPath(points);

    expect(spline).toHaveLength(3);
    pointsMatch(spline[0], [
      { x: 0, y: 0 },
      { x: 66.66666666667, y: 102.2222222 },
      { x: 133.333333333, y: 204.44444444 },
      { x: 200, y: 200 },
    ]);

    pointsMatch(spline[1], [
      { x: 200, y: 200 },
      { x: 266.666666666, y: 195.55555555 },
      { x: 333.333333333, y: 84.444444444 },
      { x: 400, y: 0 },
    ]);

    pointsMatch(spline[2], [
      { x: 400, y: 0 },
      { x: 466.666666666, y: -84.44444444 },
      { x: 533.333333333, y: -142.22222222 },
      { x: 600, y: -200 },
    ]);
  });
});
