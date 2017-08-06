import React from 'react';
import PropTypes from 'prop-types';
import { TransitionMotion, spring } from 'react-motion';

import Transaction from './Transaction'
import FilterBar from './FilterBar'
import Loader from './Loader';

class TransactionList extends React.Component {
  constructor(props) {
    super(props);
  }

  componentDidMount () {
    this.props.loadTransactions();

    // Clear unreadTransactions array since now user is seeing them
    let form = new FormData();
    form.append('unreadTransactions', '');
    this.props.updateProfile(form);
  }
  
  renderInterpolatedStyles(config) {
    return (
      <div key={config.key} style={{ transform: `translate(${config.style.transform}%)` }}>
        <Transaction
          loggedInUser={this.props.loggedInUser}
          content={config.data}
        />
      </div>
    );
  }

  render() {
    return (
      <div className="responsive-margins">
        <FilterBar />
        {(this.props.isFetching && <Loader />)}
        <TransitionMotion
          willLeave={() => (this.props.useAnimation ? { transform: spring(100) } : null)}
          styles={this.props.transactions.map(transaction => ({
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
      </div>
    );
  }
}

TransactionList.propTypes = {
  loggedInUser: PropTypes.object,
  isFetching: PropTypes.bool,
  useAnimation: PropTypes.bool,
  transactions: PropTypes.array,
  loadTransactions: PropTypes.func,
};

Transaction.defaultProps = {
  loggedInUser: {},
  isFetching: false,
  useAnimation: false,
  transactions: [],
  loadTransactions: () => {},
};

export default TransactionList;
