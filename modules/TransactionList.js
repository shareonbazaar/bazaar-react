import React from 'react';
import PropTypes from 'prop-types';
import { Button, Modal, Grid, Row, Col } from 'react-bootstrap';
import { TransitionMotion, spring } from 'react-motion';
import Transaction from './Transaction'
import FilterBar from './FilterBar'
import Loader from './Loader';

class TransactionList extends React.Component {
  constructor(props) {
    super(props);
  }

  componentDidMount() {
    this.props.loadTransactions();
  }

  renderInterpolatedStyles(config) {
    return (
      <div key={config.key} style={{ transform: `translate(${config.style.transform}%)` }}>
        <Transaction
          user={this.props.currUser}
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
  currUser: PropTypes.node,
  isFetching: PropTypes.bool,
  useAnimation: PropTypes.bool,
  transactions: PropTypes.node,
  loadTransactions: PropTypes.func,
};

Transaction.defaultProps = {
  currUser: null,
  isFetching: false,
  useAnimation: false,
  transactions: null,
  loadTransactions: () => {},
};

export default TransactionList;
