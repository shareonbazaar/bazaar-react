import React from 'react';
import PropTypes from 'prop-types';

import AddNewSkill from './AddNewSkill';
import ConfirmationModal from '../ConfirmationModal/ConfirmationModal';
import { Header1 } from '../Layout/Headers';

class View extends React.Component {
  componentDidMount() {
    window.scrollTo(0, 0);
    this.props.loadCategories();
  }

  render() {
    const { skills } = this.props;
    const cellStyle = {
      padding: '10px',
      border: '1px solid black',
    };
    return (
      <div className="content-page">
        <Header1>Manage Bazaar Skills</Header1>
        <AddNewSkill
          {...this.props}
        />
        <table style={{ margin: '10px 0' }}>
          <thead>
            <tr>
              <th style={cellStyle}>Skill name</th>
              <th style={cellStyle}>Category</th>
              <th style={cellStyle}>Id</th>
              <th style={cellStyle}>Delete</th>
            </tr>
          </thead>
          <tbody>
            {
              skills.map(s =>
                (
                  <tr key={s._id}>
                    <td style={cellStyle}>{s.title}</td>
                    <td style={cellStyle}>{s.category}</td>
                    <td style={cellStyle}>{s._id}</td>
                    <td style={cellStyle}>
                      <ConfirmationModal
                        buttonStyle="danger"
                        buttonText="Delete"
                        title="Are you sure you want to delete this skill?"
                        onConfirmation={() => this.props.deleteSkill(s._id)}
                      />
                    </td>
                  </tr>
                )
              )
            }
          </tbody>
        </table>
      </div>
    );
  }
}

View.propTypes = {
  skills: PropTypes.array,
  loadCategories: PropTypes.func.isRequired,
  deleteSkill: PropTypes.func.isRequired,
};

View.defaultProps = {
  skills: [],
};

export default View;
