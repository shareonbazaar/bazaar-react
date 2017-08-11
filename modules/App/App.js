import React from 'react';
import PropTypes from 'prop-types';

import { IndexLink } from 'react-router';
import { Navbar } from 'react-bootstrap';
import { connect } from 'react-redux';
import { Helmet } from 'react-helmet';
import Joyride from 'react-joyride';

import { loadUsers } from '../../utils/actions';

import SideBar from '../SideBar/SideBar';
import QueryBox from '../QueryBox/QueryBox';

class App extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      openSideBar: false,
      running: false,
      step: 0,
      autoStart: false,
      steps: [
        {
          title: 'Title only steps — As they say: Make the font bigger!',
          textAlign: 'center',
          selector: '.profile-pic',
          position: 'bottom'
        },
        {
          title: 'Our Mission',
          text: 'Can be advanced by clicking an element through the overlay hole.',
          selector: '.navbar-toggle',
          position: 'bottom',
          allowClicksThruHole: true,
          style: {
            beacon: {
              offsetY: 20
            },
            button: {
              display: 'none',
            }
          }
        },
      ]
    }
    this.handleClickStart = this.handleClickStart.bind(this);
    this.handleJoyrideCallback = this.handleJoyrideCallback.bind(this);
  }

  handleClickStart(e) {
    e.preventDefault();

    this.setState({
      running: true,
      step: 0,
    });
  }

  handleJoyrideCallback(result) {
    if (result.type === 'step:before') {
      // Keep internal state in sync with joyride
      this.setState({ step: result.index });
    }

    if (result.type === 'finished' && this.state.running) {
      // Need to set our running state to false, so we can restart if we click start again.
      this.setState({ running: false });
    }

    if (result.type === 'error:target_not_found') {
      this.setState({
        step: result.action === 'back' ? result.index - 1 : result.index + 1,
        autoStart: result.action !== 'close' && result.action !== 'esc',
      });
    }
  }

  render() {
    const { joyrideSteps, joyrideRunning, joyrideStepIndex  } = this.props;
    console.log("STEP INDEX " + this.state.step);
    return (
      <div className="app" onClick={this.handleClickStart}>
        <Joyride
          ref={c => (this.joyride = c)}
          steps={joyrideSteps}
          run={joyrideRunning}
          stepIndex={joyrideStepIndex}
          debug={true}
          callback={this.handleJoyrideCallback}
          scrollToFirstStep={true}
          type={'continuous'}
        />
        <Helmet>
          <meta name="viewport" content="width=device-width, initial-scale=1" />
        </Helmet>
        <Navbar fixedTop fluid>
          <IndexLink onClick={() => this.props.loadUsers()} to="/">
            <img alt="" width="20" src="/images/logo.png" />
            <span className="brand-title">Bazaar</span>
          </IndexLink>
          {
            this.props.location.pathname === '/'
            && this.props.isAuthenticated
            && <QueryBox />
          }
          <button
            onClick={() => this.setState({ openSideBar: !this.state.openSideBar })}
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
        <SideBar toggled={this.state.openSideBar} />
        {this.props.children}
      </div>
    );
  }
}

const mapStateToProps = state => ({
  isAuthenticated: state.auth.isAuthenticated,
  joyrideSteps: state.joyride.steps,
  joyrideRunning: state.joyride.running,
  joyrideStepIndex: state.joyride.stepIndex,
});

App.propTypes = {
  location: PropTypes.object,
  isAuthenticated: PropTypes.bool,
  children: PropTypes.node,
  loadUsers: PropTypes.func,
  joyrideSteps: PropTypes.array,
  joyrideRunning: PropTypes.bool,
  joyrideStepIndex: PropTypes.number,
};
App.defaultProps = {
  location: {},
  isAuthenticated: false,
  children: null,
  loadUsers: () => {}
  joyrideSteps: [],
  joyrideRunning: false,
  joyrideStepIndex: 0,
};

export default connect(mapStateToProps, { loadUsers })(App);
