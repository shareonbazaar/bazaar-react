import React from 'react';
import PropTypes from 'prop-types';

import { IndexLink } from 'react-router';
import { Navbar } from 'react-bootstrap';
import { connect } from 'react-redux';
import { Helmet } from "react-helmet";

import { loadUsers } from '../utils/actions';

import SideBar from './SideBar';
import QueryBox from './QueryBox';

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
        <Helmet>
          <meta name="viewport" content="width=device-width, initial-scale=1" />
        </Helmet>
        <Navbar fixedTop={true} fluid={true}>
          <IndexLink onClick={() => this.props.loadUsers()} to='/'>
            <img width='20' src='/images/logo.png' />
            <span className='brand-title'>Bazaar</span>
          </IndexLink>
          {
            this.props.location.pathname === '/'
            && this.props.isAuthenticated
            && <QueryBox />
          }
          <button
            onClick={() => this.setState({openSideBar: !this.state.openSideBar})}
            id='menu-toggle'
            type='button'
            className='navbar-toggle'
          >
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

const mapStateToProps = state => ({
  isAuthenticated: state.auth.isAuthenticated,
});

App.propTypes = {
  location: PropTypes.object,
  isAuthenticated: PropTypes.bool,
  children: PropTypes.node,
};
App.defaultProps = {
  location: {},
  isAuthenticated: false,
  children: null,
};

export default connect(mapStateToProps, { loadUsers })(App);
