import { connect } from 'react-redux';
import { defineMessages, injectIntl } from 'react-intl';
import CardGrid from '../CardGrid/CardGrid';
import { loadUsers, updateProfile } from '../../utils/actions';

const userSearchMessages = defineMessages({
  noUsersMessage: {
    id: 'UserSearch.noUsers',
    defaultMessage: 'No users found to match your search',
  }
});

const bookmarkMessages = defineMessages({
  noUsersMessage: {
    id: 'Bookmark.noUsers',
    defaultMessage: 'You have not bookmarked any users yet',
  }
});

export const Bookmarks = connect(state =>
  ({
    users: state.users.items.filter(u => state.auth.user.bookmarks.indexOf(u._id) >= 0),
    isFetching: state.isFetching,
    loggedInUser: state.auth.user,
    localizedMessages: bookmarkMessages,
  }),
{ loadUsers, updateProfile }
)(injectIntl(CardGrid));

export const UserSearch = connect(state =>
  ({
    users: state.users.items,
    isFetching: state.isFetching,
    loggedInUser: state.auth.user,
    localizedMessages: userSearchMessages,
  }),
{ loadUsers, updateProfile }
)(injectIntl(CardGrid));
