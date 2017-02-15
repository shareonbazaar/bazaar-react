import React from 'react'

export default function CircularImage (props) {
    return (
        <div className='circular-img'>
            <img src={props.imageUrl} />
        </div>
    )
}
