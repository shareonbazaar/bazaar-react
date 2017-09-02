import React from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import { Grid, Col, Row, Button } from 'react-bootstrap';
import GoogleMapReact from 'google-map-react';
// eslint-disable-next-line
import moment from 'moment';
import DateTime from 'react-datetime';
import Autocomplete from 'react-google-autocomplete';
import { FormattedMessage, defineMessages, injectIntl } from 'react-intl';

import ConfirmationModal from '../ConfirmationModal/ConfirmationModal';
import { updateTransaction, confirmTransaction } from '../../utils/actions';

/* global GOOGLE_MAP_API: true */
const messages = defineMessages({
  edit: {
    id: 'Upcoming.edit',
    defaultMessage: 'Edit',
  },
  update: {
    id: 'Upcoming.update',
    defaultMessage: 'Update',
  },
  didOccur: {
    id: 'Upcoming.didOccur',
    defaultMessage: 'Did this exchange take place?',
  },
  markcomplete: {
    id: 'Upcoming.markcomplete',
    defaultMessage: 'Mark Complete',
  },
});

function Marker() {
  return <img alt="" src="/images/default_marker.png" />;
}

function LocationPicker(props) {
  const { editMode, location } = props;
  if (!editMode) {
    if (!location.name) {
      return <em>Suggest a place to meet by clicking the edit button</em>;
    // eslint-disable-next-line
    } else {
      return <div>{location.name}</div>;
    }
  // eslint-disable-next-line
  } else {
    return (
      <Autocomplete
        className="form-control"
        defaultValue={location.name}
        onPlaceSelected={props.onPlaceSelected}
        componentRestrictions={{ country: 'de' }}
        types={[]}
      />
    );
  }
}

LocationPicker.propTypes = {
  onPlaceSelected: PropTypes.func,
  editMode: PropTypes.bool,
  location: PropTypes.object,
};

function TimePicker(props) {
  const { editMode, time, onTimeSelected } = props;
  if (!editMode) {
    if (!time) {
      return <em>Suggest a place to meet by clicking the edit button</em>;
    // eslint-disable-next-line
    } else {
      return (
        <DateTime
          dateFormat={'MMMM Do YYYY'}
          onChange={onTimeSelected}
          defaultValue={time ? new Date(time) : Date.now()}
        />
      );
    }
  // eslint-disable-next-line
  } else {
    return (
      <DateTime
        dateFormat={'MMMM Do YYYY'}
        onChange={onTimeSelected}
        defaultValue={new Date(time)}
      />
    );
  }
}

TimePicker.propTypes = {
  onTimeSelected: PropTypes.func,
  editMode: PropTypes.bool,
  time: PropTypes.string,
};

const BERLIN_LNG = 13.42;
const BERLIN_LAT = 52.53;
const DEFAULT_ZOOM = 10;

class Upcoming extends React.Component {
  constructor(props) {
    super(props);
    const { content } = this.props;
    this.state = {
      inViewMode: true,
      inChatMode: false,
      markerLocation: {
        coords: {
          lat: content.loc.coordinates[1] || BERLIN_LAT,
          lng: content.loc.coordinates[0] || BERLIN_LNG,
        },
        name: content.placeName || '',
      },
      zoom: DEFAULT_ZOOM,
      happenedAt: content.happenedAt,
      showReviewForm: false,
    };

    this.onEditClick = this.onEditClick.bind(this);
    this.onPlaceSelected = this.onPlaceSelected.bind(this);
    this.onTimeSelected = this.onTimeSelected.bind(this);
    this.onConfirmation = this.onConfirmation.bind(this);
  }

  onEditClick() {
    const { markerLocation, inViewMode, happenedAt } = this.state;
    const { content } = this.props;
    if (!inViewMode) {
      this.props.updateTransaction({
        t_id: content._id,
        transaction: {
          loc: {
            type: 'Point',
            coordinates: [markerLocation.coords.lng, markerLocation.coords.lat]
          },
          placeName: markerLocation.name,
          happenedAt,
        }
      });
    }
    this.setState({
      inViewMode: !inViewMode,
    });
  }

  onTimeSelected(timestamp) {
    this.setState({
      happenedAt: timestamp,
    });
  }

  onPlaceSelected(place) {
    this.setState({
      markerLocation: {
        coords: {
          lat: place.geometry.location.lat(),
          lng: place.geometry.location.lng(),
        },
        name: place.name,
      },
      zoom: 15,
    });
  }

  onConfirmation() {
    const { content } = this.props;
    this.props.confirmTransaction({
      t_id: content._id,
    });
  }

  render() {
    const { markerLocation, zoom, inViewMode, happenedAt } = this.state;
    const { collapsed, onChatClick } = this.props;
    const { formatMessage } = this.props.intl;
    // GoogleMap must only render when its container div is actually visible on screen
    if (collapsed) return null;
    return (
      <Grid fluid>
        <Row>
          <Col sm={6}>
            <div style={{ height: '200px' }}>
              <GoogleMapReact
                defaultCenter={{ lat: BERLIN_LAT, lng: BERLIN_LNG }}
                defaultZoom={DEFAULT_ZOOM}
                center={markerLocation.coords}
                zoom={zoom}
                bootstrapURLKeys={{ key: GOOGLE_MAP_API }}
              >
                {
                  markerLocation ?
                    <Marker
                      lat={markerLocation.coords.lat}
                      lng={markerLocation.coords.lng}
                    />
                    : null
                }
              </GoogleMapReact>
            </div>
          </Col>
          <Col sm={6}>
            <div>
              <h4 className="title">
                <FormattedMessage
                  id={'Upcoming.location'}
                  defaultMessage={'Location'}
                />
              </h4>
              <LocationPicker
                location={markerLocation}
                onPlaceSelected={this.onPlaceSelected}
                editMode={!inViewMode}
              />
            </div>
            <div>
              <h4 className="title">
                <FormattedMessage
                  id={'Upcoming.date'}
                  defaultMessage={'Date'}
                />
              </h4>
              <TimePicker
                time={happenedAt}
                onTimeSelected={this.onTimeSelected}
                editMode={!inViewMode}
              />
            </div>
          </Col>
        </Row>
        <Row className="responses">
          <Col sm={7} >
            <Button bsStyle="primary" onClick={this.onEditClick}>{inViewMode ? formatMessage(messages.edit) : formatMessage(messages.update)}
            </Button>
          </Col>
          <Col sm={7} >
            <Button bsStyle="primary" onClick={onChatClick}>
              <FormattedMessage
                id={'Transaction.chat'}
                defaultMessage={'Chat'}
              />
            </Button>
          </Col>
          <Col sm={7} >
            <ConfirmationModal
              onConfirmation={this.onConfirmation}
              title={formatMessage(messages.didOccur)}
              buttonText={formatMessage(messages.markcomplete)}
              cancelStyle="danger"
              confirmStyle="primary"
              buttonStyle="primary"
            />
          </Col>
        </Row>
      </Grid>
    );
  }
}

Upcoming.propTypes = {
  updateTransaction: PropTypes.func,
  collapsed: PropTypes.bool,
  onTimeSelected: PropTypes.func,
  onChatClick: PropTypes.func,
  content: PropTypes.object,
  intl: PropTypes.object,
};

Upcoming.defaultProps = {
  updateTransaction: () => {},
  collapsed: true,
  onTimeSelected: () => {},
  onChatClick: () => {},
  content: {},
};

export default connect(null, { updateTransaction, confirmTransaction })(injectIntl(Upcoming));
