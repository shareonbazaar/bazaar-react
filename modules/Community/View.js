import React from 'react';
import PropTypes from 'prop-types';
import Carousel from 'nuka-carousel';

import Event from '../Community/Event';
import { Header1 } from '../Layout/Headers';
/* global FACEBOOK_ID: true */

function Controls(props) {
  const buttonStyle = active => ({
    border: 0,
    background: 'transparent',
    color: 'black',
    cursor: 'pointer',
    padding: 10,
    outline: 0,
    fontSize: 24,
    opacity: active ? 1 : 0.5
  });
  return (
    <ul style={{
      position: 'relative',
      margin: 0,
      top: -10,
      padding: 0
    }}
    >
      {
        Array(props.slideCount).fill(0).map((v, i) =>
          (
            <li style={{ listStyleType: 'none', display: 'inline-block' }} key={i}>
              <button
                style={buttonStyle(props.currentSlide === i)}
                onClick={() => props.goToSlide(i)}
              >
                &bull;
              </button>
            </li>
          )
        )
      }
    </ul>
  );
}

Controls.propTypes = {
  slideCount: PropTypes.number.isRequired,
  currentSlide: PropTypes.number.isRequired,
  goToSlide: PropTypes.func.isRequired,
};

class View extends React.Component {
  componentDidMount() {
    window.scrollTo(0, 0);
    this.props.loadEvents();
  }

  render() {
    const { events } = this.props;

    return (
      <div className="content-page">
        <Header1>Bazaar Community Events</Header1>
        <Carousel
          frameOverflow="visible"
          cellSpacing={10}
          decorators={[
            {
              component: Controls,
              position: 'CenterCenter',
            }
          ]}
        >
          {events.slice(0, 3).map(e => <Event style={{ height: '300px' }} key={e.id} event={e} />)}
        </Carousel>
      </div>
    );
  }
}

View.propTypes = {
  events: PropTypes.array,
  loadEvents: PropTypes.func.isRequired,
};

View.defaultProps = {
  events: [],
};

export default View;
