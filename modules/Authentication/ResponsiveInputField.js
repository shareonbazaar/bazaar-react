import React from 'react';
import PropTypes from 'prop-types';
import { FormGroup, ControlLabel, FormControl } from 'react-bootstrap';

export default function ResponsiveInputField(props) {
  // constructor(props) {
  //   super(props);
  // }
  const {
    formControlValue,
    formControlType,
    formControlPlaceHolder,
    formControlOnChange,
    formGroupIsValid,
    messageText,
  } = props;
  return (
    <FormGroup
      validationState={formGroupIsValid ? 'error' : null}
    >
      <ControlLabel>
        {messageText}
      </ControlLabel>
      <FormControl
        type={formControlType}
        value={formControlValue}
        placeholder={formControlPlaceHolder}
        onChange={formControlOnChange}
      />
    </FormGroup>
  );
}

ResponsiveInputField.propTypes = {
  formControlType: PropTypes.string,
  formControlValue: PropTypes.string,
  formControlPlaceHolder: PropTypes.string,
  formControlOnChange: PropTypes.func,
  formGroupIsValid: PropTypes.bool,
  children: PropTypes.node,
  messageText: PropTypes.string,
};

ResponsiveInputField.defaultProps = {
  formControlType: 'text',
  formControlValue: '',
  formControlPlaceHolder: '',
  formControlOnChange: () => {},
  formGroupIsValid: false,
  children: null,
  messageText: '',
};
