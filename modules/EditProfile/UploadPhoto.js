import React from 'react';
import PropTypes from 'prop-types';

import CircularImage from '../CircularImage/CircularImage';
import ActionButton from '../Actions/ActionButton';

export default function UploadPhoto(props) {
  const { imageUrl, onImageChange } = props;
  return (
    <div style={{ textAlign: 'center' }}>
      <CircularImage imageUrl={imageUrl} />
      <ActionButton style={{ padding: 0, margin: '10px 0 5px 0' }}>
        <label style={{ padding: '10px 20px 5px 20px' }} htmlFor="fileInput"> Update photo</label>
      </ActionButton>
      <input id="fileInput" style={{ display: 'none' }} type="file" onChange={onImageChange} />
    </div>
  );
}

UploadPhoto.propTypes = {
  imageUrl: PropTypes.string,
  onImageChange: PropTypes.func.isRequired,
};

UploadPhoto.defaultProps = {
  imageUrl: '',
};
