import React from 'react';
import FilterItem from './FilterItem';

// Potentially this component unnecessary and just stick all three in TransactionList
const FilterBar = () => (
  <div className="filter-bar">
    <FilterItem filter="PROPOSED">Proposed</FilterItem>
    <FilterItem filter="UPCOMING">Upcoming</FilterItem>
    <FilterItem filter="COMPLETE">Complete</FilterItem>
  </div>
);

export default FilterBar;
