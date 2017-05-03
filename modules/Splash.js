import React from 'react'
import { Link } from 'react-router'
import styles from '../public/css/splash.css'

export default class Splash extends React.Component {

    render () {
        return (
            <div className='landing'>
                <div className="page-wrapper">
                  <header className="alt header">
                    <h1><Link to="/">Bazaar</Link></h1>
                    <nav className="nav">
                      <ul>
                        <li className="special"><a href="#menu" className="menuToggle"><span>Menu</span></a>
                          <div className="menu">
                            <ul>
                              <li><Link to="/">Home</Link></li>
                              <li><Link to="/signup">Sign Up</Link></li>
                              <li><Link to="/login">Log In</Link></li>
                            </ul>
                          </div>
                        </li>
                      </ul>
                    </nav>
                  </header>
                  <section className="banner">
                    <div className="inner">
                      <h2>Bazaar</h2>
                      <p>HALLO, SALAM,<br />              HELLO, BONJOUR,<br />              MARHABA, OLÁ!</p>
                      <ul className="actions">
                        <li><Link to="/login" className="button special">SIGN IN</Link></li>
                      </ul>
                    </div><a href="#zero" className="more scrolly">Learn More</a>
                  </section>
                  <section className="zero wrapper style0 special">
                    <a href="https://www.startnext.com/shareonbazaar?utm_source=startnext&amp;utm_medium=extwidget&amp;utm_campaign=projectbutton&amp;utm_term=projectpromo" title="Share on Bazaar, unterstützen auf Startnext!" target="_blank" className="start-next">
                        <span>Support project</span>
                    </a>
                    <div className="inner">
                      <header className="major">
                        <h2>Bazaar is a place for empowerment<br />                </h2>
                        <p>We believe, locals and newcomers should share their skills and learn from each other.</p>
                      </header>
                      <iframe width="853" height="480" src="https://www.youtube.com/embed/uoVlosNJjZY?rel=0?ecver=1" frameBorder="0" allowFullScreen=""></iframe>
                    </div>
                  </section>
                  <section className="one wrapper style1 special">
                    <div className="inner">
                      <header className="major">
                        <h2>What skills can you share here? </h2>
                        <p>People offer cool things from leisure time activities to professional competences. Currently we have about thirty skills to choose from. </p>
                      </header><img width="75%" src="images/skills.png" />
                    </div>
                  </section>
                  <section className="two wrapper alt style2 special" style={{padding: '40px 0px'}}>
                    <div className="inner">
                      <header className="major">
                        <h2>Our vision</h2>
                        <p>Let‘s create a network where everyone can offer what they are good at.<br />We see huge potential in all the people coming to new countries at the moment.  Bazaar wants to enable them and provide a tool to participate in their new society </p>
                      </header><img width="75%" src="images/network.png" />
                    </div>
                  </section>
                  <section className="three wrapper style3">
                    <div className="inner">
                      <header className="major">
                        <h2>How does it work?</h2>
                        <p>We use time banking to make skills exchange fair and flexible.<br />Here is an example:</p>
                      </header>
                      <ol>
                        <li>Mustafa helps Anna fixing her bike, which takes one hour</li>
                        <li>Therefore, Anna pays Mustafa one Time-Coin.</li>
                        <li>With this Time-Coin, Mustafa can receive one hour of German lessons from Luigi, who is a cook.</li>
                        <li>That way, they not only exchange skills but learn about their backgrounds and cultural values. </li>
                      </ol><img style={{display:'block', margin:'0 auto', width: '75%'}} src="images/timebanking.png" />
                    </div>
                  </section>
                  <section className="cta wrapper style4" style={{padding: '12em 0 10em 0'}}>
                    <div className="inner">
                      <header>
                        <h2>Sound good?</h2>
                        <p>Let's get started! It's easy.</p>
                      </header>
                      <ul className="actions vertical">
                        <li><Link to="/signup" className="button fit special">Sign Up</Link></li>
                        <li><Link to="/login" className="button fit">Login</Link></li>
                      </ul>
                    </div>
                  </section>
                  <footer className="footer">
                    <h3>Our Team</h3>
                    <div className="team">
                      <div className="person"><img src="/images/nina.png" />
                        <p>Nina</p>
                      </div>
                      <div className="person"><img src="/images/thorben.png" />
                        <p>Thorben</p>
                      </div>
                      <div className="person"><img src="/images/omer.png" />
                        <p>Ömer</p>
                      </div>
                      <div className="person"><img src="/images/rory.png" />
                        <p>Rory</p>
                      </div>
                    </div>
                    <ul className="icons">
                      <li><a href="https://www.twitter.com/shareonbazaar" className="icon fa-twitter"><span className="label">Twitter</span></a></li>
                      <li><a href="https://www.facebook.com/shareonbazaar" className="icon fa-facebook"><span className="label">Facebook</span></a></li>
                      <li><a href="https://www.instagram.com/shareonbazaar/" className="icon fa-instagram"><span className="label">Instagram</span></a></li>
                      <li><Link to="/contact" className="icon fa-envelope-o"><span className="label">Email</span></Link></li>
                    </ul>
                    <ul className="copyright">
                      <li>© Bazaar</li>
                    </ul>
                  </footer>
                </div>
            </div>
        )
  }
}

