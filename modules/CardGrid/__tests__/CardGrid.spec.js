import React from 'react';
import { shallow } from 'enzyme';

import CardGrid from '../../CardGrid/CardGrid';
import UserCard from '../../UserCard/UserCard';

const getCardGrid = (props = {}) => shallow(<CardGrid {...props} />);
const loadingDiv = <div>Loading...</div>;


const user = {
  aboutMe: '',
  gender: '',
  hometown: '',
  location: '',
  name: 'foobar',
  picture: '',
  reviews: [],
  skills: [],
  status: '',
  _id: 'foobar',
};
const user2 = {
  aboutMe: '',
  gender: '',
  hometown: '',
  location: '',
  name: 'barfoo',
  picture: '',
  reviews: [],
  skills: [],
  status: '',
  _id: 'barfoo',
};

// still TODO: test the UserCard rendering, loading screen renders
const users = [user, user2];
const userCard = <UserCard key={user._id} user={user} bookmarked={false} />;

describe('<CardGrid />', () => {
  const mounted = getCardGrid();
  // mounted.setProps({ users });
  // it('does not render Loading <div>, renders userCard', () => {
  //   expect(mounted.contains(userCard));
  // });
  mounted.setProps({ isFetching: true });
  it('renders Loading <div> when isFetching = true', () => {
    expect(mounted.contains(loadingDiv));
  });
  mounted.setProps({ isFetching: false, users: [] });
  it('renders Loading <div> when users-array is empty', () => {
    expect(mounted.contains(loadingDiv));
  });
});
