import { connect } from 'react-redux';
import View from './View';
import { loadCategories, addSkill, deleteSkill } from '../../utils/actions';

function mapStateToProps({ skills, categories }) {
  return {
    skills: skills.items,
    categories: categories.items,
  };
}

export default connect(mapStateToProps, {
  loadCategories, addSkill, deleteSkill
})(View);
