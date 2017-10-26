import React from 'react';
import PropTypes from 'prop-types';
import { Button } from 'react-bootstrap';

import { ACTION_PINK } from '../Layout/Styles';

export default function ActionButton(props) {
  const { onClick, children, style } = props;
  return (
    <Button
      {...props}
      onClick={onClick}
      style={{
        backgroundColor: ACTION_PINK,
        color: 'white',
        ...style,
      }}
    >
      {children}
    </Button>
  );
}

ActionButton.propTypes = {
  style: PropTypes.object,
  children: PropTypes.node,
  onClick: PropTypes.func,
};

ActionButton.defaultProps = {
  onClick: () => {},
  children: null,
  style: {},
};
