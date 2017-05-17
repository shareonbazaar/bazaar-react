import React from 'react'
import { connect } from 'react-redux'
import { Button, Modal } from 'react-bootstrap';
import { loadCategories } from '../utils/actions'


class SkillsModal extends React.Component {
    constructor (props) {
        super(props);
        this.state = {
            showModal: false,
        };
    }

    componentDidMount () {
        this.props.loadCategories();
    }

    render () {
        return (
            <div>
                <Modal show={this.state.showModal} onHide={() => this.setState({showModal: false})}>
                    <Modal.Header closeButton>
                        <Modal.Title>Select {this.props.title}</Modal.Title>
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
                        <Button bsStyle='primary' onClick={() => this.setState({showModal: false})}>Done</Button>
                    </Modal.Footer>
                </Modal>
                <Button 
                    onClick={() => this.setState({showModal: true})}
                    bsStyle="primary">
                    Edit {this.props.title}
                </Button>
            </div>
        )
    }
}

// These props come from the application's
// state when it is started
function mapStateToProps(state, ownProps) {
    return {
        categories: state.categories.items,
    }
}

export default connect(mapStateToProps, { loadCategories })(SkillsModal);
