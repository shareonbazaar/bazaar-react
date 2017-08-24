import React from 'react';
import PropTypes from 'prop-types';

import { IndexLink } from 'react-router';
import { Navbar } from 'react-bootstrap';
import { connect } from 'react-redux';
import { Helmet } from 'react-helmet';

import { loadUsers } from '../../utils/actions';

import SideBar from '../SideBar/SideBar';
import QueryBox from '../QueryBox/QueryBox';

class App extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      openSideBar: false,
    };
  }

  render() {
    const { location, isAuthenticated, children } = this.props;
    const { openSideBar } = this.state;
    return (
      <div className="app">
        <Helmet>
          <meta name="viewport" content="width=device-width, initial-scale=1" />
        </Helmet>
        <Navbar fixedTop fluid>
          <IndexLink onClick={() => this.props.loadUsers()} to="/">
            <img alt="" width="20" src="/images/logo.png" />
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
            <span className="sr-only">Toggle navigation</span>
            <span className="icon-bar" />
            <span className="icon-bar" />
            <span className="icon-bar" />
          </button>
        </Navbar>
        <SideBar toggled={openSideBar} />
        {children}
      </div>
    );
  }
}

const mapStateToProps = state => ({
  isAuthenticated: state.auth.isAuthenticated,
});

App.propTypes = {
  location: PropTypes.object,
  isAuthenticated: PropTypes.bool,
  children: PropTypes.node,
  loadUsers: PropTypes.func,
};
App.defaultProps = {
  location: {},
  isAuthenticated: false,
  children: null,
  loadUsers: () => {}
};

export default connect(mapStateToProps, { loadUsers })(App);
