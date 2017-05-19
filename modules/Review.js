import React from 'react'
import moment from 'moment'
import Identity from './Identity'

export default function Review (props) {
    return (
        <div className='review'>
            <Identity
                imageUrl={props.imageUrl}
                name={props.name}
            />
            <div className='review-body'>
                <div className='rating'>
                    {
                        Array(props.rating).fill(0).map((v, i) => <span key={i}>★</span>)
                    }
                </div>
                <em>{props.service}</em>
                <div className='quote'>{props.text}</div>
                <time className='review-timestamp'>
                    {moment(props.createdAt).format('MMM YYYY')}
                </time>
            </div>
        </div>
    )
}
