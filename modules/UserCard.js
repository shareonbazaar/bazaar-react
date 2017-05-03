import React from 'react'
import RequestButton from './RequestButton'

export default class UserCard extends React.Component {
    render () {
        const imageStyle = {
            backgroundImage: 'url(' + this.props.user.picture +  ')',
        }
        return (
            <div className='user-card grid-item'>
                <img 
                    onClick={this.props.onBookmarkClicked}
                    className='bookmark'
                    src={`/images/bookmark_${this.props.bookmarked ? 'active.svg' : 'inactive.svg'}`} />
                <div className='profile-info'>
                    <div className='profile-pic' style={imageStyle} >
                    </div>
                    <div className='name-location'>
                        <h3>{this.props.user.name.split(' ')[0]}</h3>
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
