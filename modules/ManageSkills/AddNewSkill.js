import React from 'react';
import PropTypes from 'prop-types';
import { FormattedMessage, injectIntl } from 'react-intl';
import { Modal } from 'react-bootstrap';

import ActionButton from '../Actions/ActionButton';
import ResponsiveInputField from '../Authentication/ResponsiveInputField';
import { manageSkillsMessages } from './messages';

class AddNewSkill extends React.Component {
  constructor(props) {
    super(props);
    this.state = this.initState();
    this.onSubmit = this.onSubmit.bind(this);
  }

  onChange(e, field) {
    this.setState({
      [field]: e.target.value,
      started: true,
    });
  }

  onSubmit() {
    const { skillEN, skillAR, skillDE, category } = this.state;
    this.props.addSkill({
      skill: {
        en: skillEN,
        ar: skillAR,
        de: skillDE,
      },
      category,
    });
    this.setState(this.initState());
  }

  initState() {
    return {
      showModal: false,
      started: false,
      skillEN: '',
      skillAR: '',
      skillDE: '',
      category: this.props.categories[0]._id,
    };
  }

  render() {
    const { showModal, skillAR, skillEN, skillDE, category, started } = this.state;
    const { categories } = this.props;
    const { formatMessage } = this.props.intl;
    return (
      <div>
        <Modal
          show={showModal}
          onHide={() => this.setState({ showModal: false })}
        >
          <Modal.Header>
            <Modal.Title>Add new skill</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <ResponsiveInputField
              formGroupIsValid={skillEN.length > 0 || !started}
              formControlType="text"
              formControlValue={skillEN}
              formControlPlaceHolder="Skill (english)"
              formControlOnChange={(e) => { this.onChange(e, 'skillEN'); }}
              messageText={formatMessage(manageSkillsMessages.skillEN)}
            />
            <ResponsiveInputField
              formControlType="text"
              formControlValue={skillAR}
              formControlPlaceHolder="Skill (arabic)"
              formControlOnChange={(e) => { this.onChange(e, 'skillAR'); }}
              messageText={formatMessage(manageSkillsMessages.skillAR)}
            />
            <ResponsiveInputField
              formControlType="text"
              formControlValue={skillDE}
              formControlPlaceHolder="Skill (german)"
              formControlOnChange={(e) => { this.onChange(e, 'skillDE'); }}
              messageText={formatMessage(manageSkillsMessages.skillDE)}
            />
            <ResponsiveInputField
              componentClass="select"
              formControlOnChange={(e) => { this.onChange(e, 'category'); }}
              formControlValue={category}
              messageText={formatMessage(manageSkillsMessages.category)}
            >
              {
                categories.map(c =>
                  <option key={c._id} value={c._id}>{c.label.en}</option>
                )
              }
            </ResponsiveInputField>
          </Modal.Body>
          <Modal.Footer style={{ textAlign: 'center' }}>
            <ActionButton
              onClick={this.onSubmit}
            >
              <FormattedMessage
                id={'ManageSkills.addSkill'}
                defaultMessage={'Add skill'}
              />
            </ActionButton>
          </Modal.Footer>
        </Modal>
        <ActionButton
          onClick={() => this.setState({ showModal: true })}
        >
          <FormattedMessage
            id={'ManageSkills.newSkill'}
            defaultMessage={'New skill'}
          />
        </ActionButton>
      </div>
    );
  }
}

AddNewSkill.propTypes = {
  categories: PropTypes.array.isRequired,
  addSkill: PropTypes.func.isRequired,
  intl: PropTypes.object.isRequired,
};

export default injectIntl(AddNewSkill);

