import React from 'react';
import PropTypes from 'prop-types';
import { FormControl, Modal, Button } from 'react-bootstrap';
import { TransitionMotion, spring } from 'react-motion';

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
      tempSelectedSkill: null,
      seeMoreCat: null,
    };
    this.onLevelSelect = this.onLevelSelect.bind(this);
    this.onSkillClick = this.onSkillClick.bind(this);
  }

  onLevelSelect(isHighLevel) {
    const { onSkillSelect } = this.props;
    const { tempSelectedSkill } = this.state;
    onSkillSelect({ ...tempSelectedSkill, isHighLevel });
    this.setState({
      tempSelectedSkill: null,
    });
  }

  onSkillClick(skill) {
    const { checkHighLevel, onSkillSelect } = this.props;
    if (checkHighLevel) {
      this.setState({ tempSelectedSkill: skill });
    } else {
      onSkillSelect(skill);
    }
  }

  renderCategory(category) {
    const { animate, categories } = this.props;
    return (
      <div className="skill-select" key={category._id}>
        <h4>{category.label.en}</h4>
        <TransitionMotion
          willLeave={() => (animate ? { transform: spring(0) } : null)}
          styles={category._skills.map(s => ({
            key: s._id,
            style: { transform: 100 },
            data: s,
          }))}
        >
          {
            interpolatedStyles =>
              (<div>
                {interpolatedStyles.map(config => (
                  <div
                    style={{ opacity: config.style.transform }}
                    key={config.data._id}
                    onClick={() => this.onSkillClick(config.data)}
                    className="skill-label"
                  >
                    {config.data.label.en}
                  </div>
                ))}
                <div
                  className="see-more skill-label"
                  onClick={() => this.setState({ seeMoreCat: categories.find(c => c._id === category._id) })}
                >
                  See more skills
                </div>
              </div>)
          }
        </TransitionMotion>
      </div>
    );
  }

  // renderModal() {
  //   const { tempSelectedSkill } = this.state;
  //   return (
  //     <Modal className="skill-level-modal" show={tempSelectedSkill !== null}>
  //       <Modal.Body>
  //         <h4>
  //           <FormattedMessage
  //             id={'Onboarding.highLevel'}
  //             defaultMessage={'Could you teach this skill at a high level?'}
  //           />
  //         </h4>
  //         <div className="temp-selected-skill">{tempSelectedSkill ? tempSelectedSkill.label.en : ''}</div>
  //         <div className="choices">
  //           <Button onClick={() => this.onLevelSelect(true)}>
  //             <FormattedMessage
  //               id={'Onboarding.yes'}
  //               defaultMessage={'Yes'}
  //             />
  //           </Button>
  //           <Button onClick={() => this.onLevelSelect(false)}>
  //             <FormattedMessage
  //               id={'Onboarding.no'}
  //               defaultMessage={'No'}
  //             />
  //           </Button>
  //         </div>
  //       </Modal.Body>
  //     </Modal>
  //   );
  // }

  renderSeeMoreModal() {
    const { seeMoreCat } = this.state;
    const { skills } = this.props;
    const skillIds = skills.map(s => s._id);
    let cat = null;
    if (seeMoreCat !== null) {
      cat = {
        ...seeMoreCat,
        _skills: seeMoreCat._skills.filter(s => skillIds.indexOf(s._id) < 0),
      };
    }
    return (
      <Modal className="see-more-modal" onHide={() => this.setState({ seeMoreCat: null })} show={seeMoreCat !== null}>
        <Modal.Body>
          { seeMoreCat !== null && this.renderCategory(cat) }
        </Modal.Body>
      </Modal>
    );
  }

  render() {
    const { onboardingSearch, onSkillRemove, skills, categories, checkHighLevel, searchText } = this.props;
    const { formatMessage } = this.props.intl;
    const skillIds = skills.map(s => s._id);
    const filteredResults = categories.map(cat => (
      {
        label: cat.label,
        _id: cat._id,
        _skills: cat._skills.filter(s => s.label.en.toLowerCase().indexOf(searchText.toLowerCase()) >= 0
          && skillIds.indexOf(s._id) < 0)
          .sort((a, b) => (a.label.en.length - b.label.en.length))
          .slice(0, NUM_SKILLS_TO_SHOW)
      }
    )).filter(c => c._skills.length > 0);

    return (
      <div className="skill-select-container">
        <p style={{ display: `${skills.length >= 2 ? 'none' : 'initial'}` }}>
          <FormattedMessage
            id={'Onboarding.chooseTwo'}
            defaultMessage={'Please choose at least two skills'}
          />
        </p>
        {
          skills.length === 0 ?
            <p className="no-skills">
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
          onChange={e => onboardingSearch(e.target.value)}
          value={searchText}
        />
        {
          filteredResults.map(this.renderCategory.bind(this))
        }
        {
          this.renderSeeMoreModal()
        }
      </div>
    );
  }
}

SelectSkills.propTypes = {
  searchText: PropTypes.string,
  onSkillSelect: PropTypes.func,
  onSkillRemove: PropTypes.func,
  onboardingSearch: PropTypes.func,
  skills: PropTypes.array,
  categories: PropTypes.array,
  checkHighLevel: PropTypes.bool,
  intl: PropTypes.object,
  animate: PropTypes.bool,
};

SelectSkills.defaultProps = {
  searchText: '',
  onSkillSelect: () => {},
  onSkillRemove: () => {},
  onboardingSearch: () => {},
  skills: [],
  categories: [],
  checkHighLevel: false,
  intl: null,
  animate: false,
};


export default injectIntl(SelectSkills);
