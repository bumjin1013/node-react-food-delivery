import React from 'react'
import SingleComment from './SingleComment';

function Comments(props) {
    return (
        <div>
            {props.CommentLists && props.CommentLists.map((comment, index) => (
                (!comment.responseTo &&
                    <React.Fragment>
                        <SingleComment comment={comment} storeId={props.storeId}/>
                    </React.Fragment>
                )
            ))}
        </div>
    )
}

export default Comments