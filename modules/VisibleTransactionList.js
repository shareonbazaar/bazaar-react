import { connect } from 'react-redux'
import TransactionList from './TransactionList'
import { loadTransactions } from '../utils/actions'
import {StatusType} from '../models/Enums'

const getVisibleTransactions = (transactions, filter) => {
  switch (filter) {
    case 'PROPOSED':
      return transactions.filter(t => t.status === StatusType.PROPOSED)
    case 'UPCOMING':
      return transactions.filter(t => t.status === StatusType.ACCEPTED)
    case 'COMPLETE':
      return transactions.filter(t => t.status !== StatusType.PROPOSED && t.status !== StatusType.ACCEPTED)
    default:
      return [];
  }
}

const mapStateToProps = (state) => {
  return {
    transactions: getVisibleTransactions(state.transactions.items, state.transactions.filter),
    isFetching: state.transactions.isFetching,
    currUser: state.auth.user,
    useAnimation: state.transactions.useAnimation,
    toReview: state.transactions.toReview,
  }
}

const VisibleTransactionsList = connect(
  mapStateToProps,
  { loadTransactions }
)(TransactionList)

export default VisibleTransactionsList