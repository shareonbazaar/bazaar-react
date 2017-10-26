import React from 'react';
import PropTypes from 'prop-types';
import MtSvgLines from 'react-mt-svg-lines';
import { defineMessages, FormattedMessage, injectIntl } from 'react-intl';
import { Modal } from 'react-bootstrap';

import Signup from './Signup';
import SelectSkills from './SelectSkills';
import ActionButton from '../Actions/ActionButton';
import { BAZAAR_ORANGE, BAZAAR_BLUE } from '../Layout/Styles';
import { Header1 } from '../Layout/Headers';

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
  const { stage, onClick, index, title } = props;
  return (
    <div
      onClick={onClick}
      style={{
        flexGrow: 1,
        textAlign: 'center',
      }}
    >
      <div
        style={{
          fontSize: '28px',
          backgroundColor: stage >= index ? BAZAAR_ORANGE : BAZAAR_BLUE,
          color: 'white',
          borderRadius: '50%',
          width: '45px',
          height: '45px',
          margin: '0 auto 5px auto',
          lineHeight: '50px',
        }}
      >
        {index + 1}
      </div>
      <div style={{ fontSize: '11px' }}>
        {title}
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

function ProgressBar(props) {
  const { onStageClick, stage, stagesActive } = props;
  return (
    <div
      style={{
        position: 'relative',
        height: '52px',
        marginBottom: '20px',
      }}
    >
      <div
        style={{
          position: 'absolute',
          top: '0px',
          left: '0px',
          width: '100%',
          zIndex: '5',
          display: 'flex',
        }}
      >
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
      <div
        style={{
          position: 'absolute',
          top: '50%',
          left: '50%',
          transform: 'translate(-50%, -75%)',
          width: '100%',
          zIndex: '0',
          display: 'flex',
        }}
      >
        <MtSvgLines animate={false} duration={2000} style={{ flexGrow: 1 }}>
          <svg style={{ verticalAlign: 'text-bottom' }} width="100%" height="7px" viewBox="0 0 200 2">
            {
              Array(stageData.length - 1).fill(0).map((v, i) =>
                (<path
                  key={i}
                  stroke={stage > i ? BAZAAR_ORANGE : BAZAAR_BLUE}
                  strokeWidth="2"
                  fill="none"
                  d={`M${40 + (60 * i)},0 H${95 + (75 * i)}`}
                />))
            }
          </svg>
        </MtSvgLines>
      </div>
    </div>
  );
}

ProgressBar.propTypes = {
  onStageClick: PropTypes.func,
  stage: PropTypes.number,
  stagesActive: PropTypes.array,
};

ProgressBar.defaultProps = {
  stage: stageData.length,
  stagesActive: [],
  onStageClick: () => {},
};

function Welcome(props) {
  const { hasStarted, onStartClick } = props;
  return (
    <Modal
      show={!hasStarted}
      onHide={() => this.hideModal()}
      style={{ textAlign: 'center' }}
    >
      <Modal.Header>
        <Modal.Title>Welcome to Share on Bazaar</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <h5>You can create your profile in 3 simple steps</h5>
        <ProgressBar stage={-1} />
      </Modal.Body>
      <Modal.Footer style={{ textAlign: 'center' }}>
        <ActionButton
          onClick={onStartClick}
        >
          <FormattedMessage
            id={'ProgressBar.start'}
            defaultMessage={'Let\'s get started'}
          />
        </ActionButton>
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
      <Header1><span style={{ fontWeight: 'bold' }}>{`Step ${stage + 1}:`} </span>{`${stageDataTitles[stage]}`}</Header1>
      <ProgressBar stagesActive={stagesActive} stage={stage} onStageClick={selectStage} />
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
      <div className="content-page">
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
