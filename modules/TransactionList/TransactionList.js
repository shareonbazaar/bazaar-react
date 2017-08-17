import React from 'react';
import PropTypes from 'prop-types';
import { TransitionMotion, spring } from 'react-motion';

import Transaction from '../Transaction/Transaction';
import FilterBar from '../FilterBar/FilterBar';
import Loader from '../Loader/Loader';

class TransactionList extends React.Component {
  // constructor(props) {
  //   super(props);
  // }

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

TransactionList.defaultProps = {
  loggedInUser: null,
  isFetching: false,
  useAnimation: false,
  transactions: [],
  loadTransactions: () => {},
  loadProfile: () => {},
  updateProfile: () => {},
};

TransactionList.propTypes = {
  loggedInUser: PropTypes.object,
  isFetching: PropTypes.bool,
  useAnimation: PropTypes.bool,
  transactions: PropTypes.array,
  loadTransactions: PropTypes.func,
  loadProfile: PropTypes.func,
  updateProfile: PropTypes.func,
};


export default TransactionList;
