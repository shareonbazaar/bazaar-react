import React from 'react';
import PropTypes from 'prop-types';

import AddNewEvent from './AddNewEvent';
import ConfirmationModal from '../ConfirmationModal/ConfirmationModal';
import { Header1 } from '../Layout/Headers';

class View extends React.Component {
  componentDidMount() {
    window.scrollTo(0, 0);
    this.props.loadEvents();
  }

  render() {
    const { events } = this.props;
    const cellStyle = {
      padding: '10px',
      border: '1px solid black',
    };
    return (
      <div className="content-page">
        <Header1>Manage Bazaar events</Header1>
        <AddNewEvent
          {...this.props}
        />
        <table style={{ margin: '10px 0' }}>
          <thead>
            <tr>
              <th style={cellStyle}>Date</th>
              <th style={cellStyle}>Event name</th>
              <th style={cellStyle}>Description</th>
              <th style={cellStyle}>Link</th>
              <th style={cellStyle}>Delete</th>
            </tr>
          </thead>
          <tbody>
            {
              events.map(event =>
                (
                  <tr key={event._id}>
                    <td style={cellStyle}>{event.happenedAt}</td>
                    <td style={cellStyle}>{event.title}</td>
                    <td style={cellStyle}>{event.description}</td>
                    <td style={cellStyle}><a target="_blank" href={event.link}>Link</a></td>
                    <td style={cellStyle}>
                      <ConfirmationModal
                        buttonStyle="danger"
                        buttonText="Delete"
                        title="Are you sure you want to delete this event?"
                        onConfirmation={() => this.props.deleteEvent(event._id)}
                      />
                    </td>
                  </tr>
                )
              )
            }
          </tbody>
        </table>
      </div>
    );
  }
}

View.propTypes = {
  events: PropTypes.array,
  loadEvents: PropTypes.func.isRequired,
  deleteEvent: PropTypes.func.isRequired,
};

View.defaultProps = {
  events: [],
};

export default View;
