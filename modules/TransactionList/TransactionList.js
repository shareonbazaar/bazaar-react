import React from 'react';
import PropTypes from 'prop-types';
import { TransitionMotion, spring } from 'react-motion';
import { Link } from 'react-router';

import Transaction from '../Transaction/Transaction';
import FilterBar from '../FilterBar/FilterBar';
import Loader from '../Loader/Loader';

class TransactionList extends React.Component {
  componentDidMount() {
    this.props.loadTransactions();

    // Clear unreadTransactions array since now user is seeing them
    const form = new FormData();
    form.append('unreadTransactions', '');
    this.props.updateProfile(form);
  }

  renderInterpolatedStyles(config) {
    const { loggedInUser } = this.props;
    const { style, data, key } = config;
    return (
      <div key={key} style={{ transform: `translate(${style.transform}%)` }}>
        <Transaction
          loggedInUser={loggedInUser}
          content={data}
        />
      </div>
    );
  }

  renderTransactions() {
    const { useAnimation, transactions } = this.props;
    return (
      <TransitionMotion
        willLeave={() => (useAnimation ? { transform: spring(100) } : null)}
        styles={transactions.map(transaction => ({
          key: transaction._id,
          style: { transform: 0 },
          data: transaction
        }))}
      >
        {interpolatedStyles =>
          (<div style={{ overflow: 'hidden' }}>
            {interpolatedStyles.map(config => this.renderInterpolatedStyles(config))}
          </div>)
        }
      </TransitionMotion>
    );
  }

  renderEmptyPage() {
    return (
      <div className="empty-transaction-list">
        <p>Looks like there's nothing here.</p>
        <p>Visit the <Link to={'/'}>user search page</Link> to find new users and set up exchanges</p>
      </div>
    );
  }

  render() {
    const { isFetching, transactions } = this.props;
    return (
      <div className="responsive-margins">
        <FilterBar />
        {(isFetching && <Loader />)}
        {
          transactions.length > 0 ? this.renderTransactions() : this.renderEmptyPage()
        }
      </div>
    );
  }
}

TransactionList.defaultProps = {
  loggedInUser: null,
  isFetching: false,
  useAnimation: false,
  transactions: [],
  loadTransactions: () => {},
  updateProfile: () => {},
};

TransactionList.propTypes = {
  loggedInUser: PropTypes.object,
  isFetching: PropTypes.bool,
  useAnimation: PropTypes.bool,
  transactions: PropTypes.array,
  loadTransactions: PropTypes.func,
  updateProfile: PropTypes.func,
};


export default TransactionList;
