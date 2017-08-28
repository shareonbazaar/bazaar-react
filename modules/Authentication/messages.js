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
  signup: {
    id: 'Signup.signup',
    defaultMessage: 'Sign up',
  },
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
  alreadyHaveAccount: {
    id: 'Signup.alreadyhaveaccount',
    defaultMessage: 'Already have an account?',
  },
  login: {
    id: 'Signup.login',
    defaultMessage: 'Login',
  },
  forgotPassword: {
    id: 'Signup.forgotpassword',
    defaultMessage: 'Forgot Password?',
  },
  noAccount: {
    id: 'Signup.noaccount',
    defaultMessage: 'Don&apos;t have an account?',
  },
  confirmExchange: {
    id: 'Complete.confirmexchange',
    defaultMessage: 'Confirm exchange',
  },
});

exports.loginMessages = loginMessages;
exports.signupMessages = signupMessages;
