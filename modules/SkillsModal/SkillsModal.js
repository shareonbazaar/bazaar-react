import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { Button, Modal } from 'react-bootstrap';
import { FormattedMessage } from 'react-intl';

import { loadCategories } from '../../utils/actions';


class SkillsModal extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      showModal: false,
    };
  }

  componentDidMount() {
    loadCategories();
  }

  render() {
    const { categories, skills, title, onSkillClick } = this.props;
    console.log(skills);
    const { showModal } = this.state;
    return (
      <div>
        <Modal show={showModal} onHide={() => this.setState({ showModal: false })}>
          <Modal.Header closeButton>
            <Modal.Title>
              <FormattedMessage
                id={'SkillsModal.title'}
                defaultMessage={'Select {title}'}
                values={{ title }}
              />
            </Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <div>
              {
                // eslint-disable-next-line
                categories.map((cat) => {
                  return (
                    <div className="skill-select" key={cat._id}>
                      <h4>{cat.label.en}</h4>
                      { // eslint-disable-next-line
                        cat._skills.map((skill) => {
                          return (
                            <div
                              key={skill._id}
                              onClick={() => onSkillClick(skill)}
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
          </Modal.Body>
          <Modal.Footer>
            <Button bsStyle="primary" onClick={() => this.setState({ showModal: false })}>
              <FormattedMessage
                id={'SkillsModal.done'}
                defaultMessage={'Done'}
              />
            </Button>
          </Modal.Footer>
        </Modal>
        <Button
          onClick={() => this.setState({ showModal: true })}
          bsStyle="primary"
        >
          <FormattedMessage
            id={'SkillsModal.edit'}
            defaultMessage={'Edit {title}'}
            values={{ title }}
          />
        </Button>
      </div>
    );
  }
}

SkillsModal.propTypes = {
  loadCategories: PropTypes.func,
  title: PropTypes.string,
  categories: PropTypes.array,
  onSkillClick: PropTypes.func,
  skills: PropTypes.array,
};

SkillsModal.defaultProps = {
  loadCategories: () => {},
  title: '',
  categories: [],
  onSkillClick: () => {},
  skills: [],
};

function mapStateToProps(state) {
  return {
    categories: state.categories.items,
  };
}

export default connect(mapStateToProps, { loadCategories })(SkillsModal);
