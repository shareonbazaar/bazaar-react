import React from 'react';
import PropTypes from 'prop-types';
import GoogleLogin from 'react-google-login';
import FacebookLogin from 'react-facebook-login';
import { FormGroup } from 'react-bootstrap';
import { FormattedMessage } from 'react-intl';
/* global FACEBOOK_ID: true GOOGLE_ID: true */

function SocialMediaLogin(props) {
  return (
    <FormGroup>
      <div className={props.className}>
        <FacebookLogin
          isDisabled={props.disabled}
          appId={FACEBOOK_ID}
          autoLoad={false}
          fields="name,email,picture"
          callback={props.responseFacebook}
          icon="fa-facebook"
          cssClass="social-media-buttons facebook-login"
        >
          <FormattedMessage
            id={'Signup.loginwithFacebook'}
            defaultMessage={'Login with Facebook'}
          />
        </FacebookLogin>
        <GoogleLogin
          disabled={props.disabled}
          clientId={GOOGLE_ID}
          buttonText="Login with Google"
          onSuccess={props.responseGoogle}
          onFailure={props.responseGoogle}
          fetchBasicProfile
          className="social-media-buttons google-login"
        >
          <i className="fa fa-google" />
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
  className: '',
  responseFacebook: () => {},
  responseGoogle: () => {},
  disabled: false,
};

SocialMediaLogin.propTypes = {
  className: PropTypes.string,
  responseFacebook: PropTypes.func,
  responseGoogle: PropTypes.func,
  disabled: PropTypes.bool,
};

export default SocialMediaLogin;
