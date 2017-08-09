/**
 * Created by twi18192 on 18/01/16.
 */

import * as React from '../../node_modules/react/react';
import PropTypes from 'prop-types';
//import InlineSVG from 'svg-inline-react';
//import SVGInline from "react-svg-inline"

export default class BlockRectangle extends React.Component
{
  constructor(props)
    {
    super(props);
    }

  shouldComponentUpdate(nextProps, nextState)
    {
    return (nextProps.selected !== this.props.selected)
    }

  render()
    {
    //console.log("render: blockRectangle");

   //cleanup={["title", "desc", "comment", "defs"]}
    /* Use this for when all icons are available */
/*
    let blockIconSVG = <SVGInline
                        svg={this.props.blockIconSVG}
                        component={"svg"}
                        cleanup={["title", "desc", "comment", "defs"]}
                        height={(blockStyling.innerRectangleHeight/2).toString()}
                        width={(blockStyling.innerRectangleWidth/2).toString()}
                        viewBox={`0 0 ${(blockStyling.innerRectangleWidth/2).toString()} ${(blockStyling.innerRectangleHeight/2).toString()}`}
                        />;
*/
/*
      let blockIconSVG = React.cloneElement(rawBlockIconSVG, {height:{blockStyling.innerRectangleHeight.toString()},
                                                              width:{blockStyling.innerRectangleWidth.toString()},
                                                              viewBox:{`0 0 ${blockStyling.innerRectangleWidth.toString()} ${blockStyling.innerRectangleHeight.toString()}`}} )
*/
   // blockIconSVG.props.height = blockStyling.innerRectangleHeight.toString();
    //blockIconSVG.props.width = blockStyling.innerRectangleWidth.toString();
    //blockIconSVG.props.viewBox = `0 0 ${blockStyling.innerRectangleWidth.toString()} ${blockStyling.innerRectangleHeight.toString()}`;

    let blockStyling = this.props.blockStyling;

    let svgProps = {height:blockStyling.innerRectangleHeight.toString(),
                    width:blockStyling.innerRectangleWidth.toString(),
                    viewBox:"0 0 "+blockStyling.innerRectangleWidth.toString()+" "+blockStyling.innerRectangleHeight.toString(),
                    dangerouslySetInnerHTML:{__html: this.props.blockIconSVG}};


    //let parser = new DOMParser();
    //let doc = parser.parseFromString(this.props.blockIconSVG, "image/svg+xml");
    //let ele  = doc.documentElement;
    let elem = React.createElement('svg', {...svgProps});

    //let elem  = React.createElement('svg', {...svgProps}, this.props.blockIconSVG);
    //let elem = this.props.blockIconSVG;

    return (
      <g>
        <rect id={this.props.blockId.concat("Rectangle")}
              height={blockStyling.outerRectangleHeight} width={blockStyling.outerRectangleWidth}
              x={0} y={0} rx={8} ry={8}
              style={{
                fill  : 'white', 'strokeWidth': 2,
                stroke: this.props.selected ? '#797979' : 'black',
                cursor: this.props.portThatHasBeenClicked === null ? "move" : "default"
              }}
        />
        <rect id={this.props.blockId.concat("InnerRectangle")}
              height={blockStyling.innerRectangleHeight} width={blockStyling.innerRectangleWidth}
              x={3} y={3} rx={6} ry={6}
              style={{
                fill  : 'rgba(230,238,240,0.94)',
                cursor: this.props.portThatHasBeenClicked === null ? "move" : "default"
              }}
        />

        <svg {...svgProps}>
        </svg>

      </g>
    )
    }

}

BlockRectangle.propTypes = {
selected              : PropTypes.bool,
  blockStyling          : PropTypes.object,
  blockIconSVG          : PropTypes.string,
  blockId               : PropTypes.string,
  portThatHasBeenClicked: PropTypes.object
};
