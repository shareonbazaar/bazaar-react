import React from 'react';
import ReactDOM from 'react-dom';
import { Link } from 'react-router';
import { Element } from 'react-scroll';
import { Link as ScrollLink } from 'react-scroll';

import { Helmet } from 'react-helmet';
import { FormattedMessage } from 'react-intl';
// eslint-disable-next-line
import styles from '../../public/css/splash.css';
import LinkedFooter from '../LinkedFooter/LinkedFooter';

export default class Splash extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      openSideBar: false,
      showHeader: false,
    };
    this.handleScroll = this.handleScroll.bind(this);
  }

  componentDidMount() {
    window.addEventListener('scroll', this.handleScroll);
  }

  componentWillUnmount() {
    window.removeEventListener('scroll', this.handleScroll);
  }

  /* eslint-disable */
  handleScroll(e) {
    const { showHeader } = this.state;
    (ReactDOM.findDOMNode(this.firstSection).getBoundingClientRect().top > 0) ?
    showHeader && this.setState({ showHeader: false })
    :
    !showHeader && this.setState({ showHeader: true })
  }
  /* eslint-enable */
  render() {
    const shouldAllowLogin = false;
    return (
      <div className="landing">
        <Helmet>
          <title>Share On Bazaar</title>
          <meta name="viewport" content="width=device-width, initial-scale=1" />
        </Helmet>
        <div className={`page-wrapper ${this.state.openSideBar ? 'menu-visible' : ''}`}>
          <header className={`header ${this.state.showHeader ? '' : 'alt'}`}>
            <h1><Link to="/">Bazaar</Link></h1>
            {shouldAllowLogin ?
              <nav className="nav">
                <ul>
                  <li className="special">
                    <a onClick={() => this.setState({ openSideBar: true })} className="menuToggle">
                      <span>
                        <FormattedMessage
                          id={'Splash.menu'}
                          defaultMessage={'Menu'}
                        />
                      </span>
                    </a>
                  </li>
                </ul>
              </nav>
              : null }
          </header>
          <section className="banner">
            <div className="inner">
              <h2>
                <div className="logo-image" />
                <div className="splash-title">
                  <p className="logo-top">share on</p>
                  <p className="logo-bottom">bazaar</p>
                </div>
              </h2>
              <p>HALLO, SALAM,<br />              HELLO, BONJOUR,<br />              MARHABA, OLÁ!</p>
              {shouldAllowLogin ?
                <ul className="actions">
                  <li>
                    <Link to="/login" className="button special">
                      <FormattedMessage
                        id={'Signup.login'}
                        defaultMessage={'Login'}
                      />
                    </Link>
                  </li>
                </ul>
                : null }
            </div>
            <ScrollLink className="more" to="zero" smooth duration={500}>
              <FormattedMessage
                id={'Splash.learn'}
                defaultMessage={'Learn More'}
              />
            </ScrollLink>
          </section>
          <Element name="zero" ref={(e) => { this.firstSection = e; }}>
            <section className="zero wrapper style0 special">
              <div className="inner">
                <header className="major">
                  <h2>
                    <FormattedMessage
                      id={'Splash.statement0'}
                      defaultMessage={'Bazaar is a place for empowerment'}
                    />
                    <br />
                  </h2>
                  <p>
                    <FormattedMessage
                      id={'Splash.statement1'}
                      defaultMessage={'We believe, locals and newcomers should share their skills and learn from each other.'}
                    />
                  </p>
                </header>
                {/* eslint-disable */}
                <iframe width="100%" height="480" src="https://www.youtube.com/embed/uoVlosNJjZY?rel=0?ecver=1" frameBorder="0" allowFullScreen="" />
                {/* eslint-enable */}
              </div>
            </section>
          </Element>
          <section className="one wrapper style1 special">
            <div className="inner">
              <header className="major">
                <h2>
                  <FormattedMessage
                    id={'Splash.skillq'}
                    defaultMessage={'What skills can you share here?'}
                  />
                </h2>
                <p>
                  <FormattedMessage
                    id={'Splash.skillsdesc'}
                    defaultMessage={'People offer cool things from leisure time activities to professional competences. Currently we have about thirty skills to choose from.'}
                  />
                </p>
              </header>
              <img alt="" width="75%" src="images/skills.png" />
            </div>
          </section>
          <section className="two wrapper alt style2 special" style={{ padding: '40px 0px' }}>
            <div className="inner">
              <header className="major">
                <h2>
                  <FormattedMessage
                    id={'Splash.vision'}
                    defaultMessage={'Our vision'}
                  />
                </h2>
                <p>
                  <FormattedMessage
                    id={'Splash.network'}
                    defaultMessage={'Let‘s create a network where everyone can offer what they are good at.'}
                  />
                  <br />
                  <FormattedMessage
                    id={'Splash.network2'}
                    defaultMessage={'We see huge potential in all the people coming to new countries at the moment.  Bazaar wants to enable them and provide a tool to participate in their new society'}
                  />
                </p>
              </header>
              <img alt="" width="75%" src="images/network.png" />
            </div>
          </section>
          <section className="three wrapper style3">
            <div className="inner">
              <header className="major">
                <h2>
                  <FormattedMessage
                    id={'Splash.how'}
                    defaultMessage={'How does it work?'}
                  />
                </h2>
                <p>
                  <FormattedMessage
                    id={'Splash.tb'}
                    defaultMessage={'We use time banking to make skills exchange fair and flexible.'}
                  />
                  <br />
                  <FormattedMessage
                    id={'Splash.example'}
                    defaultMessage={'Here is an example:'}
                  />
                </p>
              </header>
              <ol>
                <li>
                  <FormattedMessage
                    id={'Splash.example1'}
                    defaultMessage={'Mustafa helps Anna fixing her bike, which takes one hour'}
                  />
                </li>
                <li>
                  <FormattedMessage
                    id={'Splash.example2'}
                    defaultMessage={'Therefore, Anna pays Mustafa one Time-Coin.'}
                  />
                </li>
                <li>
                  <FormattedMessage
                    id={'Splash.example3'}
                    defaultMessage={'With this Time-Coin, Mustafa can receive one hour of German lessons from Luigi, who is a cook.'}
                  />
                </li>
                <li>
                  <FormattedMessage
                    id={'Splash.example4'}
                    defaultMessage={'That way, they not only exchange skills but learn about their backgrounds and cultural values.'}
                  />
                </li>
              </ol>
              <img alt="" style={{ display: 'block', margin: '0 auto', width: '75%' }} src="images/timebanking.png" />
            </div>
          </section>
          <section className="cta wrapper style4" style={{ padding: '12em 0 10em 0' }}>
            { shouldAllowLogin ?
              <div className="inner">
                <header>
                  <h2>
                    <FormattedMessage
                      id={'Splash.start1'}
                      defaultMessage={'Sound good?'}
                    />
                  </h2>
                  <p>
                    <FormattedMessage
                      id={'Splash.start2'}
                      defaultMessage={"Let's get started! It's easy."}
                    />
                  </p>
                </header>
                <ul className="actions vertical">
                  <li>
                    <Link to="/onboarding" className="button fit special">
                      <FormattedMessage
                        id={'Signup.signup'}
                        defaultMessage={'Sign up'}
                      />
                    </Link>
                  </li>
                  <li>
                    <Link to="/login" className="button fit">
                      <FormattedMessage
                        id={'Signup.login'}
                        defaultMessage={'Login'}
                      />
                    </Link>
                  </li>
                </ul>
              </div>
              : null }
          </section>
          <footer className="footer">
            <ul className="icons">
              <li><a href="https://www.twitter.com/shareonbazaar" className="icon fa-twitter"><span className="label">Twitter</span></a></li>
              <li><a href="https://www.facebook.com/shareonbazaar" className="icon fa-facebook"><span className="label">Facebook</span></a></li>
              <li><a href="https://www.instagram.com/shareonbazaar/" className="icon fa-instagram"><span className="label">Instagram</span></a></li>
              <li><Link to="/contact" className="icon fa-envelope-o"><span className="label">Email</span></Link></li>
            </ul>
            <ul className="copyright">
              <li>© Bazaar</li>
            </ul>
            <LinkedFooter />
          </footer>
        </div>
        <div className={`menu ${this.state.openSideBar ? 'toggled' : ''}`}>
          <ul>
            <li>
              <Link to="/">
                <FormattedMessage
                  id={'Splash.menuhome'}
                  defaultMessage={'Home'}
                />
              </Link>
            </li>
            <li>
              <Link to="/onboarding">
                <FormattedMessage
                  id={'Signup.signup'}
                  defaultMessage={'Sign up'}
                />
              </Link>
            </li>
            <li>
              <Link to="/login">
                <FormattedMessage
                  id={'Signup.login'}
                  defaultMessage={'Login'}
                />
              </Link>
            </li>
          </ul>
          <a onClick={() => this.setState({ openSideBar: false })} className="menu-close" />
        </div>
        <ScrollLink className="more" to="zero" smooth duration={500}>Learn More</ScrollLink>
      </div>
    );
  }
}
