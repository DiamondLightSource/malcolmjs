import React from 'react';
import { storiesOf } from '@storybook/react';
import { withInfo } from '@storybook/addon-info';
import Layout from '../layout.component';

const styles = {
  layoutArea: {
    display: 'flex',
    width: '100%',
    height: 500,
    backgroundColor: 'rgb(48, 48, 48)',
    backgroundImage:
      'linear-gradient(0deg, transparent 24%, rgba(255, 255, 255, 0.05) 25%, rgba(255, 255, 255, 0.05) 26%, transparent 27%, transparent 74%, rgba(255, 255, 255, 0.05) 75%, rgba(255, 255, 255, 0.05) 76%, transparent 77%, transparent), linear-gradient(90deg, transparent 24%, rgba(255, 255, 255, 0.05) 25%, rgba(255, 255, 255, 0.05) 26%, transparent 27%, transparent 74%, rgba(255, 255, 255, 0.05) 75%, rgba(255, 255, 255, 0.05) 76%, transparent 77%, transparent)',
    backgroundSize: '50px 50px',
  },
};

const buildPort = (label, input) => ({
  label,
  input,
});

const block1Icon =
  '<svg version="1.1" viewBox="00 0 120 60" xmlns="http://www.w3.org/2000/svg">' +
  '<ellipse transform="matrix(-1,0,0,1,0,-10)" cx="-54.935" cy="40" rx="11" ry="28" d="m -43.935001,40 c 0,15.463973 -4.924868,28 -11,28 -6.075133,0 -11,-12.536027 -11,-28 0,-15.463973 4.924867,-28 11,-28 6.075132,0 11,12.536027 11,28 z" fill="#e6e6e6" fill-rule="evenodd" stroke="#000" stroke-width="1.2832px"/>' +
  '<ellipse transform="matrix(-1,0,0,1,0,-10)" cx="-54.935" cy="40" rx="6" ry="20" d="m -48.935001,40 c 0,11.045695 -2.686292,20 -6,20 -3.313709,0 -6,-8.954305 -6,-20 0,-11.045695 2.686291,-20 6,-20 3.313708,0 6,8.954305 6,20 z" fill="#e6e6e6" fill-rule="evenodd" stroke="#000" stroke-width=".97826px"/>' +
  '<rect transform="scale(-1,1)" x="-84.935" y="10" width="30" height="40" fill="#e6e6e6"/>' +
  '<path d="m54.935 10h30" fill="none" stroke="#000" stroke-width="1.0009px"/>' +
  '<path d="m54.935 50h30" fill="none" stroke="#000" stroke-width="1.0009px"/>' +
  '<ellipse transform="matrix(-1,0,0,1,0,-10)" cx="-70.935" cy="30.579" rx="1.3933" ry="1.4215" d="m -69.541698,30.579 c 0,0.785073 -0.623801,1.4215 -1.3933,1.4215 -0.769498,0 -1.3933,-0.636427 -1.3933,-1.4215 0,-0.785072 0.623802,-1.421499 1.3933,-1.421499 0.769499,0 1.3933,0.636427 1.3933,1.421499 z" fill-rule="evenodd" stroke="#000" stroke-width=".11159px"/>' +
  '<ellipse transform="matrix(-1,0,0,1,0,-10)" cx="-69.935" cy="29.579" rx="1.3933" ry="1.4215" d="m -68.541698,29.579 c 0,0.785073 -0.623801,1.4215 -1.3933,1.4215 -0.769498,0 -1.3933,-0.636427 -1.3933,-1.4215 0,-0.785072 0.623802,-1.421499 1.3933,-1.421499 0.769499,0 1.3933,0.636427 1.3933,1.421499 z" fill="#fff" fill-rule="evenodd"/>' +
  '<path d="m43.935 30h-14" fill="none" stroke="#000" stroke-width="1px"/>' +
  '<ellipse transform="matrix(-1,0,0,1,0,-10)" cx="-84.935" cy="40" rx="6" ry="20" d="m -78.934998,40 c 0,11.045695 -2.686291,20 -6,20 -3.313708,0 -6,-8.954305 -6,-20 0,-11.045695 2.686292,-20 6,-20 3.313709,0 6,8.954305 6,20 z" fill="#e6e6e6" fill-rule="evenodd" stroke="#000" stroke-width=".97826px"/>' +
  '<ellipse transform="matrix(-1,0,0,1,0,-10)" cx="-81.935" cy="40" rx="3" ry="10" d="m -78.934998,40 c 0,5.522847 -1.343145,10 -3,10 -1.656854,0 -3,-4.477153 -3,-10 0,-5.522847 1.343146,-10 3,-10 1.656855,0 3,4.477153 3,10 z" fill="#fff" fill-rule="evenodd" stroke="#000" stroke-width=".97826px"/>' +
  '<ellipse transform="translate(0,-10)" cx="80.435" cy="40" rx="1.5" ry="4.5" d="m 81.934998,40 c 0,2.485281 -0.671573,4.5 -1.5,4.5 -0.828428,0 -1.5,-2.014719 -1.5,-4.5 0,-2.485281 0.671572,-4.5 1.5,-4.5 0.828427,0 1.5,2.014719 1.5,4.5 z"/>' +
  '</svg>';

