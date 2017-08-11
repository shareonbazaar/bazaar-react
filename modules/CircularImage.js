import React from 'react';
import PropTypes from 'prop-types';

export default function CircularImage(props) {
  const { imageUrl } = props;
  return (
    <div className="circular-img">
      <img src={imageUrl} alt="" />
    </div>
  );
}

CircularImage.propTypes = {
  imageUrl: PropTypes.string
};

CircularImage.defaultProps = {
  imageUrl: ''
};
