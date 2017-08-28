import { defineMessages } from 'react-intl';

const contactMessages = defineMessages({
  name: {
    id: 'Contact.name',
    defaultMessage: 'Your name',
  },
  email: {
    id: 'Contact.email',
    defaultMessage: 'Your Email',
  },
  message: {
    id: 'Contact.message',
    defaultMessage: 'Your Message',
  },
  submit: {
    id: 'Contact.submit',
    defaultMessage: 'Submit',
  }
});

exports.contactMessages = contactMessages;
