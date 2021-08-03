import React, { useEffect, useState } from 'react'
import { Layout, Menu, Breadcrumb, Icon, Comment, Tooltip, Avatar, Rate, Input, Button } from 'antd';
import axios from 'axios';
import moment from 'moment';


const { SubMenu } = Menu;
const { Header, Content, Sider } = Layout;
const { TextArea } = Input;


function OwnerReviewPage(props) {


  useEffect(() => {
    axios.get(`/api/store/stores_by_id?id=${storeId}&type=single`)
      .then((response) => {
        setStore(response.data[0]);
        sestReveiw(response.data[0].review);
        console.log(response.data[0])
      })
      .catch((err) => alert(err));

     
  }, []);

  const storeId = props.match.params.storeId;
  const [Store, setStore] = useState({});
  const [Review, sestReveiw] = useState([]);


  const [ReplyVisible, setReplyVisible] = useState(false);
  const [Contents, setContents] = useState("");
  

  const replyClickHandler = () => {
    setReplyVisible(!ReplyVisible);
  }

  const contentsChangeHandler = (event) => {
    setContents(event.currentTarget.value);
  }

  

  

  const renderReview = Review.map((review, index) => {

    const actions = [
      <span key={index} onClick={replyClickHandler}>Reply to</span>,
    ];

    const submitHandler = (event) => {
      event.preventDefault();
      //서버에 comments를 request로 보낸다.
  
    const body = {
      omments: Contents,
      reviewId: review._id,
      storeId: storeId
    }

    console.log(body);
  
    axios.post('/api/store/addcomments', body)
      .then(response => {
        if (response.data.success) {
          alert('댓글을 등록했습니다.')
          console.log(response.data);     
        } else {
          alert('댓글 등록에 실패하였습니다.')
        }
    })
  }

  return(
      
    <div key={index}>
      <Comment
        actions={actions}
        author={<a>{review.writer}</a>}
        avatar={
          <Avatar
            src="https://zos.alipayobjects.com/rmsportal/ODTLcjxAfvqbxHnVXCYX.png"
            alt={review.writer}
          />
        }
        content={
          <p>
            <Rate value={review.star} />
            <br/>
            <img src={`http://localhost:5000/${review.image[0]}`} style={{width: "15%", maxHeight: "150px"}} />
            <br/>
            {review.contents}
          </p>
        }
        datetime={
          <Tooltip title={moment().format('YYYY-MM-DD HH:mm:ss')}>
            <span>{moment().fromNow()}</span>
          </Tooltip>
        }
    />

    {ReplyVisible ? 
      <div style={{ padding: '0 30px 24px' }} key={index}>
        <TextArea onChange={contentsChangeHandler} value={Contents} />
        <br/>
        <br/>
        <Button type="primary" onClick={submitHandler}>댓글 등록하기</Button>
      </div>
      : ""} 
    </div>
    )
})

    return (
      <div>
        <Layout>
            <Header className="header">
      <div className="logo" />

    <Menu
      theme="dark"
      mode="horizontal"
      defaultSelectedKeys={[]}
      style={{ lineHeight: '64px' }}
    >
      <Menu.Item key="1">nav 1</Menu.Item>
    </Menu>
    </Header>
    <Layout>
      <Sider width={200} style={{ background: '#fff' }}>
        <Menu
          mode="inline"
          defaultSelectedKeys={['4']}
          style={{ height: '100%', borderRight: 0 }}
        >
          <SubMenu
            key="sub1"
            title={
              <span>
                <Icon type="user" />
                주문관리
              </span>
            }
          >
            <Menu.Item key="1">
                <a href={`/store/${Store._id}/order/proceeding`} >주문현황</a>
            </Menu.Item>
            <Menu.Item key="2">
                <a href={`/store/${Store._id}/order/completed`} >이전주문</a>
            </Menu.Item>
          </SubMenu>
            <Menu.Item key="3">
                <a href={`/store/${Store._id}/menu`} >메뉴관리</a>
            </Menu.Item>
            <Menu.Item key="4">
                <a href={`/store/${Store._id}/review`} >리뷰관리</a>
            </Menu.Item>
          
        </Menu>
      </Sider>
      <Layout style={{ padding: '0 24px 24px' }}>
        <Breadcrumb style={{ margin: '16px 0' }}>
         
        </Breadcrumb>
        <Content 
          style={{
            background: '#fff',
            padding: 24,
            margin: 0,
            minHeight: 280,
          }}
        >





    {renderReview}

   



        </Content>
      </Layout>
    </Layout>
  </Layout>
        </div>
    )
}

export default OwnerReviewPage
