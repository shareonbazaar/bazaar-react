import React from 'react'
import UserCard from './UserCard'
import Masonry from 'react-masonry-component'

const Users = [
    {
        id: 242,
        name: 'Rory MacQueen',
        location: 'Rio de Janeiro, Brazil',
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
    },
    {
        id: 243,
        name: 'Nick Isaacs',
        location: 'Berlin, Germany',
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
    },
    {
        id: 244,
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

export default class Community extends React.Component {
    constructor (props) {
        super (props);
        this.state = {
            users: Users,
        };
    }

    render () {
        return (
            <Masonry className={'user-list'} options={masonryOptions}>
                {this.state.users.map(user => <UserCard key={user.id} user={user} />)}
            </Masonry>
        )
  }
}
