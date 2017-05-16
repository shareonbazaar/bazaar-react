import React from 'react'
import moment from 'moment'

export default function Review (props) {
    return (
        <div className='review'>
            <div className='rating'>
                {
                    Array(props.review.rating).fill(0).map((v, i) => <span key={i}>★</span>)
                }
            </div>
            <time className='review-timestamp'>
                {moment(props.review.createdAt).fromNow()}
            </time>
            <quote>{props.review.text}</quote>
        </div>
    )
}
