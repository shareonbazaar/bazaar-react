import React from 'react';
import PropTypes from 'prop-types';
import { FormControl, Modal } from 'react-bootstrap';
import { TransitionMotion, spring } from 'react-motion';

import { defineMessages, FormattedMessage, injectIntl } from 'react-intl';

const NUM_SKILLS_TO_SHOW = 3;
const sanitize = s => s.toLowerCase().trim();

const messages = defineMessages({
  placeholder: {
    id: 'Onboarding.placeholder',
    defaultMessage: 'Search skills here (e.g. photography)',
  },
});

function Category(props) {
  const { animate, category, children, onSkillClick, onSeeMoreClick, areInterests } = props;
  return (
    <div className="skill-select" key={category._id}>
      {children}
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
                  onClick={() => onSkillClick(config.data)}
                  className={`skill-label ${areInterests ? 'receive' : 'offer'}`}
                >
                  {config.data.label.en}
                </div>
              ))}
              <div
                className="see-more skill-label"
                onClick={onSeeMoreClick}
              >
                See more skills
              </div>
            </div>)
        }
      </TransitionMotion>
    </div>
  );
}

Category.propTypes = {
  children: PropTypes.object,
  onSeeMoreClick: PropTypes.func,
  onSkillClick: PropTypes.func.isRequired,
  category: PropTypes.object.isRequired,
  categories: PropTypes.array.isRequired,
  animate: PropTypes.bool.isRequired,
  areInterests: PropTypes.bool.isRequired,
};

Category.defaultProps = {
  children: null,
  onSeeMoreClick: () => {},
};


class SelectSkills extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      seeMoreCat: null,
    };
    this.onKeyPress = this.onKeyPress.bind(this);
  }

  onKeyPress(e) {
    const { categories, onSkillSelect } = this.props;
    if (e.charCode === 13) {
      const text = sanitize(e.target.value);
      categories.some(c =>
        c._skills.some((s) => {
          if (sanitize(s.label.en) === text) {
            onSkillSelect(s);
            return true;
          }
          return false;
        })
      );
    }
  }

  renderSeeMoreModal() {
    const { seeMoreCat } = this.state;
    const { onSkillSelect } = this.props;
    if (seeMoreCat === null) return null;
    const { skills } = this.props;
    const skillIds = skills.map(s => s._id);
    const cat = {
      ...seeMoreCat,
      _skills: seeMoreCat._skills.filter(s => skillIds.indexOf(s._id) < 0),
    };
    return (
      <Modal className="see-more-modal" onHide={() => this.setState({ seeMoreCat: null })} show={seeMoreCat !== null}>
        <Modal.Header closeButton>
          <h4>{cat.label.en}</h4>
        </Modal.Header>
        <Modal.Body>
          <Category
            {...this.props}
            category={cat}
            onSkillClick={s => onSkillSelect(s)}
          />
        </Modal.Body>
      </Modal>
    );
  }

  render() {
    const { onboardingSearch, onSkillRemove, skills, categories, searchText, onSkillSelect } = this.props;
    const { formatMessage } = this.props.intl;
    const skillIds = skills.map(s => s._id);
    const filteredResults = categories.map(cat => (
      {
        label: cat.label,
        _id: cat._id,
        _skills: cat._skills.filter(s => sanitize(s.label.en).indexOf(sanitize(searchText)) >= 0
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
            <div className="selected-skills-container">
              {
                skills.map(skill =>
                  (<div className="selected-skill" key={skill._id}>
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
          onKeyPress={this.onKeyPress}
        />
        {
          filteredResults.map(c =>
            (
              <Category
                key={c._id}
                {...this.props}
                category={c}
                onSkillClick={s => onSkillSelect(s)}
                onSeeMoreClick={() => this.setState({ seeMoreCat: categories.find(c2 => c2._id === c._id) })}
              >
                <h4>{c.label.en}</h4>
              </Category>
            )
          )
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
  onSkillSelect: PropTypes.func.isRequired,
  onSkillRemove: PropTypes.func.isRequired,
  onboardingSearch: PropTypes.func.isRequired,
  skills: PropTypes.array,
  categories: PropTypes.array.isRequired,
  intl: PropTypes.object,
  animate: PropTypes.bool,
};

SelectSkills.defaultProps = {
  searchText: '',
  skills: [],
  intl: null,
  animate: false,
};


export default injectIntl(SelectSkills);
