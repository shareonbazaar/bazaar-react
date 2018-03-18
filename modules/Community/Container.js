import { connect } from 'react-redux';
import View from './View';
import { loadEvents, loadUsers } from '../../utils/actions';

function mapStateToProps({ events, users }) {
  return {
    events: events.items,
    users: users.items,
  };
}

export default connect(mapStateToProps, { loadEvents, loadUsers })(View);
