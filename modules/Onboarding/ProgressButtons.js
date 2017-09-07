import React from 'react';
import PropTypes from 'prop-types';
import { Button } from 'react-bootstrap';

export default function ProgressButtons(props) {
  const { canGoBack, canGoForward, onForward, onBack } = props;
  return (
    <div className="progress-buttons">
      {
        canGoBack && <Button className="back" onClick={onBack}>back</Button>
      }
      {
        canGoForward && <Button className="forward" onClick={onForward}>next</Button>
      }
    </div>
  );
}

ProgressButtons.propTypes = {
  canGoBack: PropTypes.bool,
  canGoForward: PropTypes.bool,
  onForward: PropTypes.func,
  onBack: PropTypes.func,
};
ProgressButtons.defaultProps = {
  canGoBack: true,
  canGoForward: true,
  onForward: () => {},
  onBack: () => {},
};
