import React from 'react';
import PropTypes from 'prop-types';

import { ACTION_PINK } from '../Layout/Styles';

export default function CloseButton(props) {
  const { onClick } = props;
  const style = {
    stroke: 'white',
    strokeWidth: '1.5',
  };
  const size = 28;
  const cross_size = 14;
  const padding = (size - cross_size) / 2;
  return (
    <svg
      style={{ cursor: 'pointer', backgroundColor: ACTION_PINK, borderRadius: '50%' }}
      onClick={onClick}
      height={size}
      width={size}
    >
      <line x1={padding} y1={padding} x2={size - padding} y2={size - padding} style={style} />
      <line x1={padding} y1={size - padding} x2={size - padding} y2={padding} style={style} />
    </svg>
  );
}

CloseButton.propTypes = {
  onClick: PropTypes.func.isRequired,
};
