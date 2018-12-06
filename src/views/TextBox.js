import React from 'react';
import PropTypes from 'prop-types';

const TextBox = (props) => (
  <input
    className="input"
    onChange={props.onChange}
    type="text"
    placeholder={props.placeholder}
  />
);
TextBox.propTypes = {
  onChange: PropTypes.func,
  placeholder: PropTypes.string
};

export default TextBox;
