import { connect } from 'react-redux'
import TransactionList from './TransactionList'
import { loadTransactions } from '../utils/actions'
import {StatusType} from '../models/Enums'


const ts = [
    {
        id: 242,
        status: 'proposed',
        _participants: [
          {
              id: 243,
              profile: {
                name: 'Nick Isaacs',
                location: 'Berlin, Germany',
                picture: '/images/person_placeholder.gif',
              }
          }
        ],
        request_type: 'receive',
        service: {
          label: 'Cooking'
        },
        createdAt: 1487032342234,
        _creator: {
          _id: '589de3ce29018712b1d3b4c2',
          name: 'Nick'
        },
        location: 'Rio de Janeiro, Brazil',
    },
    {
        id: 244,
        status: 'proposed',
        _participants: [
          {
              id: 243,
              profile: {
                name: 'Thorben Stieler',
                location: 'Berlin, Germany',
                picture: '/images/person_placeholder.gif',
              }
          }
        ],
        request_type: 'receive',
        service: {
          label: 'Cooking'
        },
        createdAt: 1487012342324,
        _creator: {
          _id: 2429,
          name: 'Nick'
        },
        location: 'Rio de Janeiro, Brazil',
        messages: [
          {
            _sender: {
              name: 'Rory MacQueen',
              id: 234
            },
            message: 'hello world',
            id: 124
          }
        ]
    },
    {
        id: 245,
        status: 'accepted',
        _participants: [
          {
              id: 243,
              profile: {
                name: 'Thorben Stieler',
                location: 'Berlin, Germany',
                picture: '/images/person_placeholder.gif',
              }
          }
        ],
        request_type: 'receive',
        service: {
          label: 'Cooking'
        },
        createdAt: 1487012342324,
        _creator: {
          _id: 2429,
          name: 'Nick'
        },
        location: 'Rio de Janeiro, Brazil',
        messages: [
          {
            _sender: {
              name: 'Rory MacQueen',
              _id: 234
            },
            message: 'hello world',
            _id: 1244
          },
          {
            _sender: {
              name: 'Nick Isaacs',
              _id: '589de3ce29018712b1d3b4c2'
            },
            message: 'another message',
            _id: 1246
          },
        ]
    },
    {
        id: 249,
        status: 'complete',
        _participants: [
          {
              id: 243,
              profile: {
                name: 'Thorben Stieler',
                location: 'Berlin, Germany',
                picture: '/images/person_placeholder.gif',
              }
          }
        ],
        request_type: 'receive',
        service: {
          label: 'Cooking'
        },
        createdAt: 1487012342324,
        _creator: {
          _id: 2429,
          name: 'Nick'
        },
        location: 'Rio de Janeiro, Brazil',
        reviews: [
          {
            _creator: {
              _id: '589de3ce29018712b1d3b4c2p',
            },
            text: "What a great time",
          }
        ],
        messages: [
          {
            _sender: {
              name: 'Rory MacQueen',
              _id: 234
            },
            message: 'hello world',
            _id: 1244
          },
          {
            _sender: {
              name: 'Nick Isaacs',
              _id: '589de3ce29018712b1d3b4c2'
            },
            message: 'another message',
            _id: 1246
          },
        ]
    },
]

const getVisibleTransactions = (transactions, filter) => {
  switch (filter) {
    case 'PROPOSED':
      return transactions.filter(t => t.status === StatusType.PROPOSED)
    case 'UPCOMING':
      return transactions.filter(t => t.status === StatusType.ACCEPTED)
    case 'COMPLETE':
      return transactions.filter(t => t.status !== StatusType.PROPOSED && t.status !== StatusType.ACCEPTED)
    default:
      return [];
  }
}

const mapStateToProps = (state) => {
  return {
    transactions: getVisibleTransactions(state.transactions.items, state.transactions.filter),
    isFetching: state.transactions.isFetching,
    currUser: state.auth.user,
    useAnimation: state.transactions.useAnimation,
    toReview: state.transactions.toReview,
  }
}

const mapDispatchToProps = (dispatch) => {
  return {
    loadTransactions: () => {
      dispatch(loadTransactions())
    }
  }
}

const VisibleTransactionsList = connect(
  mapStateToProps,
  mapDispatchToProps
)(TransactionList)

export default VisibleTransactionsList