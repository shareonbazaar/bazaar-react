import { connect } from 'react-redux';
import CardGrid from './CardGrid';
import { loadUsers, updateProfile } from '../utils/actions';

export const Bookmarks = connect(state =>
  ({
    users: state.users.items.filter(u => state.auth.user.bookmarks.indexOf(u._id) >= 0),
    isFetching: state.isFetching,
    loggedInUser: state.auth.user,
  }),
{ loadUsers, updateProfile }
)(CardGrid);

export const Community = connect(state =>
  ({
    users: state.users.items,
    isFetching: state.isFetching,
    loggedInUser: state.auth.user,
  }),
{ loadUsers, updateProfile }
)(CardGrid);
