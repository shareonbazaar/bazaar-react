import React from 'react';
import PropTypes from 'prop-types';
import { StyleRoot } from 'radium';

import { IndexLink } from 'react-router';
import { Navbar } from 'react-bootstrap';
import { connect } from 'react-redux';
import { Helmet } from 'react-helmet';
import LinkedFooter from '../LinkedFooter/LinkedFooter';
import { loadUsers, selectStage } from '../../utils/actions';

import SideBar from '../SideBar/SideBar';
import Loader from '../Loader/Loader';
import QueryBox from '../QueryBox/QueryBox';
import ProgressButtons from '../Onboarding/ProgressButtons';
import { BAZAAR_GREY } from '../Layout/Styles';

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
    const { children, isFetching } = this.props;
    const { openSideBar } = this.state;
    return (
      <StyleRoot>
        <div className="app">
          <Helmet>
            <meta name="viewport" content="width=device-width, initial-scale=1, maximum-scale=1, user-scalable=0" />
          </Helmet>
          <Navbar style={{ background: BAZAAR_GREY }} fixedTop fluid>
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
              type="button"
              style={{
                display: 'inline-block',
                marginRight: '0px',
                border: 'none',
                float: 'right',
                padding: '9px 10px',
                marginTop: '8px',
                background: 'transparent',
                outline: 'none',
              }}
            >
              {
                Array(3).fill(0).map((v, i) =>
                  (
                    <span
                      key={i}
                      style={{
                        backgroundColor: 'white',
                        display: 'block',
                        width: '22px',
                        height: '2px',
                        borderRadius: '1px',
                        marginTop: i > 0 ? '4px' : '0px',
                      }}
                    />
                  )
                )
              }
            </button>
          </Navbar>
          <SideBar toggled={openSideBar} />
          <div style={{ minHeight: '100vh' }}>
            {(isFetching && <Loader />)}
            {children}
          </div>
          <LinkedFooter />
        </div>
      </StyleRoot>
    );
  }
}

const mapStateToProps = state => ({
  isAuthenticated: state.auth.isAuthenticated,
  isFetching: state.auth.isFetching,
  stage: state.onboarding.stage,
  skills: state.onboarding.skills,
  interests: state.onboarding.interests,
});

App.propTypes = {
  location: PropTypes.object,
  isAuthenticated: PropTypes.bool,
  isFetching: PropTypes.bool,
  children: PropTypes.node,
  loadUsers: PropTypes.func.isRequired,
  selectStage: PropTypes.func.isRequired,
  stage: PropTypes.number,
  skills: PropTypes.array,
  interests: PropTypes.array,
};
App.defaultProps = {
  location: {},
  isAuthenticated: false,
  isFetching: false,
  children: null,
  stage: 0,
  skills: [],
  interests: [],
};

export default connect(mapStateToProps, { loadUsers, selectStage })(App);
