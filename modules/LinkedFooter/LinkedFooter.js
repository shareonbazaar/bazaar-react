import React from 'react';
import { Link } from 'react-router';

const footerStyle = {
  height: 52,
  align: 'center',
  textAlign: 'center',
  margin: 0,
  padding: 5,
  fontSize: 12,
};
const linkStyle = {
  padding: 4,
  margin: '0 2px',
};
const LinkedFooter = () =>
  (<div style={footerStyle}>
    <Link to="imprint" style={linkStyle}>Imprint</Link>
    <Link to="/terms" style={linkStyle}>Terms & Conditions</Link>
  </div>
  );

export default LinkedFooter;
