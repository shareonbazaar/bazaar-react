import React from 'react';
import PropTypes from 'prop-types';
import { FormControl, Modal } from 'react-bootstrap';
import { TransitionMotion, spring } from 'react-motion';
import { defineMessages, FormattedMessage, injectIntl } from 'react-intl';

import SkillLabel from '../EditProfile/SkillLabel';
import { Header1, Header2 } from '../Layout/Headers';
import CloseButton from '../Actions/CloseButton';
import { BAZAAR_BLUE, BAZAAR_ORANGE, LIGHT_GREY } from '../Layout/Styles';

const NUM_SKILLS_TO_SHOW = 3;
const sanitize = s => s.toLowerCase().trim();

const messages = defineMessages({
  placeholder: {
    id: 'Onboarding.placeholder',
    defaultMessage: 'Search skills here (e.g. photography)',
  },
});


function Category(props) {
  const { animate, category, onSkillClick, onSeeMoreClick, areInterests, showSeeMore } = props;
  const skillLevelStyle = {
    flexBasis: '47%',
    margin: '1% 0',
    cursor: 'pointer',
  };
  return (
    <div style={
      {
        padding: '6px 4px 10px 4px',
        margin: '10px 0',
        borderRadius: '5px',
        backgroundColor: 'white',
      }
    }
    >
      <Header1
        style={{
          textAlign: 'center',
          fontWeight: 'bold',
          color: `${areInterests ? BAZAAR_BLUE : BAZAAR_ORANGE}`,
        }}
      >
        {category.label.en}
      </Header1>
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
            (<div style={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'space-between' }}>
              {interpolatedStyles.map(config => (
                <SkillLabel
                  key={config.data._id}
                  style={{ opacity: config.style.transform, ...skillLevelStyle }}
                  onClick={() => onSkillClick(config.data)}
                  skill={config.data}
                  isInterest={areInterests}
                />
              ))}
              {
                showSeeMore &&
                <div
                  onClick={onSeeMoreClick}
                  style={{
                    ...skillLevelStyle,
                    borderRadius: '5px',
                    textAlign: 'center',
                    fontSize: '11px',
                    padding: '8px 8px',
                    color: `${areInterests ? BAZAAR_BLUE : BAZAAR_ORANGE}`,
                    backgroundColor: LIGHT_GREY,
                  }}
                >
                  See more skills
                </div>
              }
            </div>)
        }
      </TransitionMotion>
    </div>
  );
}

Category.propTypes = {
  onSeeMoreClick: PropTypes.func,
  onSkillClick: PropTypes.func.isRequired,
  category: PropTypes.object.isRequired,
  categories: PropTypes.array.isRequired,
  animate: PropTypes.bool.isRequired,
  areInterests: PropTypes.bool.isRequired,
  showSeeMore: PropTypes.bool,
};

Category.defaultProps = {
  onSeeMoreClick: () => {},
  showSeeMore: true,
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
      <Modal onHide={() => this.setState({ seeMoreCat: null })} show={seeMoreCat !== null}>
        <Modal.Body>
          <CloseButton onClick={() => this.setState({ seeMoreCat: null })} />
          <Category
            {...this.props}
            category={cat}
            onSkillClick={s => onSkillSelect(s)}
            showSeeMore={false}
          />
        </Modal.Body>
      </Modal>
    );
  }

  render() {
    const { onboardingSearch, onSkillRemove, skills, categories, searchText, onSkillSelect, areInterests } = this.props;
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
      <div>
        {
          skills.length < 2 &&
          <Header2>
            <FormattedMessage
              id={'Onboarding.chooseTwo'}
              defaultMessage={'Please choose at least two skills'}
            />
          </Header2>
        }
        {
          skills.length === 0 ?
            <p style={{ fontStyle: 'italic' }}>
              <FormattedMessage
                id={'Onboarding.noSkills'}
                defaultMessage={'You currently have no skills added'}
              />
            </p>
            :
            <div
              style={{ marginBottom: '10px', display: 'flex', flexWrap: 'wrap', justifyContent: 'space-between' }}
            >
              {
                skills.map(skill =>
                  (
                    <SkillLabel
                      skill={skill}
                      key={skill._id}
                      isSelected
                      isInterest={areInterests}
                      style={{ flexBasis: '47%', margin: '1% 0' }}
                    >
                      <div
                        onClick={() => onSkillRemove(skill)}
                        style={
                          {
                            display: 'inline-block',
                            backgroundColor: 'white',
                            borderRadius: '50%',
                            height: '12px',
                            width: '12px',
                            textAlign: 'center',
                            lineHeight: '12px',
                            marginLeft: '5px',
                            fontSize: '10px',
                            fontWeight: 'bold',
                            cursor: 'pointer',
                            float: 'right',
                            color: `${areInterests ? BAZAAR_BLUE : BAZAAR_ORANGE}`,
                          }
                        }
                      >
                        X
                      </div>
                    </SkillLabel>
                  )
                )
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
              />
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
  intl: PropTypes.object.isRequired,
  animate: PropTypes.bool,
  areInterests: PropTypes.bool.isRequired,
};

SelectSkills.defaultProps = {
  searchText: '',
  skills: [],
  animate: false,
};


export default injectIntl(SelectSkills);
