import React from 'react';
import { shallow } from 'enzyme';
import { Modal, Button } from 'react-bootstrap';

import ConfirmationModal from '../ConfirmationModal';


const buttonStyles = ['success', 'warning', 'danger', 'info', 'default', 'primary', 'link'];
const title = 'foobar';
const getConfirmationModal = (props = {}) => shallow(<ConfirmationModal confirmStyle="default" {...props} />);
const modal = <Modal show onHide={() => this.hideModal()} />;
const getButton = (props = {}) => <Button {...props} />;

const openModal = () => this.openModal();
const hideModal = () => this.closeModal();

/*
TODO: test 2 & 3 are still not kosher ..
      you can type anything into find and it will
      pass..
 */
describe('<ConfirmationModal />', () => {
  const mounted = getConfirmationModal();
  it('renders title', () => {
    mounted.setProps({ title });
    expect(mounted.contains(title)).toBeTruthy();
  });
  it('renders modal when showModal = true', () => {
    mounted.setState({ showModal: true });
    expect(mounted.find(modal)).toBeTruthy();
  });
  it('renders buttonText button & buttonText', () => {
    const textButton = (<Button bsStyle="default" onClick={openModal}>foo</Button>);
    mounted.setProps({ buttonStyle: 'default', buttonText: 'foo' });
    expect(mounted.find(textButton)).toBeTruthy();
  });
  it('does not render confirm Button with wrong style', () => {
    mounted.setProps({ confirmStyle: 'success' });
    expect(mounted.contains(getButton({ bsStyle: 'default', onClick: hideModal }))).toBeFalsy();
  });
});
