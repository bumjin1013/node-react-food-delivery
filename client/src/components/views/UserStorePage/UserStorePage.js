import React, { useEffect, useState } from 'react';
import { useDispatch } from 'react-redux';
import { Layout, Menu, Tabs, Button, PageHeader, Col, Card, Modal, Rate, Form, Input, Avatar, Comment, Tooltip } from 'antd';
import axios from 'axios';
import { updateLocale } from 'moment';
import Meta from "antd/lib/card/Meta";
import FileUpload from '../../utils/FileUpload';
import { addToCart } from '../../../_actions/user_actions';
import moment from 'moment';
import MapContainer from '../../utils/MapContainer';

const { SubMenu } = Menu;
const { Header, Content, Sider } = Layout;
const { TabPane } = Tabs;

function UserStorePage(props) {

  const dispatch = useDispatch();

  useEffect(() => {
    axios.get(`/api/store/stores_by_id?id=${storeId}&type=single`)
      .then((response) => {
        setStore(response.data[0]);
        setListMenu(response.data[0].menu);
        setReview(response.data[0].review);
      })
      .catch((err) => alert(err));

     
  }, []);

  const storeId = props.match.params.storeId;
  const [Store, setStore] = useState({});
  const [ListMenu, setListMenu] = useState([]);
  const [IsModalVisible, setIsModalVisible] = useState(false);
  const [Contents, setContents] = useState("");
  const [Star, setStar] = useState("5");
  const [Image, setImage] = useState([]);
  const [Review, setReview] = useState([]);
  

   

  const contentsChangeHandler = (event) => {
    setContents(event.currentTarget.value)
}

  const showModal = () => {
    setIsModalVisible(true);
  };

  const handleCancel = () => {
    setIsModalVisible(false);
  };

  const starChangeHandler = (value) => {
    setStar(value)
    console.log(Star);
  }

  const updateImage = (newImage) => {
    setImage(newImage)
  }
  

  const reviewHandler = (event) => {
    event.preventDefault();

    const body ={
      id: Store._id,
      image: Image,
      writer: props.user.userData.name,
      star: Star,
      contents: Contents
    }

    axios.post('/api/store/addreview', body)
      .then(response => {
        if (response.data.success) {
          alert('리뷰를 성공적으로 등록하였습니다.')
              } else {
              alert('리뷰 등록에 실패 했습니다.')
            }
        })
    setIsModalVisible(false);
  }

 
  const renderMenu = ListMenu.map((menu, index) => {
    const clickHandler = () => {
      let body = {
        menuId: menu._id,
        name: menu.name,
        price: menu.price,
        image: menu.image,
        storeId: Store._id,
        storeName: Store.title
      }
      //필요한 정보를 Cart 필드에다가 넣어 준다.
      dispatch(addToCart(body))
  }

    return (
      
      <Col lg={6} md={8} xs={24} key={index}>
        
        <Card
          cover={
              <img
                style={{ width: "100%", maxHeight: "150px" }}
                src={`http://localhost:5000/${menu.image[0]}`}
              />
          }
          style={{marginTop:'10px', marginBottom:'3px'}}
        >
          <Meta title={menu.name} />
        </Card>
        {menu.state ? 
        <Button size="large" shape="round" type="primary" onClick={clickHandler}>
          장바구니
        </Button>
        :
        <Button size="large" shape="round" type="danger" disabled="true">
          품절
        </Button>
        }
        
      </Col>
    );
  });

   const renderReview = Review.map((review, index) => {
    return (
      
      <div key={index}>
      <Comment
        author={<a>{review.writer}</a>}
        avatar={
          <Avatar
            key={index}
            src="https://zos.alipayobjects.com/rmsportal/ODTLcjxAfvqbxHnVXCYX.png"
            alt={review.writer}
          />
        }
        content={
          <div>
            <Rate value={review.star} />
            <br/>
            <img src={`http://localhost:5000/${review.image[0]}`} style={{width: "15%", maxHeight: "150px"}} />
            <br/>
            {review.contents}
          </div>
        }
        datetime={
          <Tooltip title={moment(review.createdAt).format('YYYY-MM-DD HH:mm:ss')}>
            <span>{moment(review.createdAt).fromNow()}</span>
          </Tooltip>
        }
      />

    {review.comments[0] ?
    <div style={{ padding: '0 30px 24px' }} key={index}>
      <Comment
        key={index}
        author={<a>사장님</a>}
        avatar={
          <Avatar
            key={index}
            src="https://zos.alipayobjects.com/rmsportal/ODTLcjxAfvqbxHnVXCYX.png"
            alt="사장님"
          />
        }
        content={
          <div>
            {review.comments[0]}
          </div>
        }
      />
    </div>
    : null}
    </div>
    );
  });


  

  

    return (
        <div style={{ width: '75%', margin: '3rem auto' }}>
          <PageHeader
            style={{
              border: '1px solid rgb(235, 237, 240)',
            }}
            onBack={() => window.history.back()}
            title={Store.title}
          />
          <div style={{ textAlign: 'center' }}>
            <img style={{ maxWidth: '50%' }} src={`http://localhost:5000/${Store.image}`}/>
          </div >

          <Tabs defaultActiveKey="1" style={{textAlign:'center'}}>

            {/* 메뉴 탭 */}
            <TabPane tab="메뉴" key="1">
              {renderMenu}
            </TabPane>

            {/* 정보 탭 */}
            <TabPane tab="정보" key="2">
              <div style={{whiteSpace: 'pre-wrap'}} >
                {Store.description}
              </div>
              <MapContainer/>
            </TabPane>

            {/* 리뷰 탭 */}
            <TabPane tab="리뷰" key="3" style={{textAlign:'left'}}> 
              <div style={{textAlign:'center'}}>
                <Button type="primary" onClick={showModal}>
                  리뷰 작성하기
                </Button>
              </div>
              
              {/* 리뷰 작성 모달창 */}
              <Modal title="리뷰 작성" visible={IsModalVisible} onOk={reviewHandler} onCancel={handleCancel}>
                별점 : <Rate allowHalf defaultValue={5} onChange={starChangeHandler} value={Star}/>
                <br />
                <div>
                  <FileUpload refreshFunction={updateImage} />
                </div>
                    
                <Form.Item name={['user', 'introduction']} label="내용">
                  <Input.TextArea onChange={contentsChangeHandler} value={Contents} />
                </Form.Item>
              </Modal>

              {renderReview}
              
            </TabPane>
          </Tabs>
        </div>
  )
}

export default UserStorePage
