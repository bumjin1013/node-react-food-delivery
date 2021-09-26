import React, { useState } from 'react'
import { Comment, Avatar, Button, Input, Tooltip, Rate, message } from 'antd';
import { addcomments } from '../../../../_actions/store_actions';
import moment from 'moment';
import { useDispatch } from 'react-redux';
const { TextArea } = Input;

function SingleComment(props) {

    const dispatch = useDispatch();
    const [CommentValue, setCommentValue] = useState("")
    const [OpenReply, setOpenReply] = useState(false)

    const handleChange = (e) => {
        setCommentValue(e.currentTarget.value)
    }

    const openReply = () => {
        setOpenReply(!OpenReply)
    }
    
    const onSubmit = (e) => {
        e.preventDefault();

        const body = {
            storeId: props.storeId,
            reviewId: props.comment._id,
            comments: CommentValue
        }

        dispatch(addcomments(body));
        setOpenReply(false);
        message.success('댓글을 등록했습니다.');
    }
    

    const actions = [
        <span onClick={openReply} key="comment-basic-reply-to">Reply to </span>
    ]

    return (
        <div>
            <Comment
        actions={actions}
        author={<a>{props.comment.writer}</a>}
        avatar={
          <Avatar
            src="https://zos.alipayobjects.com/rmsportal/ODTLcjxAfvqbxHnVXCYX.png"
            alt={props.comment.writer}
          />
        }
        content={
          <div>
            <Rate allowHalf value={props.comment.star} />
            <br/>
            <img src={`http://localhost:5000/${props.comment.image[0]}`} style={{width: "15%", maxHeight: "150px"}} />
            <br/>
            {props.comment.contents}
          </div>
        }
        datetime={
          <Tooltip title={moment(props.comment.createdAt).format('YYYY-MM-DD HH:mm:ss')}>
            <span>{moment(props.comment.createdAt).fromNow()}</span>
          </Tooltip>    
        }
      />

        {props.comment.comments[0] ?
        <div style={{ padding: '0 30px 24px' }} >
            <Comment
                author={<a>사장님</a>}
                avatar={
            <Avatar
                src="https://zos.alipayobjects.com/rmsportal/ODTLcjxAfvqbxHnVXCYX.png"
                alt="사장님"
            />}
            content={
            <div>
                {props.comment.comments[0]}
            </div>
            }
        />
        </div>
        : null}

        {OpenReply &&
            <form style={{ display: 'flex' }} onSubmit={onSubmit}>
                <TextArea
                    style={{ width: '100%', borderRadius: '5px' }}
                    onChange={handleChange}
                    value={CommentValue}
                    placeholder="댓글을 입력해주세요."
                />
                <br />
                <Button type="primary" style={{ width: '20%', height: '52px' }} onClick={onSubmit}>확인</Button>
            </form>
        }
        </div>
    )
}

export default SingleComment
