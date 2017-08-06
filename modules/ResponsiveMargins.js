import React from 'react';
import PropTypes from 'prop-types';

export default function ResponsiveMargins(props) {
  const children = props;
  return (
    <div className="responsive-margins">
      {children}
    </div>
  );
}
ResponsiveMargins.propTypes = {
  children: PropTypes.node,
};

ResponsiveMargins.defaultProps = {
  children: null,
};
