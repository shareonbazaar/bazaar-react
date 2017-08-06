import React from 'react';
import PropTypes from 'prop-types';
import moment from 'moment';

export default function Review(props) {
  const review = props;
  return (
    <div className="review">
      <div className="rating">
        {
          Array(review.rating).fill(0).map((v, i) => <span key={i}>★</span>)
        }
      </div>
      <time className="review-timestamp">
        {moment(review.createdAt).fromNow()}
      </time>
      <quote>{review.text}</quote>
    </div>
  );
}

Review.propTypes = {
  review: PropTypes.node,
};

Review.defaultProps = {
  review: null,
};
