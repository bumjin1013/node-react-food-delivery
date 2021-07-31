import React, { useEffect, useState } from 'react';
import { useDispatch } from 'react-redux';
import { Layout, Menu, Tabs, Button, PageHeader, Col, Card, Modal, Rate, Form, Input, Avatar, Icon } from 'antd';
import axios from 'axios';
import { updateLocale } from 'moment';
import Meta from "antd/lib/card/Meta";
import FileUpload from '../../utils/FileUpload';
import { addToCart } from '../../../_actions/user_actions';

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
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [Comment, setComment] = useState("");
  const [Star, setStar] = useState("5");
  const [Image, setImage] = useState([]);
  const [Review, setReview] = useState([]);
  

   

  const commentChangeHandler = (event) => {
    setComment(event.currentTarget.value)
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
      writer: props.user.userData._id,
      star: Star,
      comment: Comment
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
          hoverable
          cover={
            <a href={`/store/${menu._id}/detail`}>
              <img
                style={{ width: "100%", maxHeight: "150px" }}
                src={`http://localhost:5000/${menu.image[0]}`}
              />
            </a>
          }
        >
          <Meta title={menu.name} />
        </Card>
        <br />
        <Button size="large" shape="round" type="danger" onClick={clickHandler}>
          Add to Cart
        </Button>
      </Col>
    );
  });

   const renderReview = Review.map((review, index) => {
    return (
      
      <Col lg={6} md={8} xs={24} key={index}>
        <Avatar icon="user" /> {review.writer}
        <Card
          cover={
            <a href={`/store/${review._id}/detail`}>
              <img
                style={{ width: "100%", maxHeight: "150px" }}
                src={`http://localhost:5000/${review.image[0]}`}
              />
            </a>
          }
        >
          <Meta title={review.comment} />
        </Card>
      </Col>
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
        
          <Tabs style={{ textAlign: 'center' }} defaultActiveKey="1" >
            <TabPane tab="메뉴" key="1">
              {renderMenu}
          </TabPane>
          <TabPane tab="정보" key="2">
            Content of Tab Pane 2
          </TabPane>

          <TabPane tab="리뷰" key="3">
            <>
              <Button type="primary" onClick={showModal}>
                리뷰 작성하기
              </Button>
              <Modal title="리뷰 작성" visible={isModalVisible} onOk={reviewHandler} onCancel={handleCancel}>
                별점 : <Rate allowHalf defaultValue={5} onChange={starChangeHandler} value={Star}/>
                <br />
                <div>
                  <FileUpload refreshFunction={updateImage} />
                </div>
                    
                <Form.Item name={['user', 'introduction']} label="내용">
                  <Input.TextArea onChange={commentChangeHandler} value={Comment} />
                </Form.Item>
              </Modal>
              <div style={{ textAlign: 'center' }}>
                
                <br/>
                <div style={{ textAlign: 'center' }}>
                  {renderReview}
                </div>
              </div>
          </>
        </TabPane>
      </Tabs>
    </div>
  )
}

export default UserStorePage
