import { connect } from 'react-redux';
import React from 'react';
import PropTypes from 'prop-types';
import { StatusType } from '../models/Enums';

import { setVisibilityFilter } from '../utils/actions';

class FilterItem extends React.Component {
  render() {
    const { filter, active, children } = this.props;
    const exchangeType = 'exchange-type';
    return (
      <div
        onClick={() => this.props.setVisibilityFilter(filter)}
        className={exchangeType + (active ? ' selected' : '')}
      >
        {children}
      </div>
    );
  }
}
FilterItem.propTypes = {
  filter: PropTypes.string,
  active: PropTypes.bool,
  children: PropTypes.node,
  setVisibilityFilter: PropTypes.func,
};

FilterItem.defaultProps = {
  filter: StatusType.PROPOSED,
  active: false,
  children: null,
  setVisibilityFilter: () => {},
};

const mapStateToProps = (state, ownProps) => ({
  active: ownProps.filter === state.transactions.filter
});

export default connect(mapStateToProps, { setVisibilityFilter })(FilterItem);
