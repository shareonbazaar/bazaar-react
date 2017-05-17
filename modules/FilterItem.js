import { connect } from 'react-redux'
import React from 'react'
import { setVisibilityFilter } from '../utils/actions'

class FilterItem extends React.Component {

    render () {
        return (
          <div
            onClick={() => this.props.setVisibilityFilter(this.props.filter)}
            className={'exchange-type ' + (this.props.active ? 'selected' : '')}>
            {this.props.children}
          </div>
        )
    }
}

const mapStateToProps = (state, ownProps) => {
  return {
    active: ownProps.filter === state.transactions.filter
  }
}

export default connect(mapStateToProps, {setVisibilityFilter})(FilterItem);
