import React from 'react';
import PropTypes from 'prop-types';

import { IndexLink } from 'react-router';
import { Navbar } from 'react-bootstrap';
import { connect } from 'react-redux';
import { Helmet } from 'react-helmet';

import { loadUsers, selectStage } from '../../utils/actions';

import SideBar from '../SideBar/SideBar';
import QueryBox from '../QueryBox/QueryBox';
import ProgressButtons from '../Onboarding/ProgressButtons';

class App extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      openSideBar: false,
    };
  }

  topBarComponent() {
    const { location, isAuthenticated, stage } = this.props;
    if (isAuthenticated && location.pathname === '/') {
      return <QueryBox />;
    } else if (location.pathname === '/onboarding') {
      return (
        <ProgressButtons
          canGoForward={stage < 2}
          canGoBack={stage > 0}
          onForward={() => this.props.selectStage(stage + 1)}
          onBack={() => this.props.selectStage(stage - 1)}
        />
      );
    }
    return null;
  }

  render() {
    const { children } = this.props;
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
            this.topBarComponent()
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
  stage: state.onboarding.stage,
});

App.propTypes = {
  location: PropTypes.object,
  isAuthenticated: PropTypes.bool,
  children: PropTypes.node,
  loadUsers: PropTypes.func,
  selectStage: PropTypes.func,
  stage: PropTypes.number,
};
App.defaultProps = {
  location: {},
  isAuthenticated: false,
  children: null,
  loadUsers: () => {},
  selectStage: () => {},
  stage: 0,
};

export default connect(mapStateToProps, { loadUsers, selectStage })(App);
