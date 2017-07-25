import React from 'react'
import {RequestType, StatusType} from '../models/Enums'
import ReactBootstrapSlider from 'react-bootstrap-slider';
import Select from 'react-select-plus';
import { connect } from 'react-redux';
import { push } from 'react-router-redux'
import { Button, Grid, Col, Row } from 'react-bootstrap';
import { loadUsers, getSurprise } from '../utils/actions'
import { FormattedMessage, defineMessages, injectIntl } from 'react-intl';

const messages = defineMessages({
    yourinterests: {
        id: 'QueryBox.yourinterests',
        defaultMessage: 'Your interests',
    },
    toreceive: {
        id: 'QueryBox.toreceive',
        defaultMessage: 'I want to receive',
    },
    togive: {
        id: 'QueryBox.togive',
        defaultMessage: 'I want to give',
    },
    toexchange: {
        id: 'QueryBox.toexchange',
        defaultMessage: 'I want to exchange',
    },
    search: {
        id: 'QueryBox.search',
        defaultMessage: 'Search for skills',
    }
});

const MAX_SLIDER_VALUE = 50;

class QueryBox extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            request_type: RequestType.LEARN,
            selectValue: [],
            sliderValue: MAX_SLIDER_VALUE,
            queryBoxOpen: false,
        };
        this.getOptions = this.getOptions.bind(this);
    }

    getOptions (input) {
        const {formatMessage} = this.props.intl;
        var inputL = input.toLowerCase();
        return fetch(`/api/categories`)
        .then(response => response.json())
        .then(json => {
            return {
                complete: true,
                options:  [
                    {
                        label: formatMessage(messages.yourinterests),
                        options: this.props.loggedInUser._skills
                        .filter(s => s.label.en.toLowerCase().indexOf(inputL) >= 0)
                        .map(s => ({label: s.label.en, value: s._id}))
                    },
                ].concat(json.map(c => {
                    return {
                        label: c.label.en,
                        options: c._skills
                        .filter(s => s.label.en.toLowerCase().indexOf(inputL) >= 0)
                        .map(s => ({label: s.label.en, value: s._id}))
                    }
                }))
            }
        })
        .catch(err => console.log(err))
    }

    render() {
        const {formatMessage} = this.props.intl;
        return (
            <div className='query-box'>
                <div className={`filter-options ${this.state.queryBoxOpen ? 'toggled' : ''}`}>
                    {
                        [
                            {
                                request_type: RequestType.LEARN,
                                label: formatMessage(messages.toreceive),
                            },
                            {
                                request_type: RequestType.SHARE,
                                label: formatMessage(messages.togive),
                            },
                            {
                                request_type: RequestType.EXCHANGE,
                                label: formatMessage(messages.toexchange),
                            }
                        ].map(obj => {
                            var klass = `service-type ${this.state.request_type == obj.request_type ? 'selected' : ''}`;
                            return <div key={obj.request_type} onClick={() => this.setState({request_type: obj.request_type})} className={klass}>{obj.label}</div>
                        })
                    }
                        <div className='slider-wrapper'>
                            <FormattedMessage
                              id={'QueryBox.distance'}
                              defaultMessage={'Distance'}
                            />
                            <ReactBootstrapSlider
                                value={this.state.sliderValue}
                                change={v => this.setState({sliderValue: v})}
                                slideStop={v => this.setState({sliderValue: v})}
                                step={2}
                                max={MAX_SLIDER_VALUE}
                                min={2}/>
                        </div>
                        <div className='button-wrapper'>
                            <Button onClick={() => this.setState({queryBoxOpen: false})} bsStyle="primary">
                                <FormattedMessage
                                  id={'QueryBox.cancel'}
                                  defaultMessage={'Cancel'}
                                />
                            </Button>
                            <Button
                                onClick={() => {
                                    if (this.state.selectValue.length === 0)
                                        return;
                                    this.props.loadUsers({
                                        // distance: state.sliderValue, // NEED long, lat
                                        request_type: this.state.request_type,
                                        skills: this.state.selectValue.map(s => s.value)
                                    })
                                }}
                                bsStyle="primary">
                                <FormattedMessage
                                  id={'QueryBox.applyfilter'}
                                  defaultMessage={'Apply Filter'}
                                />
                            </Button>
                            <Button onClick={() => this.props.getSurprise()} bsStyle="primary" >
                                <FormattedMessage
                                  id={'QueryBox.surprise'}
                                  defaultMessage={'Surprise me!'}
                                />
                            </Button>
                        </div>
                </div>
                <Select.Async
                    name="skill-select"
                    multi={true}
                    loadOptions={this.getOptions}
                    value={this.state.selectValue}
                    placeholder={formatMessage(messages.search)}
                    onChange={v => {this.setState({selectValue: v})}}
                    onFocus={() => {this.setState({queryBoxOpen: true}); return true}}
                />
            </div>
        )
    }
}


const mapStateToProps = (state) => {
  return {
    loggedInUser: state.auth.user,
  }
}

export default connect(mapStateToProps, { getSurprise, loadUsers })(injectIntl(QueryBox));



