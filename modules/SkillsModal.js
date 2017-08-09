import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { Button, Modal } from 'react-bootstrap';

import { loadCategories } from '../utils/actions'
import { FormattedMessage } from 'react-intl';


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
      <div>
        <Modal show={this.state.showModal} onHide={() => this.setState({showModal: false})}>
          <Modal.Header closeButton>
            <Modal.Title>
              <FormattedMessage
                id={'SkillsModal.title'}
                defaultMessage={'Select {title}'}
                values={{title: this.props.title}}
              />
            </Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <div>
              {
                this.props.categories.map((cat) => {
                  return (
                    <div className='skill-select' key={cat._id}>
                      <h4>{cat.label.en}</h4>
                      {cat._skills.map((skill) => {
                        return (
                          <div 
                            key={skill._id}
                            onClick={() => this.props.onSkillClick(skill)}
                            className={`skill-label ${this.props.skills.indexOf(skill._id) >= 0 ? 'selected' : ''}`}>
                            {skill.label.en}
                          </div>
                        )
                      })}
                    </div>
                  )
                })
              }
            </div>
          </Modal.Body>
          <Modal.Footer>
            <Button bsStyle='primary' onClick={() => this.setState({showModal: false})}>
              <FormattedMessage
                id={'SkillsModal.done'}
                defaultMessage={'Done'}
              />
            </Button>
          </Modal.Footer>
        </Modal>
        <Button 
          onClick={() => this.setState({showModal: true})}
          bsStyle="primary">
            <FormattedMessage
              id={'SkillsModal.edit'}
              defaultMessage={'Edit {title}'}
              values={{title: this.props.title}}
            />
        </Button>
      </div>
    )
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
