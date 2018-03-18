import React from 'react';
import PropTypes from 'prop-types';
import Carousel from 'nuka-carousel';

import UserCard from '../UserCard/UserCard';
import Event from '../Community/Event';
import { Header1 } from '../Layout/Headers';
import { BAZAAR_BLUE } from '../Layout/Styles';
/* global FACEBOOK_ID: true */

function Controls(props) {
  const buttonStyle = active => ({
    border: 0,
    background: 'transparent',
    color: active ? BAZAAR_BLUE : 'white',
    cursor: 'pointer',
    padding: 10,
    outline: 0,
    fontSize: 24,
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

const NUM_EVENTS = 3;
const NUM_SUGGESTED_MATCHES = 6;

class View extends React.Component {
  componentDidMount() {
    window.scrollTo(0, 0);
    this.props.loadEvents();
    this.props.loadUsers();
  }

  render() {
    const { events, users } = this.props;
    return (
      <div className="content-page">
        <Header1>Bazaar Community Events</Header1>
        <Carousel
          frameOverflow="hidden"
          cellSpacing={10}
          decorators={[
            {
              component: Controls,
              position: 'CenterCenter',
            }
          ]}
        >
          {events.slice(0, NUM_EVENTS).map(e => <Event style={{ height: '300px' }} key={e.id} event={e} />)}
        </Carousel>

        <Header1>Suggested Matches</Header1>
        <div style={{
          display: 'flex',
          flexDirection: 'row',
          overflowX: 'scroll',
        }}
        >
          {
            users.slice(0, NUM_SUGGESTED_MATCHES).map(u => (
              <div style={{flex: 1, minWidth: '300px', margin: '0 5px'}}>
                <UserCard shouldExpand user={u} key={u._id} onBookmarkClicked={() => {}} />
              </div>
            )
            )
          }
        </div>
      </div>
    );
  }
}

View.propTypes = {
  events: PropTypes.array,
  users: PropTypes.array,
  loadEvents: PropTypes.func.isRequired,
  loadUsers: PropTypes.func.isRequired,
};

View.defaultProps = {
  events: [],
  users: [],
};

export default View;
