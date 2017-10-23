import React from 'react';
import PropTypes from 'prop-types';
import { Button } from 'react-bootstrap';
import { BAZAAR_BLUE, BAZAAR_ORANGE } from '../Layout/Styles';

export default function ProgressButtons(props) {
  const { canGoBack, canGoForward, onForward, onBack } = props;
  const buttonStyle = {
    borderRadius: '5px',
    margin: '0 5px',
    color: 'white',
    padding: '8px 10px',
  };
  return (
    <div style={{ marginTop: '14px', display: 'inline-block' }}>
      {
        canGoBack &&
        <Button
          style={{ backgroundColor: BAZAAR_BLUE, ...buttonStyle }}
          onClick={onBack}
        >&lt; back
        </Button>
      }
      {
        canGoForward &&
        <Button
          style={{ backgroundColor: BAZAAR_ORANGE, ...buttonStyle }}
          onClick={onForward}
        >next &gt;
        </Button>
      }
    </div>
  );
}

ProgressButtons.propTypes = {
  canGoBack: PropTypes.bool,
  canGoForward: PropTypes.bool,
  onForward: PropTypes.func.isRequired,
  onBack: PropTypes.func.isRequired,
};
ProgressButtons.defaultProps = {
  canGoBack: true,
  canGoForward: true,
};
