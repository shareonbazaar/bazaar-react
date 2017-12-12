import React from 'react';
import PropTypes from 'prop-types';
import { BAZAAR_BLUE, BAZAAR_ORANGE } from '../Layout/Styles';

export function SkillLabel(props) {
  const { skill, onClick, children, style } = props;
  let { isInterest, isSelected } = props;
  if (typeof isInterest === 'function') isInterest = isInterest(skill);
  if (typeof isSelected === 'function') isSelected = isInterest(skill);
  const skillLabelStyles = {
    borderRadius: '5px',
    textAlign: 'center',
    fontSize: '11px',
    padding: '8px 8px',
    ...style
  };

  let labelColor = BAZAAR_ORANGE;
  if (isInterest) {
    labelColor = BAZAAR_BLUE;
  }

  if (isSelected) {
    skillLabelStyles.backgroundColor = labelColor;
    skillLabelStyles.color = 'white';
  } else {
    skillLabelStyles.backgroundColor = 'white';
    skillLabelStyles.color = labelColor;
    skillLabelStyles.border = `2px solid ${labelColor}`;
  }

  return (
    <div onClick={() => onClick(skill)} style={skillLabelStyles}>
      {skill.label.en}
      {children}
    </div>
  );
}

SkillLabel.propTypes = {
  isInterest: PropTypes.oneOfType([PropTypes.bool, PropTypes.func]).isRequired,
  isSelected: PropTypes.oneOfType([PropTypes.bool, PropTypes.func]).isRequired,
  skill: PropTypes.object.isRequired,
  style: PropTypes.object,
  children: PropTypes.node,
  onClick: PropTypes.func,
};

SkillLabel.defaultProps = {
  onClick: () => {},
  children: null,
  isSelected: false,
  style: {},
};

export function SkillLabelContainer(props) {
  const { skills, isSelectedFunc, isInterestFunc } = props;
  return (
    <div style={{
      display: 'flex',
      flexWrap: 'wrap',
      justifyContent: 'space-between',
    }}
    >
      {
        skills.map(skill => (
          <SkillLabel
            key={skill._id}
            skill={skill}
            {...props}
            isInterest={isInterestFunc(skill)}
            isSelected={isSelectedFunc(skill)}
            style={{ flexBasis: '48%', margin: '1% 0' }}
          />
        ))
      }
    </div>
  );
}

SkillLabelContainer.propTypes = {
  isSelectedFunc: PropTypes.func,
  isInterestFunc: PropTypes.func.isRequired,
  skills: PropTypes.array.isRequired,
};

SkillLabelContainer.defaultProps = {
  isSelectedFunc: () => false,
};
