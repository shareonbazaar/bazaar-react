import React from 'react';
import PropTypes from 'prop-types';
import CircularImage from '../CircularImage/CircularImage';


function UploadPhoto(props) {
  const { className, imageUrl, onImageChange } = props;
  return (
    <div className={className}>
      <CircularImage imageUrl={imageUrl} />
      <label className="upload-message" htmlFor="fileInput"> Update photo</label>
      <input id="fileInput" style={{ display: 'none' }} type="file" onChange={onImageChange} />
    </div>
  );
}

UploadPhoto.propTypes = {
  className: PropTypes.string,
  imageUrl: PropTypes.string,
  onImageChange: PropTypes.func,
};

UploadPhoto.defaultProps = {
  className: '',
  imageUrl: '',
  onImageChange: () => {},
};
