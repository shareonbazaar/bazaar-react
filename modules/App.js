import React from 'react'
import { Link } from 'react-router'
import { IndexLink } from 'react-router'
import { Navbar } from 'react-bootstrap';
import SideBar from './SideBar'


export default class App extends React.Component {
  render() {
    return (
    	<div>
            <Navbar fixedTop={true} fluid={true}>
                <IndexLink to='/'>
                    <img width='20' src='/images/logo.png' />
                    <span className='brand-title'>Bazaar</span>
                </IndexLink>
                <button id='menu-toggle' type='button' className='navbar-toggle'>
                    <span className='sr-only'>Toggle navigation</span>
                    <span className='icon-bar'></span>
                    <span className='icon-bar'></span>
                    <span className='icon-bar'></span>
                </button>
            </Navbar>
            <SideBar />
    		{this.props.children}
    	</div>

    )
  }
}


