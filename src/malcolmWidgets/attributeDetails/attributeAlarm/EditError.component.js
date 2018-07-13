import React from 'react';
import PropTypes from 'prop-types';

const EditError = props => (
  <div>
    <svg
      width="26"
      height="26"
      version="1.1"
      viewBox="0 0 48 48"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        d="m24 4c-11.04 0-20 8.95-20 20s8.96 20 20 20 20-8.95 20-20-8.96-20-20-20zm7.5527 8c0.34172 0 0.68332 0.13059 0.94336 0.39062l3.1133 3.1133c0.52007 0.52007 0.52007 1.3666 0 1.8867l-2.4395 2.4414-5.002-5.002 2.4414-2.4395c0.26004-0.26004 0.60164-0.39062 0.94336-0.39062zm-4.7969 4.2441 5 5-14.756 14.756h-5v-5l14.756-14.756z"
        fill={props.nativeColor}
      />
    </svg>
  </div>
);

EditError.propTypes = {
  nativeColor: PropTypes.string.isRequired,
};

export default EditError;
