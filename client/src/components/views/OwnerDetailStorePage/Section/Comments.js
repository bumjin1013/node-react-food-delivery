import React from 'react'
import SingleComment from './SingleComment';

function Comments(props) {

    console.log(props.CommentsLists);
    return (
        <div>
            {props.review && props.review.map((comment, index) => (
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