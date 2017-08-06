import React from 'react';
import PropTypes from 'prop-types';
import Select from 'react-select-plus';

import { connect } from 'react-redux';
// import { push } from 'react-router-redux';

import { Button } from 'react-bootstrap';
// import { Button, Grid, Col, Row } from 'react-bootstrap';

import ReactBootstrapSlider from 'react-bootstrap-slider';
import { RequestType } from '../models/Enums';
// import { RequestType, StatusType } from '../models/Enums';

import { loadUsers, getSurprise } from '../utils/actions';


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

  getOptions(input) {
    const inputL = input.toLowerCase();
    return fetch('/api/categories')
      .then(response => response.json())
      //eslint-disable-next-line
      .then((json) => {
        return {
          complete: true,
          options: [
            {
              label: 'Your interests',
              options: this.props.loggedInUser._skills
                .filter(s => s.label.en.toLowerCase().indexOf(inputL) >= 0)
                .map(s => ({ label: s.label.en, value: s._id }))
            },
            //eslint-disable-next-line
          ].concat(json.map((c) => {
            return {
              label: c.label.en,
              options: c._skills
                .filter(s => s.label.en.toLowerCase().indexOf(inputL) >= 0)
                .map(s => ({ label: s.label.en, value: s._id }))
            };
          }))
        };
      })
      .catch(err => console.log(err));
  }

  render() {
    return (
      <div className="query-box">
        <div className={`filter-options ${this.state.queryBoxOpen ? 'toggled' : ''}`}>
          {
            [
              {
                request_type: RequestType.LEARN,
                label: 'I want to receive',
              },
              {
                request_type: RequestType.SHARE,
                label: 'I want to give',
              },
              {
                request_type: RequestType.EXCHANGE,
                label: 'I want to exchange',
              }
            ].map((obj) => {
              const klass = `service-type ${this.state.request_type === obj.request_type ? 'selected' : ''}`;
              return (
                <div
                  key={obj.request_type}
                  onClick={() => this.setState({ request_type: obj.request_type })}
                  className={klass}
                >
                  {obj.label}
                </div>
              );
            })
          }
          <div className="slider-wrapper">
            Distance
            <ReactBootstrapSlider
              value={this.state.sliderValue}
              change={v => this.setState({ sliderValue: v })}
              slideStop={v => this.setState({ sliderValue: v })}
              step={2}
              max={MAX_SLIDER_VALUE}
              min={2}
            />
          </div>
          <div className="button-wrapper">
            <Button
              onClick={() => this.setState({ queryBoxOpen: false })}
              bsStyle="primary"
            >
              Cancel
            </Button>
            <Button
              onClick={() => {
                if (this.state.selectValue.length === 0) {
                  return;
                }
                this.props.loadUsers({
                  // distance: state.sliderValue, // NEED long, lat
                  request_type: this.state.request_type,
                  skills: this.state.selectValue.map(s => s.value)
                });
              }}
              bsStyle="primary"
            >
              Apply Filter
            </Button>
            <Button onClick={() => this.props.getSurprise()} bsStyle="primary" >Surprise me!</Button>
          </div>
        </div>
        <Select.Async
          name="skill-select"
          multi
          loadOptions={this.getOptions}
          value={this.state.selectValue}
          placeholder="Search for skills"
          onChange={(v) => { this.setState({ selectValue: v }); }}
          onFocus={() => { this.setState({ queryBoxOpen: true }); return true; }}
        />
      </div>
    );
  }
}
QueryBox.propTypes = {
  loggedInUser: PropTypes.node,
  loadUsers: PropTypes.func,
  getSurprise: PropTypes.func,
};

QueryBox.defaultProps = {
  loggedInUser: null,
  loadUsers: () => {},
  getSurprise: () => {},
};

//eslint-disable-next-line
const mapStateToProps = (state) => {
  return {
    loggedInUser: state.auth.user,
  };
};

export default connect(mapStateToProps, { getSurprise, loadUsers })(QueryBox);
