import React from 'react';
import PropTypes from 'prop-types';

import CircularImage from '../CircularImage/CircularImage';

export default function Identity(props) {
  const { imageUrl, name } = props;
  return (
    <div className="identity">
      <CircularImage imageUrl={imageUrl} />
      <div>{name}</div>
    </div>
  );
}

Identity.propTypes = {
  imageUrl: PropTypes.string,
  name: PropTypes.string,
};

Identity.defaultProps = {
  imageUrl: '',
  name: '',
};
