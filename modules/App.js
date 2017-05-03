import React from 'react'
import { Link } from 'react-router'
import { IndexLink } from 'react-router'
import { Navbar } from 'react-bootstrap';
import { connect } from 'react-redux';
import SideBar from './SideBar'

import QueryBox from './QueryBox'

class App extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            openSideBar: false,
        };
    }

    render() {
        return (
            <div className='app'>
                <Navbar fixedTop={true} fluid={true}>
                    <IndexLink to='/'>
                        <img width='20' src='/images/logo.png' />
                        <span className='brand-title'>Bazaar</span>
                    </IndexLink>
                    {
                        this.props.location.pathname === '/'
                        && this.props.isAuthenticated
                        && <QueryBox />
                    }
                    <button onClick={() => this.setState({openSideBar: !this.state.openSideBar})} id='menu-toggle' type='button' className='navbar-toggle'>
                        <span className='sr-only'>Toggle navigation</span>
                        <span className='icon-bar'></span>
                        <span className='icon-bar'></span>
                        <span className='icon-bar'></span>
                    </button>
                </Navbar>
                <SideBar toggled={this.state.openSideBar} />
                {this.props.children}
            </div>
        )
    }
}

const mapStateToProps = (state) => {
  return {
    isAuthenticated: state.auth.isAuthenticated,
  }
}

export default connect(mapStateToProps, null)(App);


