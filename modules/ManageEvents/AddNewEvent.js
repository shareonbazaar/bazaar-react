import React from 'react';
import PropTypes from 'prop-types';
import { FormattedMessage, injectIntl } from 'react-intl';
import { Modal } from 'react-bootstrap';
import DateTime from 'react-datetime';
import validator from 'validator';

import ActionButton from '../Actions/ActionButton';
import ResponsiveInputField from '../Authentication/ResponsiveInputField';

class AddNewEvent extends React.Component {
  constructor(props) {
    super(props);
    this.state = this.initState();
    this.onSubmit = this.onSubmit.bind(this);
  }

  onChange(e, field) {
    this.setState({
      [field]: e.target.value,
      started: true,
    });
  }

  onSubmit() {
    const { title, description, link, happenedAt } = this.state;
    this.props.addEvent({
      title,
      description,
      link,
      happenedAt,
    });
    this.setState(this.initState());
  }

  initState() {
    return {
      showModal: false,
      started: false,
      title: '',
      description: '',
      link: '',
      happenedAt: Date.now(),
    };
  }

  render() {
    const { happenedAt, title, description, link, showModal, started } = this.state;
    return (
      <div>
        <Modal
          show={showModal}
          onHide={() => this.setState({ showModal: false })}
        >
          <Modal.Header>
            <Modal.Title>Add new event</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <ResponsiveInputField
              customInput
            >
              <DateTime
                dateFormat={'MMMM Do YYYY'}
                onChange={timestamp => this.setState({ happenedAt: timestamp })}
                defaultValue={happenedAt ? new Date(happenedAt) : Date.now()}
              />
            </ResponsiveInputField>
            <ResponsiveInputField
              formGroupIsValid={!started || title.length > 0}
              formControlType="text"
              formControlValue={title}
              formControlPlaceHolder="Name of event"
              formControlOnChange={(e) => { this.onChange(e, 'title'); }}
            />
            <ResponsiveInputField
              formGroupIsValid={!started || description.length > 0}
              formControlType="text"
              formControlValue={description}
              formControlPlaceHolder="Event description"
              formControlOnChange={(e) => { this.onChange(e, 'description'); }}
            />
            <ResponsiveInputField
              formGroupIsValid={!started || validator.isURL(link)}
              formControlType="text"
              formControlPlaceHolder="Link to Facebook event page"
              formControlOnChange={(e) => { this.onChange(e, 'link'); }}
              formControlValue={link}
            />
          </Modal.Body>
          <Modal.Footer style={{ textAlign: 'center' }}>
            <ActionButton
              onClick={this.onSubmit}
            >
              <FormattedMessage
                id={'ManageEvents.addEvent'}
                defaultMessage={'Add event'}
              />
            </ActionButton>
          </Modal.Footer>
        </Modal>
        <ActionButton
          onClick={() => this.setState({ showModal: true })}
        >
          <FormattedMessage
            id={'ManageEvents.newEvent'}
            defaultMessage={'New event'}
          />
        </ActionButton>
      </div>
    );
  }
}

AddNewEvent.propTypes = {
  events: PropTypes.array.isRequired,
  addEvent: PropTypes.func.isRequired,
  intl: PropTypes.object.isRequired,
};

export default injectIntl(AddNewEvent);

