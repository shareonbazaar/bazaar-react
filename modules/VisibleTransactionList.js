import { connect } from 'react-redux'
import { toggleTodo } from '../actions'
import TransactionList from './TransactionList'

const getVisibleTransactions = (transactions, filter) => {
  switch (filter) {
    case 'SHOW_ALL':
      return transactions
    case 'SHOW_COMPLETED':
      return transactions.filter(t => t.completed)
    case 'SHOW_ACTIVE':
      return transactions.filter(t => !t.completed)
  }
}

const mapStateToProps = (state) => {
  return {
    transactions: getVisibleTransactions(state.transactions, state.visibilityFilter)
  }
}

const mapDispatchToProps = (dispatch) => {
  return {
    onTodoClick: (id) => {
      dispatch(toggleTodo(id))
    }
  }
}

const VisibleTransactionsList = connect(
  mapStateToProps,
  mapDispatchToProps
)(TodoList)

export default VisibleTransactionsList