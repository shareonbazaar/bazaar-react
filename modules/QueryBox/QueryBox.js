import React from 'react';
import PropTypes from 'prop-types';
import Select from 'react-select-plus';
import ReactBootstrapSlider from 'react-bootstrap-slider';
import { connect } from 'react-redux';
// import { Button, Grid, Col, Row } from 'react-bootstrap';
import { Button } from 'react-bootstrap';
// import { push } from 'react-router-redux';
import { FormattedMessage, defineMessages, injectIntl } from 'react-intl';

import { RequestType } from '../../src/utils/Enums';
import { loadUsers, getSurprise } from '../../utils/actions';


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

  getOptions(input) {
    const { loggedInUser, intl } = this.props;
    const { formatMessage } = intl;
    const inputL = input.toLowerCase();
    return fetch('/api/categories')
      .then(response => response.json())
      // eslint-disable-next-line
      .then(json => {
        return {
          complete: true,
          options: [
            {
              label: formatMessage(messages.yourinterests),
              options: loggedInUser._skills
                .filter(s => s.label.en.toLowerCase().indexOf(inputL) >= 0)
                .map(s => ({ label: s.label.en, value: s._id }))
            },
          // eslint-disable-next-line
          ].concat(json.map(c => {
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
    const { formatMessage } = this.props.intl;
    const { queryBoxOpen, request_type, sliderValue, selectValue } = this.state;
    return (
      <div className="query-box">
        <div className={`filter-options ${queryBoxOpen ? 'toggled' : ''}`}>
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
            // eslint-disable-next-line
            ].map(obj => {
              // eslint-disable-next-line
              const klass = `service-type ${request_type === obj.request_type ? 'selected' : ''}`;
              return (
                <div
                  key={obj.request_type}
                  onClick={() => this.setState({ request_type: obj.request_type })}
                  className={klass}
                >
                  {obj.label}
                </div>);
            })
          }
          <div className="slider-wrapper">
            <FormattedMessage
              id={'QueryBox.distance'}
              defaultMessage={'Distance'}
            />
            <ReactBootstrapSlider
              value={sliderValue}
              change={v => this.setState({ sliderValue: v })}
              slideStop={v => this.setState({ sliderValue: v })}
              step={2}
              max={MAX_SLIDER_VALUE}
              min={2}
            />
          </div>

          <div className="button-wrapper">
            <Button onClick={() => this.setState({ queryBoxOpen: false })} bsStyle="primary">
              <FormattedMessage
                id={'QueryBox.cancel'}
                defaultMessage={'Cancel'}
              />
            </Button>
            <Button
              onClick={() => {
                if (selectValue.length === 0) {
                  return;
                }
                this.props.loadUsers({
                  // distance: state.sliderValue, // NEED long, lat
                  request_type,
                  skills: selectValue.map(s => s.value)
                });
              }}
              bsStyle="primary"
            >
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
          multi
          loadOptions={this.getOptions}
          value={selectValue}
          placeholder={formatMessage(messages.search)}
          onChange={v => this.setState({ selectValue: v })}
          onFocus={() => { this.setState({ queryBoxOpen: true }); return true; }}
        />
      </div>
    );
  }
}
QueryBox.propTypes = {
  loggedInUser: PropTypes.object,
  loadUsers: PropTypes.func,
  getSurprise: PropTypes.func,
  intl: PropTypes.object,
};

QueryBox.defaultProps = {
  loggedInUser: {},
  loadUsers: () => {},
  getSurprise: () => {},
  intl: null,
};

//eslint-disable-next-line
const mapStateToProps = ({ auth }) => {
  return {
    loggedInUser: auth.user,
  };
};

export default connect(mapStateToProps, { getSurprise, loadUsers })(injectIntl(QueryBox));
