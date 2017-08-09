import { connect } from 'react-redux';
import TransactionList from './TransactionList';
import { loadTransactions, updateProfile } from '../utils/actions';
import { StatusType } from '../models/Enums';


const getVisibleTransactions = (transactions, filter) => {
  switch (filter) {
    case 'PROPOSED':
      return transactions.filter(t => t.status === StatusType.PROPOSED);
    case 'UPCOMING':
      return transactions.filter(t => t.status === StatusType.ACCEPTED && t._confirmations.length === 0);
    case 'COMPLETE':
      return transactions.filter(t => t._confirmations.length > 0);
    default:
      return [];
  }
};

// TODO: NEED TO FIGURE OUT HOW TO WRITE AF CORRECTLY
// eslint-disable-next-line
const mapStateToProps = (state) => {
  return {
    transactions: getVisibleTransactions(state.transactions.items, state.transactions.filter),
    isFetching: state.transactions.isFetching,
    loggedInUser: state.auth.user,
    useAnimation: state.transactions.useAnimation,
    toReview: state.transactions.toReview,
  };
};

export default connect(mapStateToProps, { loadTransactions, updateProfile }) (TransactionList);
