import React from 'react';
import PropTypes from 'prop-types';

import { IndexLink } from 'react-router';
import { Navbar } from 'react-bootstrap';
import { connect } from 'react-redux';
import { Helmet } from 'react-helmet';
import LinkedFooter from '../LinkedFooter/LinkedFooter';
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
    const { location, isAuthenticated, stage, skills, interests } = this.props;
    let canGoForward = false;
    if (stage === 0) {
      canGoForward = interests.length >= 2;
    } else if (stage === 1) {
      canGoForward = skills.length >= 2;
    }
    if (isAuthenticated && location.pathname === '/') {
      return <QueryBox />;
    } else if (location.pathname === '/onboarding') {
      return (
        <ProgressButtons
          canGoForward={canGoForward}
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
          <meta name="viewport" content="width=device-width, initial-scale=1, maximum-scale=1, user-scalable=0" />
        </Helmet>
        <Navbar fixedTop fluid>
          {
            location.pathname !== '/onboarding' &&
            <IndexLink onClick={() => this.props.loadUsers()} to="/">
              <img alt="" width="20" src="/images/logo.png" />
              <span className="brand-title">Bazaar</span>
            </IndexLink>
          }
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
        <div style={{ minHeight: '100vh' }}>
          {children}
        </div>
        <LinkedFooter />
      </div>
    );
  }
}

const mapStateToProps = state => ({
  isAuthenticated: state.auth.isAuthenticated,
  stage: state.onboarding.stage,
  skills: state.onboarding.skills,
  interests: state.onboarding.interests,
});

App.propTypes = {
  location: PropTypes.object,
  isAuthenticated: PropTypes.bool,
  children: PropTypes.node,
  loadUsers: PropTypes.func,
  selectStage: PropTypes.func,
  stage: PropTypes.number,
  skills: PropTypes.array,
  interests: PropTypes.array,
};
App.defaultProps = {
  location: {},
  isAuthenticated: false,
  children: null,
  loadUsers: () => {},
  selectStage: () => {},
  stage: 0,
  skills: [],
  interests: [],
};

export default connect(mapStateToProps, { loadUsers, selectStage })(App);
