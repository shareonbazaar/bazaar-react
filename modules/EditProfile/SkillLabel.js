import React from 'react';
import PropTypes from 'prop-types';

export default function SkillLabel(props) {
  const { label } = props;
  return <div className={`skill-label ${props.className}`}>{label}</div>;
}
SkillLabel.propTypes = {
  label: PropTypes.string,
};
SkillLabel.defaultProps = {
  label: '',
};
