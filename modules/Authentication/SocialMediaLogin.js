import React from 'react';
import PropTypes from 'prop-types';
import GoogleLogin from 'react-google-login';
import FacebookLogin from 'react-facebook-login';
import { FormGroup } from 'react-bootstrap';
import { FormattedMessage } from 'react-intl';
/* global FACEBOOK_ID: true GOOGLE_ID: true */

function SocialMediaLogin(props) {
  const { disabled, responseGoogle, responseFacebook } = props;
  const socialMediaStyles = {
    width: '100%',
    borderRadius: '3px',
    border: 'none',
    color: 'white',
    display: 'block',
    textAlign: 'left',
    margin: '15px 0',
    opacity: disabled ? 0.3 : 1,
  };

  const iconStyle = {
    padding: '10px 20px',
    marginRight: '10px',
    borderRight: '1px solid rgba(0, 0, 0, 0.2)',
    fontSize: 'large',
  };
  return (
    <FormGroup>
      <div>
        <FacebookLogin
          buttonStyle={{ backgroundColor: '#3b5998', ...socialMediaStyles }}
          isDisabled={disabled}
          disableMobileRedirect
          appId={FACEBOOK_ID}
          autoLoad={false}
          fields="name,email,picture"
          callback={responseFacebook}
          icon={<i className="fa fa-facebook" style={iconStyle} />}
          cssClass="social-media-buttons facebook-login"
        >
          <FormattedMessage
            id={'Signup.loginwithFacebook'}
            defaultMessage={'Login with Facebook'}
          />
        </FacebookLogin>
        <GoogleLogin
          style={{ backgroundColor: '#dd4b39', ...socialMediaStyles }}
          disabled={disabled}
          clientId={GOOGLE_ID}
          buttonText="Login with Google"
          onSuccess={responseGoogle}
          onFailure={responseGoogle}
          disabledStyle={{}}
          fetchBasicProfile
          className="social-media-buttons google-login"
        >
          <i className="fa fa-google" style={{ ...iconStyle, padding: '10px 17.5px' }} />
          <span>
            <FormattedMessage
              id={'Signup.loginwithGoogle'}
              defaultMessage={'Login with Google'}
            />
          </span>
        </GoogleLogin>
      </div>
    </FormGroup>
  );
}
SocialMediaLogin.defaultProps = {
  disabled: false,
};

SocialMediaLogin.propTypes = {
  responseFacebook: PropTypes.func.isRequired,
  responseGoogle: PropTypes.func.isRequired,
  disabled: PropTypes.bool,
};

export default SocialMediaLogin;
