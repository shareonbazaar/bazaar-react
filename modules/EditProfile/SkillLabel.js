import React from 'react';
import PropTypes from 'prop-types';
import { BAZAAR_BLUE, BAZAAR_ORANGE } from '../Layout/Styles';

export default function SkillLabel(props) {
  const { skill, isInterest, isSelected, onClick, children, style } = props;
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
    <div onClick={onClick} style={skillLabelStyles}>
      {skill.label.en}
      {children}
    </div>
  );
}

SkillLabel.propTypes = {
  isInterest: PropTypes.bool.isRequired,
  isSelected: PropTypes.bool,
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
