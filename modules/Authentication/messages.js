import { defineMessages } from 'react-intl';

const loginMessages = defineMessages({
  signupEmail: {
    id: 'Signup.email',
    defaultMessage: 'Email',
  },
  signupPassword: {
    id: 'Signup.password',
    defaultMessage: 'Password',
  },
});

const signupMessages = defineMessages({
  firstName: {
    id: 'Signup.firstname',
    defaultMessage: 'First Name',
  },
  lastName: {
    id: 'Signup.lastname',
    defaultMessage: 'Last Name',
  },
  email: {
    id: 'Signup.email',
    defaultMessage: 'Email',
  },
  password: {
    id: 'Signup.password',
    defaultMessage: 'Password',
  },
  confirmPassword: {
    id: 'Signup.confirmpassword',
    defaultMessage: 'Confirm password',
  },
});

exports.loginMessages = loginMessages;
exports.signupMessages = signupMessages;
