import React from 'react';
import PropTypes from 'prop-types';

import { BAZAAR_GRAY } from '../Layout/Styles';

export function Header1(props) {
  const { children, style } = props;
  return (
    <h1
      style={{
        fontSize: '18px',
        color: BAZAAR_GRAY,
        ...style,
      }}
    >
      {children}
    </h1>
  );
}

Header1.propTypes = {
  style: PropTypes.object,
  children: PropTypes.node,
};

Header1.defaultProps = {
  children: null,
  style: {},
};

export function Header2(props) {
  const { children, style } = props;
  return (
    <h2
      style={{
        fontSize: '14px',
        color: BAZAAR_GRAY,
        ...style,
      }}
    >
      {children}
    </h2>
  );
}

Header2.propTypes = {
  style: PropTypes.object,
  children: PropTypes.node,
};

Header2.defaultProps = {
  children: null,
  style: {},
};

export function Text(props) {
  const { children, style } = props;
  return (
    <h2
      style={{
        fontSize: '11px',
        color: BAZAAR_GRAY,
        ...style,
      }}
    >
      {children}
    </h2>
  );
}

Text.propTypes = {
  style: PropTypes.object,
  children: PropTypes.node,
};

Text.defaultProps = {
  children: null,
  style: {},
};

