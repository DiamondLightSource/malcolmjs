import { Toolkit } from 'storm-react-diagrams';

const getFirstControlPoints = rhs => {
  const n = rhs.length;
  const x = new Array(n).fill(0);
  const tmp = new Array(n).fill(0);

  let b = 2.0;
  x[0] = rhs[0] / b;
  for (let i = 1; i < n; i += 1) {
    tmp[i] = 1.0 / b;
    b = (i < n - 1 ? 4.0 : 3.5) - tmp[i];
    x[i] = (rhs[i] - x[i - 1]) / b;
  }

  for (let i = 1; i < n; i += 1) {
    x[n - i - 1] -= tmp[n - i] * x[n - i];
  }

  return x;
};

const buildTwoPointPath = points => {
  const interPortSpacing = 40;
  if (points[1].x - interPortSpacing < points[0].x) {
    const curveFactor = (points[0].x - points[1].x) * interPortSpacing / 60;

    const c1 = {};
    const c2 = {};

    if (Math.abs(points[1].y - points[0].y) < interPortSpacing * 4) {
      // Loopback
      c1.x = points[0].x + curveFactor;
      c1.y = points[0].y - curveFactor;
      c2.x = points[1].x - curveFactor;
      c2.y = points[1].y - curveFactor;
    } else {
      // Stick out some
      c1.x = points[0].x + curveFactor;
      c1.y =
        points[0].y + (points[1].y > points[0].y ? curveFactor : -curveFactor);
      c2.x = points[1].x - curveFactor;
      c2.y =
        points[1].y + (points[1].y > points[0].y ? -curveFactor : curveFactor);
    }

    const path = `M ${points[0].x},${points[0].y} C ${c1.x},${c1.y} ${c2.x},${
      c2.y
    } ${points[1].x},${points[1].y}`;

    return [path];
  }
  const isHorizontal =
    Math.abs(points[0].x - points[1].x) > Math.abs(points[0].y - points[1].y);
  const xOrY = isHorizontal ? 'x' : 'y';

  let pointLeft = points[0];
  let pointRight = points[1];

  // some defensive programming to make sure the smoothing is
  // always in the right direction
  if (pointLeft[xOrY] > pointRight[xOrY]) {
    [pointRight, pointLeft] = points;
  }

  return [Toolkit.generateCurvePath(pointLeft, pointRight, 50)];
};

// algorithm from here https://www.codeproject.com/Articles/31859/Draw-a-Smooth-Curve-through-a-Set-of-2D-Points-wit
const buildPath = knots => {
  const n = knots.length - 1;
  let firstControl;
  let secondControl;

  if (n === 1) {
    return [buildTwoPointPath(knots)];
  }

  const rhs = new Array(n).fill(0);
  for (let i = 1; i < n - 1; i += 1) {
    rhs[i] = 4 * knots[i].x + 2 * knots[i + 1].x;
  }
  rhs[0] = knots[0].x + 2 * knots[1].x;
  rhs[n - 1] = (8 * knots[n - 1].x + knots[n].x) / 2.0;

  const x = getFirstControlPoints(rhs);

  for (let i = 1; i < n - 1; i += 1) {
    rhs[i] = 4 * knots[i].y + 2 * knots[i + 1].y;
  }
  rhs[0] = knots[0].y + 2 * knots[1].y;
  rhs[n - 1] = (8 * knots[n - 1].y + knots[n].y) / 2.0;
  const y = getFirstControlPoints(rhs);

  const paths = [];
  let path;
  for (let i = 0; i < n; i += 1) {
    path = `M${knots[i].x},${knots[i].y} `;

    firstControl = {
      x: x[i],
      y: y[i],
    };

    path += `C${firstControl.x},${firstControl.y} `;
    if (i < n - 1) {
      secondControl = {
        x: 2 * knots[i + 1].x - x[i + 1],
        y: 2 * knots[i + 1].y - y[i + 1],
      };
    } else {
      secondControl = {
        x: (knots[n].x + x[n - 1]) / 2,
        y: (knots[n].y + y[n - 1]) / 2,
      };
    }

    path += `${secondControl.x},${secondControl.y} `;
    path += `${knots[i + 1].x},${knots[i + 1].y}`;

    paths.push(path);
  }

  return paths;
};

export default {
  buildPath,
};
