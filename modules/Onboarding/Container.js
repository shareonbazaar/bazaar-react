import { connect } from 'react-redux';
import { push } from 'react-router-redux';
import View from './View';
import {
  selectStage,
  onStartClick,
  selectSkill,
  removeSkill,
  aboutMeChange,
  updateProfile,
  loadCategories,
  loginUser,
  onNewcomerSelect,
  clearLoginAlert,
  onboardingSearch } from '../../utils/actions';

function mapStateToProps({ onboarding, categories, auth }) {
  return {
    stage: onboarding.stage,
    chosenSkills: onboarding.skills,
    chosenInterests: onboarding.interests,
    aboutMeText: onboarding.aboutMeText,
    hasStarted: onboarding.hasStarted,
    categories: categories.items,
    isAuthenticated: auth.isAuthenticated,
    loginResponse: auth.loginResponse,
    animate: onboarding.animate,
    searchText: onboarding.searchText,
    isNewcomer: onboarding.isNewcomer,
  };
}

function mergeProps(stateProps, dispatchProps, ownProps) {
  const { stage, aboutMeText, chosenInterests, chosenSkills } = stateProps;
  const { updateProfile, push } = dispatchProps;

  const completeOnboarding = () => {
    const form = new FormData();
    form.append('aboutMe', aboutMeText);

    if (chosenSkills.length === 0) {
      form.append('_skills', '');
    } else {
      chosenSkills.forEach(s => form.append('_skills', s._id));
    }

    if (chosenInterests.length === 0) {
      form.append('_interests', '');
    } else {
      chosenInterests.forEach(s => form.append('_interests', s._id));
    }

    updateProfile(form);

    push('/');
  };

  return Object.assign({}, ownProps, stateProps, dispatchProps, {
    completeOnboarding,
  });
}

export default connect(mapStateToProps, {
  selectStage,
  selectSkill,
  removeSkill,
  push,
  aboutMeChange,
  updateProfile,
  onStartClick,
  loadCategories,
  loginUser,
  onboardingSearch,
  onNewcomerSelect,
  clearLoginAlert,
}, mergeProps)(View);
