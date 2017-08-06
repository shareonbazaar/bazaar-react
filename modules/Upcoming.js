import React from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import { Grid, Col, Row, Button } from 'react-bootstrap';
// import { Modal, Grid, Col, Row, Button } from 'react-bootstrap';
import GoogleMapReact from 'google-map-react';
import moment from 'moment';
import DateTime from 'react-datetime';
import Autocomplete from 'react-google-autocomplete';
// import Chat from './Chat';
// import ReviewModal from './ReviewModal';
import ConfirmationModal from './ConfirmationModal';
import { StatusType } from '../models/Enums';

import { updateTransaction } from '../utils/actions';

// function Marker(props) {
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
  location: PropTypes.node,
};

function TimePicker(props) {
  const { editMode, time } = props;
  if (!editMode) {
    if (!time) {
      return <em>Suggest a place to meet by clicking the edit button</em>;
    //eslint-disable-next-line
    } else {
      return <div>{moment(time).format('MMMM Do YYYY, h:mm a')}</div>;
    }
  //eslint-disable-next-line
  } else {
    return (
      <DateTime
        dateFormat={'MMMM Do YYYY'}
        onChange={props.onTimeSelected}
        defaultValue={new Date(time)}
      />
    );
  }
}

TimePicker.propTypes = {
  onTimeSelected: PropTypes.func,
  editMode: PropTypes.bool,
  time: PropTypes.bool,
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
    const { markerLocation } = this.state;
    const content = this.props;
    if (!this.state.inViewMode) {
      this.props.updateTransaction(content._id, {
        loc: {
          type: 'Point',
          coordinates: [markerLocation.coords.lng, markerLocation.coords.lat]
        },
        placeName: markerLocation.name,
        happenedAt: this.state.happenedAt,
      });
    }
    this.setState({
      inViewMode: !this.state.inViewMode,
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
    const content = this.props;
    this.props.updateTransaction(content._id, { status: StatusType.COMPLETE });
  }

  render() {
    const collapsed = this.props;
    const { center, zoom } = this.defaultProps;
    // GoogleMap must only render when its container div is actually visible on screen
    if (collapsed) return null;
    return (
      <Grid fluid>
        <Row>
          <Col sm={6}>
            <div style={{ height: '200px' }}>
              <GoogleMapReact
                defaultCenter={center}
                defaultZoom={zoom}
                center={this.state.markerLocation.coords}
                zoom={this.state.zoom}
                bootstrapURLKeys={{ key: 'AIzaSyBQ2hLVYEOmR5pX5MMOaxpeT5OikIxE6gk' }}
              >
                {
                  this.state.markerLocation ?
                    <Marker
                      lat={this.state.markerLocation.coords.lat}
                      lng={this.state.markerLocation.coords.lng}
                    />
                    : null
                }
              </GoogleMapReact>
            </div>
          </Col>
          <Col sm={6}>
            <div>
              <h4 className="title">Location</h4>
              <LocationPicker
                location={this.state.markerLocation}
                onPlaceSelected={this.onPlaceSelected}
                editMode={!this.state.inViewMode}
              />
            </div>
            <div>
              <h4 className="title">Date</h4>
              <TimePicker
                time={this.state.happenedAt}
                onTimeSelected={this.state.onTimeSelected}
                editMode={!this.state.inViewMode}
              />
            </div>
          </Col>
        </Row>
        <Row className="responses">
          <Col sm={7} ><Button bsStyle="primary" onClick={this.onEditClick}>{this.state.inViewMode ? 'Edit' : 'Update'}</Button></Col>
          <Col sm={7} ><Button bsStyle="primary" onClick={this.props.onChatClick}>Chat</Button></Col>
          <Col sm={7} >
            <ConfirmationModal
              onConfirmation={this.onConfirmation}
              title="Did this exchange take place?"
              buttonText="Mark Complete"
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
  onTimeSelected: PropTypes.func,
  onChatClick: PropTypes.func,
  content: PropTypes.node,
};

Upcoming.defaultProps = {
  center: { lat: BERLIN_LAT, lng: BERLIN_LNG },
  zoom: DEFAULT_ZOOM,
  updateTransaction: () => {},
  onTimeSelected: () => {},
  onChatClick: () => {},
};
export default connect(null, { updateTransaction })(Upcoming);
