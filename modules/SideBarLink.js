import React from 'react';
import PropTypes from 'prop-types';
import { Link } from 'react-router';

//eslint-disable-next-line
export default class SideBarLink extends React.Component {
  render() {
    const { imageSrc, text, toLink, badgeNum } = this.props;
    return (
    	<li>
        <Link data-badge={badgeNum} className='sidebar-link' onClick={this.props.onClick} to={toLink}>
          <img src={imageSrc}/>
          {text}
        </Link>
      </li>
    )
  }
}

SideBarLink.propTypes = {
  onClick: PropTypes.func,
  toLink: PropTypes.string,
  imageSrc: PropTypes.string,
  text: PropTypes.string,
  badgeNum: PropTypes.number
};

SideBarLink.defaultProps = {
  onClick: () => {},
  toLink: '',
  imageSrc: '',
  text: '',
  badgeNum: 0
};
