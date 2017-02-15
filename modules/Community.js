import React from 'react'
import UserCard from './UserCard'
import Masonry from 'react-masonry-component'
import { connect } from 'react-redux'
import { loadUsers } from '../utils/actions'

const Users = [
    {
        _id: 242,
        name: 'Rory MacQueen',
        location: 'Rio de Janeiro, Brazil',
        picture: '/images/person_placeholder.gif',
        skills: [
            {
                label: 'Arabic',
                _id: 'arabic'
            },
            {
                label: 'Chess',
                _id: 'chess'
            },
            {
                label: 'Billard',
                _id: 'billard'
            },
            {
                label: 'Gardening',
                _id: 'gardening'
            },
        ]
    },
    {
        _id: 243,
        name: 'Nick Isaacs',
        location: 'Berlin, Germany',
        picture: '/images/person_placeholder.gif',
        skills: [
            {
                label: 'Arabic',
                _id: 'arabic'
            },
            {
                label: 'Chess',
                _id: 'chess'
            },
            {
                label: 'Billard',
                _id: 'billard'
            },
            {
                label: 'Gardening',
                _id: 'gardening'
            },
        ]
    },
    {
        _id: 244,
        name: 'Thorben Stieler',
        location: 'New York, NY',
        picture: '/images/person_placeholder.gif',
        skills: [
            {
                label: 'Arabic',
            },
            {
                label: 'Chess',
            },
            {
                label: 'Billard',
            },
            {
                label: 'Gardening',
            },
        ]
    }

]

var masonryOptions = {
    gutter: 20,
    itemSelector: '.grid-item',
    fitWidth: true,
}

class Community extends React.Component {

    componentWillMount () {
        this.props.loadUsers()
    }

    render () {
        console.log(this.props.users)
        if (this.props.users.length === 0 || this.props.isFetching) {
            return <div>Loading...</div>
        }
        return (
            <Masonry className={'user-list'} options={masonryOptions}>
                {this.props.users.map(user => <UserCard key={user._id} user={user} />)}
            </Masonry>
        )
  }
}

function mapDispatchToProps (dispatch) {
  return {
    loadUsers: (data) => {
      dispatch(loadUsers(data));
    },
  }
}

// These props come from the application's
// state when it is started
function mapStateToProps(state, ownProps) {
    return {
        users: state.users.items,
        isFetching: state.isFetching,
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(Community);
