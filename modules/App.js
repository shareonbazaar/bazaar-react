import React from 'react';
import { Link } from 'react-router';
import { IndexLink } from 'react-router';
import { Navbar } from 'react-bootstrap';
import { connect } from 'react-redux';
import SideBar from './SideBar';
import PropTypes from 'prop-types';
import QueryBox from './QueryBox';

class App extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      openSideBar: false,
    };
  }

  render() {
    const { openSideBar } = this.state;
    const { location, isAuthenticated, children } = this.props;
    return (
      <div className="app">
        <Navbar fixedTop fluid>
          <IndexLink to="/">
            <img width="20" src="/images/logo.png" alt="" />
            <span className="brand-title">Bazaar</span>
          </IndexLink>
          {
            location.pathname === '/'
            && isAuthenticated
            && <QueryBox />
          }
          <button
            onClick={() => this.setState({ openSideBar: !openSideBar })}
            id="menu-toggle"
            type="button"
            className="navbar-toggle"
          >
            <span className='sr-only'>Toggle navigation</span>
            <span className='icon-bar'></span>
            <span className='icon-bar'></span>
            <span className='icon-bar'></span>
          </button>
        </Navbar>
        <SideBar toggled={openSideBar} />
        {children}
      </div>
    );
  }
}

const mapStateToProps = (state) => ({
  return {
    isAuthenticated: state.auth.isAuthenticated,
  });
}

App.propTypes = {
  location: PropTypes.node,
  isAuthenticated: PropTypes.bool,
  children: PropTypes.node,
}
export default connect(mapStateToProps, null)(App);
