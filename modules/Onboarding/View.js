import React from 'react';
import PropTypes from 'prop-types';
import MtSvgLines from 'react-mt-svg-lines';
import { defineMessages, FormattedMessage, injectIntl } from 'react-intl';
import { Modal, Button } from 'react-bootstrap';

import Signup from './Signup';
import SelectSkills from './SelectSkills';

const stageData = [
  'receive',
  'offer',
  'profile',
];

const stageDataTitles = [
  'skills I want to receive',
  'skills I can offer',
  'my profile',
];

const messages = defineMessages({
  selectInterestsTitle: {
    id: 'Onboarding.selectInterestsTitle',
    defaultMessage: 'skills I want to receive',
  },
  selectSkillsTitle: {
    id: 'Onboarding.selectSkillsTitle',
    defaultMessage: 'skills I can offer',
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
        className={`stage-index ${props.stage > props.index ? 'complete' : ''} 
        ${props.stage === props.index ? 'selected' : ''} 
        ${props.isActive ? 'active' : ''}`}
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
  isActive: PropTypes.bool
};

Stage.defaultProps = {
  index: 0,
  stage: 0,
  title: '',
  onClick: () => {},
  isActive: false,
};

function ProgressBar(props) {
  const { shouldAnimate, onStageClick, stage, stagesActive } = props;
  return (
    <div className="stages-container">
      <div className="stages">
        {
          stageData.map((title, i) =>
            (<Stage
              onClick={() => onStageClick(i)}
              isActive={stagesActive.indexOf(i) >= 0}
              stage={stage}
              title={title}
              key={i}
              index={i}
            />))
        }
      </div>
      <div className="progress-container">
        <MtSvgLines animate={shouldAnimate} duration={2000}>
          <svg className="progress-line" width="100%" height="7px" viewBox="0 0 200 2">
            {
              Array(stage).fill(0).map((v, i) =>
                (<path
                  key={i}
                  visibility={`${stage > i ? 'visible' : 'hidden'}`}
                  stroke="#5A7587"
                  strokeWidth="2"
                  fill="none"
                  d={`M${40 + (60 * i)},0 H${95 + (75 * i)}`}
                />))
            }
          </svg>
        </MtSvgLines>
        {
          stage === stageData.length &&
          <svg className="arrow">
            <polygon points="0,0 0,20 20,10" style={{ fill: '#2C2A57', stroke: '#2C2A57' }} />
          </svg>
        }
      </div>
    </div>
  );
}

ProgressBar.propTypes = {
  shouldAnimate: PropTypes.bool,
  onStageClick: PropTypes.func.isRequired,
  stage: PropTypes.number,
  stagesActive: PropTypes.array,
};

ProgressBar.defaultProps = {
  shouldAnimate: false,
  stage: stageData.length,
  stagesActive: [],
};

function Welcome(props) {
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

Welcome.propTypes = {
  hasStarted: PropTypes.bool.isRequired,
  onStartClick: PropTypes.func.isRequired,
};


function Onboarding(props) {
  const {
    stage,
    selectStage,
    selectSkill,
    removeSkill,
    chosenSkills,
    chosenInterests,
    intl,
  } = props;

  const stagesActive = [];
  if (chosenInterests.length >= 2) {
    stagesActive.push(1);
  }
  if (chosenSkills.length >= 2) {
    stagesActive.push(2);
  }
  const { formatMessage } = intl;
  let element = null;
  switch (stage) {
    case 0:
      element = (
        <SelectSkills
          skills={chosenInterests}
          onSkillSelect={s => selectSkill(s, true)}
          onSkillRemove={s => removeSkill(s, true)}
          title={formatMessage(messages.selectInterestsTitle)}
          areInterests
          {...props}
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
          areInterests={false}
          {...props}
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
      <h3><span style={{ fontWeight: 'bold' }}>{`Step ${stage + 1}:`} </span>{`${stageDataTitles[stage]}`}</h3>
      <ProgressBar stagesActive={stagesActive} shouldAnimate stage={stage} onStageClick={selectStage} />
      {element}
    </div>
  );
}

Onboarding.propTypes = {
  stage: PropTypes.number.isRequired,
  intl: PropTypes.object.isRequired,
  selectStage: PropTypes.func.isRequired,
  loadCategories: PropTypes.func.isRequired,
  selectSkill: PropTypes.func.isRequired,
  removeSkill: PropTypes.func.isRequired,
  chosenSkills: PropTypes.array.isRequired,
  chosenInterests: PropTypes.array.isRequired,
};

class View extends React.Component {
  componentDidMount() {
    window.scrollTo(0, 0);
    this.props.loadCategories();
  }

  componentWillReceiveProps(nextProps) {
    if (nextProps.stage !== this.props.stage) {
      window.scrollTo(0, 0);
    }
  }

  render() {
    const { hasStarted } = this.props;
    return (
      <div className="onboarding content-page">
        {
          hasStarted ?
            <Onboarding {...this.props} />
            :
            <Welcome {...this.props} />
        }
      </div>
    );
  }
}

View.propTypes = {
  stage: PropTypes.number,
  selectStage: PropTypes.func.isRequired,
  loadCategories: PropTypes.func.isRequired,
  hasStarted: PropTypes.bool,
};

View.defaultProps = {
  stage: 1,
  hasStarted: false,
};

export default injectIntl(View);
