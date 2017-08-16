/**
 * Created by twi18192 on 18/01/16.
 */

import * as React from '../../node_modules/react/react';
import PropTypes from 'prop-types';
import styles from '../styles/block.css';
import renderHTML from 'react-render-html';

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

/*
    let svgProps = {height:blockStyling.innerRectangleHeight.toString(),
      width:blockStyling.innerRectangleWidth.toString(),
      viewBox:"0 0 "+blockStyling.innerRectangleWidth.toString()+" "+blockStyling.innerRectangleHeight.toString(),
      dangerouslySetInnerHTML:{__html: this.props.blockIconSVG}};
*/
    let svgProps = {height:blockStyling.outerRectangleHeight.toString(),
                    width:blockStyling.outerRectangleWidth.toString(),
                    viewBox:"0 0 "+(blockStyling.outerRectangleWidth*2).toString()+" "+(blockStyling.outerRectangleHeight*2).toString()};

    let elem = <svg className={styles.svgBlockIcon} {...svgProps}>{renderHTML(this.props.blockIconSVG)}</svg>;

    // default height to basic style.
    let outerRectHeight = blockStyling.outerRectangleHeight;
    // then if nports property is specified, calculate the ideal height.
    if (this.props.nports)
      {
        if (this.props.nports > 0)
          {
          outerRectHeight = (2*blockStyling.verticalMargin) + (this.props.nports - 1)*blockStyling.interPortSpacing;
          }
      }

    return (
      <g>
        <defs>
          <linearGradient id="rectGradient">
            <stop offset="5%" stopColor="#DCDEE6" />
            <stop offset="95%" stopColor="#C8CBD2" />
          </linearGradient>
        </defs>
        <defs>
         <filter id={"lighting3d"} filterUnits={"userSpaceOnUse"} x={"0"} y={"0"} width={"100%"} height={"100%"}>
           <feGaussianBlur in="SourceAlpha" stdDeviation="4" result="blur"/>
           <feOffset in="blur" dx="4" dy="4" result="offsetBlur"/>
           <feSpecularLighting in="blur" surfaceScale="5" specularConstant=".75"
                               specularExponent="20" lightingColor="#bbbbbb"
                               result="specOut">
             <fePointLight x="-5000" y="-10000" z="20000"/>
           </feSpecularLighting>
           <feComposite in="specOut" in2="SourceAlpha" operator="in" result="specOut"/>
           <feComposite in="SourceGraphic" in2="specOut" operator="arithmetic"
                        k1="0" k2="1" k3="1" k4="0" result="litPaint"/>
           <feMerge>
             <feMergeNode in="offsetBlur"/>
             <feMergeNode in="litPaint"/>
           </feMerge>
         </filter>
        </defs>

        <rect id={this.props.blockId.concat("Rectangle")}
              height={outerRectHeight} width={blockStyling.outerRectangleWidth}
              x={0} y={0} rx={8} ry={8}
              filter={'url(#lighting3d)'}
              style={{
                /*fill  : 'white',*/
                strokeWidth: 2,
                stroke: this.props.selected ? '#797979' : 'black',
                cursor: this.props.portThatHasBeenClicked === null ? "move" : "default"
              }}
        />

        {elem}
      </g>
    )
    }

}

BlockRectangle.propTypes = {
  selected              : PropTypes.bool,
  blockStyling          : PropTypes.object,
  blockIconSVG          : PropTypes.string,
  blockId               : PropTypes.string,
  portThatHasBeenClicked: PropTypes.object,
  nports                : PropTypes.number
};
