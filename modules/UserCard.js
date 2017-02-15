import React from 'react'
import RequestButton from './RequestButton'

export default class UserCard extends React.Component {
    render () {
        const imageStyle = {
            backgroundImage: 'url(' + this.props.user.picture +  ')',
        }
        return (
            <div className='user-card grid-item'>
                <img className='bookmark' src='/images/bookmark_inactive.svg' />
                <div className='profile-info'>
                    <div className='profile-pic' style={imageStyle} >
                    </div>
                    <div className='name-location'>
                        <h3>{this.props.user.name}</h3>
                        <h4>{this.props.user.location}</h4>
                    </div>
                    <hr className='separator' />
                    <div className='skill-icons'>
                        {this.props.user.skills.map((skill, i) => {
                            return (
                                <div key={i} className='skill-label'>{skill.label.en}</div>
                            );
                        })}
                    </div>
                </div>
                <RequestButton user={this.props.user} />
            </div>
        )
  }
}
