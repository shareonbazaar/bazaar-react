import React from 'react';
import PropTypes from 'prop-types';
import MtSvgLines from 'react-mt-svg-lines';
import { defineMessages, FormattedMessage, injectIntl } from 'react-intl';
import { Modal, Button } from 'react-bootstrap';

import Signup from './Signup';
import SelectSkills from './SelectSkills';
import AboutMe from './AboutMe';

const stageData = [
  'my interests',
  'my skills',
  'my profile',
];

const messages = defineMessages({
  selectInterestsTitle: {
    id: 'Onboarding.selectInterestsTitle',
    defaultMessage: 'What skills are you interested in learning?',
  },
  selectSkillsTitle: {
    id: 'Onboarding.selectSkillsTitle',
    defaultMessage: 'What skills would you like to share?',
  },
  skillsInterestedIn: {
    id: 'Onboarding.skillsInterestedIn',
    defaultMessage: 'Skills you are interested in',
  },
  skillsToShare: {
    id: 'Onboarding.skillsToShare',
    defaultMessage: 'Skills you have selected to share on bazaar',
  },
});

function Stage(props) {
  return (
    <div onClick={props.onClick} className="onboarding-stage">
      <div
        className={`stage-index ${props.stage > props.index ? 'complete' : ''} ${props.stage === props.index ? 'selected' : ''}`}
      >
        {props.index + 1}
      </div>
      <div className="stage-title">
        {props.title}
      </div>
    </div>
  );
}

Stage.propTypes = {
  index: PropTypes.number,
  stage: PropTypes.number,
  title: PropTypes.string,
  onClick: PropTypes.func,
};

Stage.defaultProps = {
  index: 0,
  stage: 0,
  title: '',
  onClick: () => {},
};

function ProgressBar (props) {
  const { shouldAnimate, onStageClick, stage } = props;
  return (
    <div className="stages-container">
      <div className="stages">
        {
          stageData.map((title, i) =>
            <Stage onClick={() => onStageClick(i)} stage={stage} title={title} key={i} index={i} />)
        }
      </div>
      <div className="progress-container">
        <MtSvgLines animate={shouldAnimate} duration={2000}>
          <svg width="100%" height="10px" viewBox="0 0 200 2">
            {
              Array(stage).fill(0).map((v, i) =>
                (<path
                  key={i}
                  visibility={`${stage > i ? 'visible' : 'hidden'}`}
                  stroke="#2C2A57"
                  strokeWidth="2"
                  fill="none"
                  d={`M${30 + (75 * i)},0 H${95 + 75* i}`}
                />))
            }
          </svg>
        </MtSvgLines>
      </div>
    </div>
  );
}

ProgressBar.propTypes = {
  shouldAnimate: PropTypes.bool,
  onStageClick: PropTypes.func,
  stage: PropTypes.number,
};

ProgressBar.defaultProps = {
  shouldAnimate: false,
  onStageClick: () => {},
  stage: stageData.length,
};

function renderWelcome(props) {
  const { hasStarted, onStartClick } = props;
  return (
    <Modal
      show={!hasStarted}
      onHide={() => this.hideModal()}
      className="welcome-modal"
    >
      <Modal.Header>
        <Modal.Title>Welcome to Share on Bazaar</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <p>You can create your profile in 3 simple steps</p>
        <ProgressBar />
      </Modal.Body>
      <Modal.Footer>
        <Button
          onClick={onStartClick}
        >
          <FormattedMessage
            id={'ProgressBar.start'}
            defaultMessage={'Let\'s get started'}
          />
        </Button>
      </Modal.Footer>
    </Modal>
  );
}

function renderOnboarding(props) {
  const {
    stage,
    selectStage,
    selectSkill,
    removeSkill,
    chosenSkills,
    chosenInterests,
    completeOnboarding,
    categories,
    loginUser,
  } = props;

  const { formatMessage } = props.intl;
  let element = null;
  switch (stage) {
    case 0:
      element = (
        <SelectSkills
          skills={chosenInterests}
          onSkillSelect={s => selectSkill(s, true)}
          onSkillRemove={s => removeSkill(s, true)}
          title={formatMessage(messages.selectInterestsTitle)}
          chosenSkillsTitle={formatMessage(messages.skillsInterestedIn)}
          categories={categories}
          checkHighLevel={false}
        />
      );
      break;
    case 1:
      element = (
        <SelectSkills
          skills={chosenSkills}
          onSkillSelect={s => selectSkill(s, false)}
          onSkillRemove={s => removeSkill(s, false)}
          title={formatMessage(messages.selectSkillsTitle)}
          chosenSkillsTitle={formatMessage(messages.skillsToShare)}
          categories={categories}
          checkHighLevel
        />
      );
      break;
    case 2:
      element = <Signup {...props} />;
      break;
    default:
      element = null;
  }
  return (
    <div>
      <h3>{`Step ${stage + 1}`}</h3>
      <p>{stageData[stage]}</p>
      <ProgressBar shouldAnimate stage={stage} onStageClick={selectStage} />
      {element}
    </div>
  );
}

class View extends React.Component {
  componentDidMount() {
    this.props.loadCategories();
  }

  render() {
    const { hasStarted } = this.props;
    return (
      <div className="onboarding content-page">
        {
          hasStarted ? renderOnboarding(this.props) : renderWelcome(this.props)
        }
      </div>
    );
  }
}

View.propTypes = {
  stage: PropTypes.number,
  selectStage: PropTypes.func,
  progressStage: PropTypes.func,
  loadCategories: PropTypes.func,
  hasStarted: PropTypes.bool,
};

View.defaultProps = {
  stage: 1,
  selectStage: () => {},
  progressStage: () => {},
  loadCategories: () => {},
  hasStarted: false,
};

export default injectIntl(View);
