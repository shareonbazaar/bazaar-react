import React from 'react';
import PropTypes from 'prop-types';
import { Button, Modal, FormGroup, ControlLabel, FormControl } from 'react-bootstrap';
import { FormattedMessage, defineMessages, injectIntl } from 'react-intl';

const messages = defineMessages({
  entertext: {
    id: 'ReviewModal.entertext',
    defaultMessage: 'Enter text',
  },
});

const NUM_STARS = 5;

//eslint-disable-next-line
class StarRating extends React.Component {
  render() {
    const { selected } = this.props;
    return (
      <div className="rating">
        {Array.from({ length: NUM_STARS }).map((v, i) =>
          (<span
            className={selected === i ? 'selected' : ''}
            onClick={() => this.props.onSelect(i)}
            key={i}
          >
          ☆
          </span>)
        )}
      </div>
    );
  }
}

StarRating.propTypes = {
  selected: PropTypes.number,
  onSelect: PropTypes.func,
};

StarRating.defaultProps = {
  selected: -1,
  onSelect: () => {},
};
// eslint-disable-next-line
class ReviewModal extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      value: '',
      showModal: false,
      ratingSelected: -1,
    };
    this.handleChange = this.handleChange.bind(this);
  }

  handleChange(e) {
    this.setState({
      value: e.target.value,
    });
  }

  render() {
    const { formatMessage } = this.props.intl;
    return (
      <div>
        <Button bsStyle="primary" onClick={() => this.setState({ showModal: true })}>
          <FormattedMessage
            id={'ReviewModal.writereview'}
            defaultMessage={'Write a Review'}
          />
        </Button>
        <Modal show={this.state.showModal} onHide={() => this.setState({ showModal: false })}>
          <Modal.Header closeButton>
            <Modal.Title>
              <FormattedMessage
                id={'ReviewModal.modaltitle'}
                defaultMessage={'Please leave a review for this exchange'}
              />
            </Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <form>
              <FormGroup>
                <ControlLabel>
                  <FormattedMessage
                    id={'ReviewModal.rating'}
                    defaultMessage={'Rating'}
                  />
                </ControlLabel>
                <StarRating
                  selected={this.state.ratingSelected}
                  onSelect={i => this.setState({ ratingSelected: i })}
                />
              </FormGroup>
              <FormGroup>
                <ControlLabel>
                  <FormattedMessage
                    id={'ReviewModal.writereview'}
                    defaultMessage={'Write a Review'}
                  />
                </ControlLabel>
                <FormControl
                  componentClass="textarea"
                  value={this.state.value}
                  placeholder={formatMessage(messages.entertext)}
                  onChange={this.handleChange}
                />
              </FormGroup>
            </form>
          </Modal.Body>
          <Modal.Footer>
            <Button onClick={() => this.setState({ showModal: false })} bsStyle="danger">
              <FormattedMessage
                id={'ReviewModal.notnow'}
                defaultMessage={'Not now'}
              />
            </Button>
            <Button
              onClick={() => {
                this.props.onSubmit({
                  rating: NUM_STARS - this.state.ratingSelected,
                  text: this.state.value,
                  t_id: this.props.transaction._id,
                });
                this.setState({ showModal: false });
              }}
              bsStyle="primary"
            >
              <FormattedMessage
                id={'ReviewModal.submitreview'}
                defaultMessage={'Submit Review'}
              />
            </Button>
          </Modal.Footer>
        </Modal>
      </div>
    );
  }
}

ReviewModal.propTypes = {
  transaction: PropTypes.object,
  onSubmit: PropTypes.func,
  intl: {
    formatMessage: PropTypes.func,
  },
};

ReviewModal.defaultProps = {
  transaction: {},
  onSubmit: () => {},
  intl: {
    formatMessage: () => {},
  }
};

export default injectIntl(ReviewModal);