const block2Icon =
  '<svg version="1.1" viewBox="0 0 120 160" xmlns="http://www.w3.org/2000/svg">' +
  '<path d="m70 30h20" fill="none" stroke="#000" stroke-width="1px"/>' +
  '<path d="m70 50h20" fill="none" stroke="#000" stroke-width="1px"/>' +
  '<path d="m70 70h20" fill="none" stroke="#000" stroke-width="1px"/>' +
  '<path d="m70 90h20" fill="none" stroke="#000" stroke-width="1px"/>' +
  '<path d="m70 110h20" fill="none" stroke="#000" stroke-width="1px"/>' +
  '<path d="m70 130h20" fill="none" stroke="#000" stroke-width="1px"/>' +
  '<rect x="55" y="20" width="20" height="120" fill="#e6e6e6" stroke="#000"/>' +
  '<path d="m45 37h17c5 0 8 5 8 10v66c0 5-3 10-8 10h-17" fill="#e6e6e6" fill-rule="evenodd" stroke="#000" stroke-width="1px"/>' +
  '<path d="m45 37c5 0 8 5 8 10v66c0 5-3 10-8 10-3 0-5-2-5-5v-76c0-3.001 2-5 5-5z" fill="#e6e6e6" fill-rule="evenodd" stroke="#000" stroke-width="1px"/>' +
  '<ellipse transform="matrix(-1,0,0,1,0,90)" cx="-50" cy="-10" rx="1.5" ry="2.75" d="m -48.5,-10 c 0,1.5187831 -0.671573,2.75 -1.5,2.75 -0.828427,0 -1.5,-1.2312169 -1.5,-2.75 0,-1.518783 0.671573,-2.75 1.5,-2.75 0.828427,0 1.5,1.231217 1.5,2.75 z"/>' +
  '<ellipse transform="matrix(-1,0,0,1,0,90)" cx="-45" cy="-45" rx="1.5" ry="2.75" d="m -43.5,-45 c 0,1.518783 -0.671573,2.75 -1.5,2.75 -0.828427,0 -1.5,-1.231217 -1.5,-2.75 0,-1.518783 0.671573,-2.75 1.5,-2.75 0.828427,0 1.5,1.231217 1.5,2.75 z"/>' +
  '<ellipse transform="matrix(-1,0,0,1,0,90)" cx="-50" cy="-20" rx="1.5" ry="2.75" d="m -48.5,-20 c 0,1.518783 -0.671573,2.75 -1.5,2.75 -0.828427,0 -1.5,-1.231217 -1.5,-2.75 0,-1.518783 0.671573,-2.75 1.5,-2.75 0.828427,0 1.5,1.231217 1.5,2.75 z"/>' +
  '<ellipse transform="matrix(-1,0,0,1,0,90)" cx="-50" cy="-30" rx="1.5" ry="2.75" d="m -48.5,-30 c 0,1.518783 -0.671573,2.75 -1.5,2.75 -0.828427,0 -1.5,-1.231217 -1.5,-2.75 0,-1.518783 0.671573,-2.75 1.5,-2.75 0.828427,0 1.5,1.231217 1.5,2.75 z"/>' +
  '<ellipse transform="matrix(-1,0,0,1,0,90)" cx="-50" cy="-40" rx="1.5" ry="2.75" d="m -48.5,-40 c 0,1.518783 -0.671573,2.75 -1.5,2.75 -0.828427,0 -1.5,-1.231217 -1.5,-2.75 0,-1.518783 0.671573,-2.75 1.5,-2.75 0.828427,0 1.5,1.231217 1.5,2.75 z"/>' +
  '<ellipse transform="matrix(-1,0,0,1,0,90)" cx="-50" cy="20" rx="1.5" ry="2.75" d="m -48.5,20 c 0,1.518783 -0.671573,2.75 -1.5,2.75 -0.828427,0 -1.5,-1.231217 -1.5,-2.75 0,-1.518783 0.671573,-2.75 1.5,-2.75 0.828427,0 1.5,1.231217 1.5,2.75 z"/>' +
  '<ellipse transform="matrix(-1,0,0,1,0,90)" cx="-50" cy="10" rx="1.5" ry="2.75" d="m -48.5,10 c 0,1.518783 -0.671573,2.75 -1.5,2.75 -0.828427,0 -1.5,-1.231217 -1.5,-2.75 0,-1.5187831 0.671573,-2.75 1.5,-2.75 0.828427,0 1.5,1.2312169 1.5,2.75 z"/>' +
  '<ellipse transform="matrix(-1,0,0,1,0,90)" cx="-50" rx="1.5" ry="2.75" d="m -48.5,0 c 0,1.5187831 -0.671573,2.75 -1.5,2.75 -0.828427,0 -1.5,-1.2312169 -1.5,-2.75 0,-1.5187831 0.671573,-2.75 1.5,-2.75 0.828427,0 1.5,1.2312169 1.5,2.75 z"/>' +
  '<ellipse transform="matrix(-1,0,0,1,0,90)" cx="-45" cy="5" rx="1.5" ry="2.75" d="m -43.5,5 c 0,1.5187831 -0.671573,2.75 -1.5,2.75 -0.828427,0 -1.5,-1.2312169 -1.5,-2.75 0,-1.5187831 0.671573,-2.75 1.5,-2.75 0.828427,0 1.5,1.2312169 1.5,2.75 z"/>' +
  '<ellipse transform="matrix(-1,0,0,1,0,90)" cx="-45" cy="-5" rx="1.5" ry="2.75" d="m -43.5,-5 c 0,1.5187831 -0.671573,2.75 -1.5,2.75 -0.828427,0 -1.5,-1.2312169 -1.5,-2.75 0,-1.5187831 0.671573,-2.75 1.5,-2.75 0.828427,0 1.5,1.2312169 1.5,2.75 z"/>' +
  '<ellipse transform="matrix(-1,0,0,1,0,90)" cx="-45" cy="-15" rx="1.5" ry="2.75" d="m -43.5,-15 c 0,1.518783 -0.671573,2.75 -1.5,2.75 -0.828427,0 -1.5,-1.231217 -1.5,-2.75 0,-1.518783 0.671573,-2.75 1.5,-2.75 0.828427,0 1.5,1.231217 1.5,2.75 z"/>' +
  '<ellipse transform="matrix(-1,0,0,1,0,90)" cx="-45" cy="-25" rx="1.5" ry="2.75" d="m -43.5,-25 c 0,1.518783 -0.671573,2.75 -1.5,2.75 -0.828427,0 -1.5,-1.231217 -1.5,-2.75 0,-1.518783 0.671573,-2.75 1.5,-2.75 0.828427,0 1.5,1.231217 1.5,2.75 z"/>' +
  '<ellipse transform="matrix(-1,0,0,1,0,90)" cx="-45" cy="25" rx="1.5" ry="2.75" d="m -43.5,25 c 0,1.518783 -0.671573,2.75 -1.5,2.75 -0.828427,0 -1.5,-1.231217 -1.5,-2.75 0,-1.518783 0.671573,-2.75 1.5,-2.75 0.828427,0 1.5,1.231217 1.5,2.75 z"/>' +
  '<ellipse transform="matrix(-1,0,0,1,0,90)" cx="-45" cy="15" rx="1.5" ry="2.75" d="m -43.5,15 c 0,1.518783 -0.671573,2.75 -1.5,2.75 -0.828427,0 -1.5,-1.231217 -1.5,-2.75 0,-1.518783 0.671573,-2.75 1.5,-2.75 0.828427,0 1.5,1.231217 1.5,2.75 z"/>' +
  '<ellipse transform="matrix(-1,0,0,1,0,90)" cx="-45" cy="-35" rx="1.5" ry="2.75" d="m -43.5,-35 c 0,1.518783 -0.671573,2.75 -1.5,2.75 -0.828427,0 -1.5,-1.231217 -1.5,-2.75 0,-1.518783 0.671573,-2.75 1.5,-2.75 0.828427,0 1.5,1.231217 1.5,2.75 z"/>' +
  '<path d="m60 134h5c1 0 2-2 2-4s-1-4-2-4h-5" fill="#e6e6e6" stroke="#000"/>' +
  '<ellipse transform="matrix(-1,0,0,1,0,90)" cx="-60" cy="40" rx="2" ry="4" d="m -58,40 c 0,2.209139 -0.895431,4 -2,4 -1.104569,0 -2,-1.790861 -2,-4 0,-2.209139 0.895431,-4 2,-4 1.104569,0 2,1.790861 2,4 z" fill="#e6e6e6" stroke="#000"/>' +
  '<path d="m61 34h4c1 0 2-2 2-4s-1-4-2-4h-5" fill="#e6e6e6" stroke="#000"/>' +
  '<ellipse transform="matrix(-1,0,0,1,0,90)" cx="-60" cy="-60" rx="2" ry="4" d="m -58,-60 c 0,2.209139 -0.895431,4 -2,4 -1.104569,0 -2,-1.790861 -2,-4 0,-2.209139 0.895431,-4 2,-4 1.104569,0 2,1.790861 2,4 z" fill="#e6e6e6" stroke="#000"/>' +
  '</svg>';

const block1 = {
  name: 'TTLOUT3',
  description: 'TTL output 3',
  ports: [buildPort('val', true)],
  icon: block1Icon,
  position: {
    x: 300,
    y: 150,
  },
};

const block2 = {
  name: 'INENC1',
  description: 'Input Encoder 1',
  ports: [
    buildPort('clk', true),
    buildPort('a', false),
    buildPort('b', false),
    buildPort('z', false),
    buildPort('data', false),
    buildPort('conn', false),
    buildPort('val', false),
  ],
  icon: block2Icon,
  position: {
    x: 100,
    y: 100,
  },
};

const buildDiagram = blocks => (
  <div style={styles.layoutArea}>
    <Layout blocks={blocks} />
  </div>
);

storiesOf('Layout/block', module)
  .add(
    'default block',
    withInfo(`
  An example of a MalcolmJS block in the layout view.
  `)(() => buildDiagram([block1]))
  )
  .add(
    'multiple blocks',
    withInfo(`
  An example of multiple MalcolmJS blockd in the layout view.
  `)(() => buildDiagram([block1, block2]))
  );
