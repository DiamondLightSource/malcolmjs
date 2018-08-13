import ELK from 'elkjs/lib/elk.bundled';
import { malcolmPutAction, malcolmSetFlag } from '../malcolmActionCreators';

const calculateHeight = (layoutEngine, mri) => {
  const zoomFactor = layoutEngine.diagramModel.zoom / 100;
  return (
    layoutEngine.getNodeDimensions(layoutEngine.diagramModel.nodes[mri])
      .height / zoomFactor
  );
};

const runAutoLayout = () => (dispatch, getState) => {
  const state = getState();
  const { blocks } = state.malcolm.layout;
  const { parentBlock, mainAttribute } = state.malcolm;
  const { links } = state.malcolm.layoutEngine.diagramModel;

  const graph = {
    id: 'root',
    layoutOptions: {
      'elk.algorithm': 'layered',
      separateConnectedComponents: true,
      'spacing.componentComponent': 70,
      spacing: 100,
      'spacing.nodeNodeBetweenLayers': 70,
      'elk.edgeRouting': 'SPLINES',
    },
    children: blocks.map(b => ({
      id: b.mri,
      width: 120,
      height: calculateHeight(state.malcolm.layoutEngine, b.mri),
      x: b.position.x,
      y: b.position.y,
      properties: {
        portConstraints: 'FIXED_ORDER',
      },
      ports: b.ports.map((p, i) => ({
        id: `${b.mri}-${p.label}`,
        properties: {
          side: p.input ? 'WEST' : 'EAST',
          index: p.input ? b.ports.length - i : i,
        },
        width: 12,
        height: 12,
      })),
    })),
    edges: Object.values(links).map((link, i) => ({
      id: `e${i}`,
      sources: [link.sourcePort.id],
      targets: [link.targetPort.id],
    })),
  };

  // The JSON graph can be visualised here https://rtsys.informatik.uni-kiel.de/elklive/json.html
  console.log(JSON.stringify(graph));
  console.log(
    `Graph can be visualised at https://rtsys.informatik.uni-kiel.de/elklive/json.html`
  );

  const elk = new ELK();
  return elk
    .layout(graph)
    .then(graphLayout => {
      console.log('completed auto layout');
      const centerX =
        graphLayout.children.reduce((prev, next) => prev + next.x, 0) /
        graphLayout.children.length;
      const centerY =
        graphLayout.children.reduce((prev, next) => prev + next.y, 0) /
        graphLayout.children.length;

      // we only need to send an update for the visible blocks
      const updatedLayout = {
        name: blocks.map(b => b.name),
        visible: blocks.map(b => b.visible),
        mri: blocks.map(b => b.mri),
        x: blocks
          .map(b => b.mri)
          .map(mri => graphLayout.children.find(c => c.id === mri).x - centerX),
        y: blocks
          .map(b => b.mri)
          .map(mri => graphLayout.children.find(c => c.id === mri).y - centerY),
      };

      dispatch(malcolmSetFlag([parentBlock, mainAttribute], 'pending', true));
      dispatch(
        malcolmPutAction([parentBlock, mainAttribute, 'value'], updatedLayout)
      );
    })
    .catch(err => {
      console.log('error creating auto layout');
      console.log(err);
    });
};

export default {
  runAutoLayout,
};
