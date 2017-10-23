import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { Button, Modal } from 'react-bootstrap';
import { FormattedMessage } from 'react-intl';

import { loadCategories, onboardingSearch } from '../../utils/actions';

import SelectSkills from '../Onboarding/SelectSkills';
import ActionButton from '../Actions/ActionButton';

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
    const { categories, skills, title, onSkillClick } = this.props;
    const { showModal } = this.state;
    return (
      <div>
        <Modal show={showModal} onHide={() => this.setState({ showModal: false })}>
          <Modal.Header closeButton>
            <Modal.Title>
              { title }
            </Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <div>
              <SelectSkills
                skills={skills}
                onSkillSelect={s => onSkillClick(s)}
                onSkillRemove={s => onSkillClick(s)}
                categories={categories}
                {...this.props}
              />
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
        <ActionButton
          block
          style={{ fontSize: '11px', padding: '8px 15px' }}
          onClick={() => this.setState({ showModal: true })}
        >
          <FormattedMessage
            id={'SkillsModal.edit'}
            defaultMessage={'Add more skills'}
          />
        </ActionButton>
      </div>
    );
  }
}

SkillsModal.propTypes = {
  loadCategories: PropTypes.func.isRequired,
  title: PropTypes.string.isRequired,
  categories: PropTypes.array,
  onSkillClick: PropTypes.func.isRequired,
  skills: PropTypes.array,
};

SkillsModal.defaultProps = {
  categories: [],
  skills: [],
};

function mapStateToProps({ categories, onboarding }) {
  return {
    categories: categories.items,
    searchText: onboarding.searchText,
  };
}

export default connect(mapStateToProps, { loadCategories, onboardingSearch })(SkillsModal);
