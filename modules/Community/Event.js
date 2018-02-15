import React from 'react';
import PropTypes from 'prop-types';
import moment from 'moment';
import { Button } from 'react-bootstrap';

import { BAZAAR_BLUE } from '../Layout/Styles';

export default function Event(props) {
  const { name, description, start_time, id } = props.event;
  const link = `https://www.facebook.com/events/${id}`;
  return (
    <div style={{
      display: 'flex',
      flexDirection: 'column',
      ...props.style,
    }}
    >
      <div style={{
        backgroundImage: 'url("/images/middle-eastern-food.jpg")',
        backgroundSize: 'cover',
        backgroundRepeat: 'no-repeat',
        height: '40%',
      }}
      />
      <div>
        <span style={{ fontWeight: 'bold', color: BAZAAR_BLUE }}>{moment(start_time).format('DD.MM.YYYY')} - </span>
        <span style={{ fontWeight: 'bold' }}>{name}</span>
      </div>
      <p style={{ color: BAZAAR_BLUE, flexGrow: 1 }}>{description}</p>
      <Button style={{ backgroundColor: BAZAAR_BLUE, color: 'white', width: '100%' }}>
        See event on Facebook
        <i
          style={{
            backgroundColor: 'white',
            color: BAZAAR_BLUE,
            padding: '3px 3px 0px 3px',
            float: 'right',
            borderRadius: '3px',
            fontSize: 'large',
          }}
          className="fa fa-facebook"
        />
      </Button>
    </div>
  );
}

Event.propTypes = {
  event: PropTypes.shape({
    name: PropTypes.string.isRequired,
    description: PropTypes.string.isRequired,
    id: PropTypes.string.isRequired,
    start_time: PropTypes.string.isRequired,
    end_time: PropTypes.string.isRequired,
  }).isRequired,
  style: PropTypes.object,
};

Event.defaultProps = {
  style: {},
};
