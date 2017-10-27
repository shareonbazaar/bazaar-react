import React from 'react';
import PropTypes from 'prop-types';
import Radium from 'radium';
import { FormGroup, ControlLabel, FormControl } from 'react-bootstrap';

function ResponsiveInputField(props) {
  const inputWrapperStyle = {
    display: 'inline-block',
    width: '100%',
    '@media (min-width: 768px)': {
      width: '60%',
    }
  };
  const controlLabelStyle = {
    display: 'inline-block',
    marginRight: '10px',
    verticalAlign: '-webkit-baseline-middle',
    '@media (min-width: 768px)': {
      textAlign: 'right',
      width: '25%',
    }
  };
  const {
    formControlValue,
    formControlType,
    formControlPlaceHolder,
    formControlOnChange,
    formGroupIsValid,
    messageText,
    children,
    customInput,
    ...rest,
  } = props;
  return (
    <FormGroup
      validationState={!formGroupIsValid ? 'error' : null}
    >
      <div style={controlLabelStyle}>
        <ControlLabel>
          {messageText}
        </ControlLabel>
      </div>

      <div style={inputWrapperStyle}>
        {customInput ?
          children :
          (<FormControl
            type={formControlType}
            value={formControlValue}
            placeholder={formControlPlaceHolder}
            onChange={formControlOnChange}
            {...rest}
          >
            {children}
          </FormControl>
          )
        }
      </div>
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
  customInput: PropTypes.bool,
  messageText: PropTypes.string,
};

ResponsiveInputField.defaultProps = {
  formControlType: 'text',
  formControlValue: '',
  formControlPlaceHolder: '',
  formControlOnChange: () => {},
  formGroupIsValid: true,
  children: null,
  customInput: false,
  messageText: '',
};

export default Radium(ResponsiveInputField);
