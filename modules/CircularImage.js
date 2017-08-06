import React from 'react';

export default function CircularImage(props) {
  const imageUrl = props;
  return (
    <div className="circular-img">
      <img src={imageUrl} alt="" />
    </div>
  );
}
