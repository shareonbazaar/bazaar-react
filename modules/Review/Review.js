import React from 'react';
import PropTypes from 'prop-types';
import moment from 'moment';
import Identity from '../Identity/Identity';

export default function Review(props) {
  const { imageUrl, name, rating, service, text, createdAt } = props;
  return (
    <div className="review">
      <Identity
        imageUrl={imageUrl}
        name={name}
      />
      <div className="review-body">
        <div className="rating">
          {
            Array(rating).fill(0).map((v, i) => <span key={i}>★</span>)
          }
        </div>
        <em>{service}</em>
        <div className="quote">{text}</div>
        <time className="review-timestamp">
          {moment(createdAt).format('MMM YYYY')}
        </time>
      </div>
    </div>
  );
}

Review.propTypes = {
  imageUrl: PropTypes.string,
  name: PropTypes.string,
  rating: PropTypes.number,
  service: PropTypes.string,
  text: PropTypes.string,
  createdAt: PropTypes.string,
};

Review.defaultProps = {
  imageUrl: '',
  name: '',
  rating: 0,
  service: '',
  text: '',
  createdAt: Date(),
};
