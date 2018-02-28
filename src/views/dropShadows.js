import React, {PureComponent} from 'react';
import {withTheme} from 'material-ui';
import PropTypes from 'prop-types';


class DropShadows extends PureComponent {

  render() {
    const {theme} = this.props;
    let filters = [];

    for (let elevation = 1; elevation < theme.shadows.length; elevation++) {
      // Turn box-shadow CSS property into drop-shadow
      let components = [];
      let merge = [];

      // Add components for each of the three sections
      let arr = theme.shadows[elevation].split("),");
      for (let i = 1; i < arr.length + 1; i++) {
        let split = arr[i-1].split(" ");
        let dx = split[0].replace("px", "");
        let dy = split[1].replace("px", "");
        let stdDev = split[2].replace("px", "");
        let fill = split.slice(4).join("");
        if (i < arr.length) fill += ")";

        // Add the components
        components.push(
          <feGaussianBlur key={4*i} result={"blur" + i} in="SourceAlpha" stdDeviation={stdDev}/>
        );
        components.push(
          <feOffset key={4*i+1} result={"offset" + i} dx={dx} dy={dy}/>
        );
        components.push(
          <feFlood key={4*i+2} result={"flood" + i} floodColor={fill}/>
        );
        components.push(
          <feComposite key={4*i+3} result={"shadow" + i} in2={"offset" + i} operator="in"/>
        );

        // And an entry into the merge list
        merge.push(
          <feMergeNode key={i} in={"shadow" + i}/>
        );

      }

      // Add the filter structure
      filters.push(
        <filter key={elevation} id={"dropshadow" + elevation} x="-50%" y="-50%" width="200%" height="200%">
          {components}
          <feMerge>
            {merge}
            <feMergeNode in="SourceGraphic"/>
          </feMerge>
        </filter>
      );
    }

    return (
      <defs>
        {filters}
      </defs>
    );
  }
}

DropShadows.propTypes = {
  theme: PropTypes.object.isRequired,
};

export default withTheme()(DropShadows);
