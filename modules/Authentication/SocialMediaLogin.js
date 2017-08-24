import React from 'react';
import PropTypes from 'prop-types';
import GoogleLogin from 'react-google-login';
import FacebookLogin from 'react-facebook-login';
import { FormGroup, FormattedMessage } from 'react-bootstrap';
/* global FACEBOOK_ID: true GOOGLE_ID: true */

export default function SocialMediaLogin(props) {
  return (
    <FormGroup>
      <div className={props.className}>
        <FacebookLogin
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
};

SocialMediaLogin.propTypes = {
  className: PropTypes.string,
  responseFacebook: PropTypes.func,
  responseGoogle: PropTypes.func,
};
