import { connect } from 'react-redux';
import View from './View';
import { loadEvents } from '../../utils/actions';

function mapStateToProps({ events }) {
  return {
    events: events.items,
  };
}

export default connect(mapStateToProps, { loadEvents })(View);
