import { connect } from 'react-redux'
import React from 'react'
import { setVisibilityFilter } from '../utils/actions'

class FilterItem extends React.Component {

    render () {
        return (
          <div onClick={() => this.props.onClick()} className={'exchange-type ' + (this.props.active ? 'selected' : '')}>{this.props.children}</div>
        )
    }
}

const mapStateToProps = (state, ownProps) => {
  return {
    active: ownProps.filter === state.transactions.filter
  }
}

const mapDispatchToProps = (dispatch, ownProps) => {
  return {
    onClick: () => {
      dispatch(setVisibilityFilter(ownProps.filter))
    }
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(FilterItem);
