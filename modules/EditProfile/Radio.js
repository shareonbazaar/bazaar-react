import React from 'react';
import PropTypes from 'prop-types';

function Radio(props) {
  const { name, selected, label, onClick } = props;
  const klass = `radio ${name === selected ? 'selected' : ''}`;
  return (
    <div onClick={onClick} name={name} className={klass}>
      <span>{label}</span>
    </div>
  );
}

Radio.propTypes = {
  name: PropTypes.string,
  selected: PropTypes.string,
  label: PropTypes.string,
  onClick: PropTypes.func,
};

Radio.defaultProps = {
  name: '',
  selected: '',
  label: '',
  onClick: () => {},
};

export default Radio;
