import React from 'react';
import PropTypes from 'prop-types';
import { FormGroup, ControlLabel, FormControl } from 'react-bootstrap';

export default function ResponsiveInputField(props) {
  const {
    formControlValue,
    formControlType,
    formControlPlaceHolder,
    formControlOnChange,
    formGroupIsValid,
    messageText,
    className,
    children,
    shouldChildRender,
    ...rest,
  } = props;
  if (children && !shouldChildRender) {
    return (
      <FormGroup>
        {children}
      </FormGroup>
    );
  }
  return (
    <FormGroup
      validationState={formGroupIsValid ? 'error' : null}
    >
      <ControlLabel className={className}>
        {messageText}
      </ControlLabel>
      {shouldChildRender ?
        children :
        (<FormControl
          type={formControlType}
          value={formControlValue}
          placeholder={formControlPlaceHolder}
          onChange={formControlOnChange}
          {...rest}
        />)
      }
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
  shouldChildRender: PropTypes.bool,
  messageText: PropTypes.string,
  className: PropTypes.string,
};

ResponsiveInputField.defaultProps = {
  formControlType: 'text',
  formControlValue: '',
  formControlPlaceHolder: '',
  formControlOnChange: () => {},
  formGroupIsValid: false,
  children: null,
  shouldChildRender: false,
  messageText: '',
  className: '',
};
