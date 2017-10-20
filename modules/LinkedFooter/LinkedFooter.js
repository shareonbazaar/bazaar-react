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
const LinkedFooter = () =>
  (<div style={footerStyle}>
    <Link to="imprint" style={{ padding: 4 }}>Imprint</Link>
    <Link to="/terms" style={{ padding: 4 }}>Terms & Conditions</Link>
  </div>
  );

export default LinkedFooter;
