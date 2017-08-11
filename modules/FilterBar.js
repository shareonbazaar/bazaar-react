import React from 'react';
import { FormattedMessage } from 'react-intl';
import FilterItem from './FilterItem';

// Potentially this component unnecessary and just stick all three in TransactionList
const FilterBar = () => (
  <div className="filter-bar">
    <FilterItem filter="PROPOSED">
      <FormattedMessage
        id={'FilterBar.proposed'}
        defaultMessage={'Proposed'}
      />
    </FilterItem>
    <FilterItem filter="UPCOMING">
      <FormattedMessage
        id={'FilterBar.upcoming'}
        defaultMessage={'Upcoming'}
      />
    </FilterItem>
    <FilterItem filter="COMPLETE">
      <FormattedMessage
        id={'FilterBar.complete'}
        defaultMessage={'Complete'}
      />
    </FilterItem>
  </div>
);

export default FilterBar;
