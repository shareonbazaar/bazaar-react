import React from 'react';
import { shallow } from 'enzyme';

import { Modal, FormattedMessage, FormControl } from 'react-intl';
import AcceptanceModal from '../../AcceptanceModal/AcceptanceModal';

const skill = 'foobar';
const message = 'yo';

const getAcceptanceModal = (props = {}) => shallow(<AcceptanceModal {...props} />);
const formattedMessage = (<FormattedMessage
  id={'AcceptanceModal.getready'}
  defaultMessage={'Get ready for {skill}'}
  values={{ skill }}
/>);
const formControl = (<FormControl
  componentClass="textarea"
  value={message}
  placeholder="Enter text"
  onChange={() => this.hideModal()}
/>);
const modal = (<Modal
  className="acceptModal"
  showModal
  onHide={() => this.hideModal()}
/>);

// TODO: find out if tests really work. Somehow I am not sure. simo

describe('<AcceptanceModal />', () => {
  const mounted = getAcceptanceModal({ skill });
  it('renders <FormattedMessage> with skill', () => {
    expect(mounted.contains(formattedMessage)).toBeTruthy();
  });
  mounted.setState({ message });
  it('renders message from state in <FormControl> ', () => {
    expect(mounted.find(formControl)).toBeTruthy();
  });
  mounted.setState({ showModal: false });
  it('does not render <Modal /> when showModal = false', () => {
    expect(mounted.contains(modal)).toBeFalsy();
  });
  mounted.setState({ showModal: true });
  it('renders <Modal /> when showModal = true', () => {
    expect(mounted.find(modal)).toBeTruthy();
  });
});
