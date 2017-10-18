import { defineMessages } from 'react-intl';

const editProfileMessages = defineMessages({
  male: {
    id: 'EditProfile.male',
    defaultMessage: 'Male',
  },
  female: {
    id: 'EditProfile.female',
    defaultMessage: 'Female',
  },
  other: {
    id: 'EditProfile.other',
    defaultMessage: 'Other',
  },
  local: {
    id: 'EditProfile.local',
    defaultMessage: 'Local',
  },
  newcomer: {
    id: 'EditProfile.newcomer',
    defaultMessage: 'Newcomer',
  },
  gender: {
    id: 'EditProfile.gender',
    defaultMessage: 'What is your gender',
  },
  status: {
    id: 'EditProfile.status',
    defaultMessage: 'How would you describe yourself?',
  },
  aboutMe: {
    id: 'EditProfile.aboutme',
    defaultMessage: 'About me',
  },
  skills: {
    id: 'EditProfile.skills',
    defaultMessage: 'Skills I can offer',
  },
  interests: {
    id: 'EditProfile.interests',
    defaultMessage: 'Skills I want to receive',
  }
});

exports.editProfileMessages = editProfileMessages;
