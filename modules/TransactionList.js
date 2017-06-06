import React from 'react'
import Transaction from './Transaction'
import FilterBar from './FilterBar'
import { Button, Modal, Grid, Row, Col } from 'react-bootstrap';
import {TransitionMotion, spring} from 'react-motion';
import Loader from './Loader';

class TransactionList extends React.Component {

    constructor (props) {
        super(props);
    }

    componentDidMount () {
      this.props.loadTransactions();

      // Clear unreadTransactions array since now user is seeing them
      let form = new FormData();
      form.append('unreadTransactions', '');
      this.props.updateProfile(form);
    }

    render () {
        return (
            <div className='responsive-margins'>
              <FilterBar />
              {

                (this.props.isFetching && <Loader />)

              }
                <TransitionMotion
                  willLeave={() => {
                    return this.props.useAnimation ? {transform: spring(100)} : null;
                  }}
                  styles={this.props.transactions.map((transaction, i) => ({
                    key: transaction._id,
                    style: { transform: 0 },
                    data: transaction
                  }))}>
                  {interpolatedStyles =>
                    <div style={{overflow: 'hidden'}}>
                      {interpolatedStyles.map(config => {
                        return (
                          <div key={config.key} style={{transform: `translate(${config.style.transform}%)`}}>
                            <Transaction
                              user={this.props.currUser}
                              content={config.data} />
                          </div>
                        )
                      })
                      }
                    </div>
                  }
                </TransitionMotion>
            </div>
      )
    }
}

export default TransactionList
