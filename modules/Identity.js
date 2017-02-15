import React from 'react'

import CircularImage from './CircularImage'

export default function Identity (props) {
    return (
        <div className='identity'>
            <CircularImage imageUrl={props.imageUrl} />
            <div>{props.name}</div>
        </div>
    )
}
