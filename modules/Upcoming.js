import React from 'react'
import { Modal, Grid, Col, Row, Button } from 'react-bootstrap';
import GoogleMapReact from 'google-map-react';
import DateTime from 'react-datetime'
import Autocomplete from 'react-google-autocomplete';
import Chat from './Chat';
import ReviewModal from './ReviewModal';
import ConfirmationModal from './ConfirmationModal';
import {StatusType} from '../models/Enums'
import { connect } from 'react-redux'
import { setTransactionStatus } from '../utils/actions'


function Marker (props) {
    return (
        <div style={{backgroundColor: 'red', width: 20, height: 20}}>
            Marker
        </div>
    )
}

function LocationPicker (props) {
    if (!props.editMode) {
        if (!props.location) {
            return (
                <em>Suggest a place to meet by clicking the edit button</em>
            )
        } else {

        }
    } else {
        return (
            <Autocomplete
                style={{width: '90%'}}
                onPlaceSelected={props.onPlaceSelected}
                componentRestrictions={{country: "de"}}
                types={[]}
            />
        )
    }
}

function TimePicker (props) {
    if (!props.editMode) {
        if (!props.location) {
            return (
                <em>Suggest a place to meet by clicking the edit button</em>
            )
        } else {

        }
    } else {
        return (
            <DateTime />
        )
    }
}

class Upcoming extends React.Component {
    constructor (props) {
        super(props);
        this.state = {
            inViewMode: true,
            inChatMode: false,
            markerLocation: {
                lat: 52.53,
                lng: 13.42,
            },
            zoom: 10,
            showReviewForm: false,
        }
        this.defaultProps = {
            center: {lat: 52.5200, lng: 13.4050},
            zoom: 10
        };

        this.onEditClick = this.onEditClick.bind(this);
        this.onPlaceSelected = this.onPlaceSelected.bind(this);
        this.onConfirmation = this.onConfirmation.bind(this);
    }

    onEditClick () {
        this.setState({
            inViewMode: !this.state.inViewMode,
        })
    }

    onPlaceSelected (place) {
        this.setState({
            markerLocation: {
                lat: place.geometry.location.lat(),
                lng: place.geometry.location.lng(),
                name: place.name,
            },
            zoom: 15,
        })
    }

    onConfirmation () {
        this.props.setTransactionStatus(this.props.content._id, StatusType.COMPLETE);
    }

    render () {
        // GoogleMap must only render when its container div is actually visible on screen
        if (this.props.collapsed) return null;
        return (
            <Grid fluid={true}>
                <Row>
                    <Col sm={6}>
                        <div style={{height: "200px"}}>
                          <GoogleMapReact
                            defaultCenter={this.defaultProps.center}
                            defaultZoom={this.defaultProps.zoom}
                            center={this.state.markerLocation}
                            zoom={this.state.zoom}
                            bootstrapURLKeys={{key: 'AIzaSyBQ2hLVYEOmR5pX5MMOaxpeT5OikIxE6gk'}}
                          >
                            {
                                this.state.markerLocation ? <Marker lat={this.state.markerLocation.lat} lng={this.state.markerLocation.lng} /> : null
                            }
                          </GoogleMapReact>
                        </div>

                    </Col>

                    <Col sm={6}>
                        <div>
                            <h4 className='title'>Location</h4>
                            <LocationPicker onPlaceSelected={this.onPlaceSelected} editMode={!this.state.inViewMode}/>
                        </div>
                        <div>
                            <h4 className='title'>Date</h4>
                            <TimePicker editMode={!this.state.inViewMode}/>
                        </div>
                    </Col>
                </Row>

                <Row className='responses'>
                    <Col sm={7} ><Button onClick={this.onEditClick}>{this.state.inViewMode ? 'Edit' : 'Update'}</Button></Col>
                    <Col sm={7} ><Button onClick={this.props.onChatClick}>Chat</Button></Col>
                    <Col sm={7} >
                        <ConfirmationModal
                            onConfirmation={this.onConfirmation}
                            title='Did this exchange take place?'
                            buttonText='Mark Complete'
                            cancelStyle='danger'
                            confirmStyle='primary'
                            buttonStyle='primary'
                        />
                    </Col>
                </Row>
            </Grid>
        )
  }
}

export default connect(null, (dispatch) => {
    return {
        setTransactionStatus: (t_id, status) => {
            dispatch(setTransactionStatus(t_id, status));   
        }
    }
})(Upcoming)
