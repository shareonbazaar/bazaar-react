import React from 'react'
import { Link } from 'react-router'

export default class SideBarLink extends React.Component {
  render() {
    return (
    	<li>
            <Link className='sidebar-link' onClick={this.props.onClick} to={this.props.toLink}>
                <img src={this.props.imageSrc}/>
                {this.props.text}
            </Link>
        </li>

    )
  }
}
