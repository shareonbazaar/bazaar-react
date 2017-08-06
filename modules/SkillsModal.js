import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { Button, Modal } from 'react-bootstrap';
import { loadCategories } from '../utils/actions';


class SkillsModal extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      showModal: false,
    };
  }

  componentDidMount() {
    this.props.loadCategories();
  }

  render() {
    const { categories, skills, title } = this.props;
    return (
      /* eslint-disable */
      <div>
        <Modal show={this.state.showModal} onHide={() => this.setState({ showModal: false })}>
          <Modal.Header closeButton>
            <Modal.Title>Select {title}</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <div>
              {
                categories.map((cat) => {
                  return (
                    <div className="skill-select" key={cat._id}>
                      <h4>{cat.label.en}</h4>
                      {cat._skills.map((skill) => {
                        return (
                          <div
                            key={skill._id}
                            onClick={() => this.props.onSkillClick(skill)}
                            className={`skill-label ${skills.indexOf(skill._id) >= 0 ? 'selected' : ''}`}
                          >
                            {skill.label.en}
                          </div>
                        );
                      })}
                    </div>
                  );
                })
              }
            </div>
            {/* eslint-enable */}
          </Modal.Body>
          <Modal.Footer>
            <Button bsStyle="primary" onClick={() => this.setState({ showModal: false })}>Done</Button>
          </Modal.Footer>
        </Modal>
        <Button
          onClick={() => this.setState({ showModal: true })}
          bsStyle="primary"
        >
          Edit {title}
        </Button>
      </div>
    );
  }
}
SkillsModal.propTypes = {
  loadCategories: PropTypes.func,
  title: PropTypes.string,
  categories: PropTypes.node,
  onSkillClick: PropTypes.func,
  skills: PropTypes.node,
};

SkillsModal.defaultProps = {
  loadCategories: () => {},
  title: '',
  categories: null,
  onSkillClick: () => {},
  skills: null,
};
// These props come from the application's
// state when it is started
// function mapStateToProps(state, ownProps) {
function mapStateToProps(state) {
  return {
    categories: state.categories.items,
  };
}

export default connect(mapStateToProps, { loadCategories })(SkillsModal);
