import React from 'react';
import PropTypes from 'prop-types';
import { FormControl, Modal, Button } from 'react-bootstrap';

import { defineMessages, FormattedMessage, injectIntl } from 'react-intl';

const NUM_SKILLS_TO_SHOW = 3;

const messages = defineMessages({
  placeholder: {
    id: 'Onboarding.placeholder',
    defaultMessage: 'Search skills here (e.g. photography)',
  },
});


class SelectSkills extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      inputText: '',
      tempSelectedSkill: null,
    };
    this.onLevelSelect = this.onLevelSelect.bind(this);
  }

  onLevelSelect(isHighLevel) {
    const { onSkillSelect } = this.props;
    const { tempSelectedSkill } = this.state;
    onSkillSelect({ ...tempSelectedSkill, isHighLevel });
    this.setState({
      tempSelectedSkill: null,
    });
  }

  renderModal() {
    const { tempSelectedSkill } = this.state;
    return (
      <Modal className="skill-level-modal" show={tempSelectedSkill !== null}>
        <Modal.Body>
          <h4>
            <FormattedMessage
              id={'Onboarding.highLevel'}
              defaultMessage={'Could you teach this skill at a high level?'}
            />
          </h4>
          <div className="temp-selected-skill">{tempSelectedSkill ? tempSelectedSkill.label.en : ''}</div>
          <div className="choices">
            <Button onClick={() => this.onLevelSelect(true)}>
              <FormattedMessage
                id={'Onboarding.yes'}
                defaultMessage={'Yes'}
              />
            </Button>
            <Button onClick={() => this.onLevelSelect(false)}>
              <FormattedMessage
                id={'Onboarding.no'}
                defaultMessage={'No'}
              />
            </Button>
          </div>
        </Modal.Body>
      </Modal>
    );
  }

  render() {
    const { title, onSkillSelect, onSkillRemove, skills, categories, checkHighLevel } = this.props;
    const { formatMessage } = this.props.intl;
    const { inputText } = this.state;

    return (
      <div className="skill-select-container">
        <h4 style={{display: `${skills.length >= 2 ? 'none' : 'initial'}`}}>
          <FormattedMessage
            id={'Onboarding.chooseTwo'}
            defaultMessage={'Please choose at least two skills'}
          />
          <span className="skills-count">{2 - skills.length}</span>
        </h4>
        {
          skills.length === 0 ?
            <p>
              <FormattedMessage
                id={'Onboarding.noSkills'}
                defaultMessage={'You currently have no skills added'}
              />
            </p>
            :
            <div className={`selected-skills-container ${checkHighLevel ? 'contains-high-level' : ''}`}>
              {
                skills.map(skill =>
                  (<div className={`selected-skill ${skill.isHighLevel ? 'high-level' : ''}`} key={skill._id}>
                    {skill.label.en}
                    <div className="delete" onClick={() => onSkillRemove(skill)}>X</div>
                    </div>
                  ))
              }
            </div>
        }
        <FormControl
          type="text"
          placeholder={formatMessage(messages.placeholder)}
          onChange={e => this.setState({ inputText: e.target.value })}
          value={inputText}
        />
        {
          categories.map(cat =>
            (
              <div className="skill-select" key={cat._id}>
                <h4>{cat.label.en}</h4>
                {
                  cat._skills.filter(s => s.label.en.toLowerCase().indexOf(inputText.toLowerCase()) >= 0)
                    .sort((a, b) => (a.label.en.length - b.label.en.length)).slice(0, NUM_SKILLS_TO_SHOW).map(skill =>
                      (
                        <div
                          key={skill._id}
                          onClick={() => checkHighLevel ? this.setState({ tempSelectedSkill: skill }) : onSkillSelect(skill)}
                          className="skill-label"
                        >
                          {skill.label.en}
                        </div>
                      )
                    )
                }
              </div>
            ))
        }
        {
          this.renderModal()
        }
      </div>
    );
  }
}

SelectSkills.propTypes = {
  title: PropTypes.string,
  onSkillSelect: PropTypes.func,
  onSkillRemove: PropTypes.func,
  skills: PropTypes.array,
  categories: PropTypes.array,
  checkHighLevel: PropTypes.bool,
  intl: PropTypes.object,
};

SelectSkills.defaultProps = {
  title: '',
  onSkillSelect: () => {},
  onSkillRemove: () => {},
  skills: [],
  categories: [],
  checkHighLevel: false,
  intl: null,
};


export default injectIntl(SelectSkills);
