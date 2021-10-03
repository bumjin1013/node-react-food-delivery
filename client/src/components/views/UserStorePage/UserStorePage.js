import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Layout, Menu, Tabs, Button, PageHeader, Col,Divider , Card, Rate, notification, Avatar, Comment, Tooltip, Empty, message } from 'antd';
import axios from 'axios';
import Meta from "antd/lib/card/Meta";
import { addToCart } from '../../../_actions/user_actions';
import moment from 'moment';
import MapContainer from '../../utils/MapContainer';
import Distance from '../../utils/Distance';
import Delivery from '../OwnerDetailStorePage/Section/Delivery';
const { SubMenu } = Menu;
const { Header, Content, Sider } = Layout;
const { TabPane } = Tabs;

function UserStorePage(props) {

  const dispatch = useDispatch();
  const cart = useSelector(state => state.user.userData && state.user.userData.cart); 
  const userAddress = useSelector(state => state.user.userData && state.user.userData.address)
  
  useEffect(() => {
    axios.get(`/api/store/stores_by_id?id=${storeId}&type=single`)
      .then((response) => {
        setStore(response.data[0]);
        console.log(response.data[0])
        setListMenu(response.data[0].menu);
        setReview(response.data[0].review);
        setAddress(response.data[0].address);
        setDeliveryArea(response.data[0].deliveryArea);
      })
      .catch((err) => alert(err));
     
  }, []);

  const storeId = props.match.params.storeId;
  const [Store, setStore] = useState({});
  const [ListMenu, setListMenu] = useState([]);
  const [Review, setReview] = useState([]);
  const [Address, setAddress] = useState([]);
  const [DeliveryArea, setDeliveryArea] = useState();
 
  const renderMenu = ListMenu.map((menu, index) => {

    const addCart = () => {

      let body = {
        menuId: menu._id,
        name: menu.name,
        price: menu.price,
        image: menu.image,
        storeId: Store._id,
        storeName: Store.title
      }

      //현재 장바구니에 담겨있는 상점과 다른 상점의 메뉴를 담을 경우
      if(cart.length > 0 && cart[0].storeId !== Store._id){

        const close = () => {
          dispatch(addToCart(body));
        };

        const addCart = () => {
          message.success('장바구니에 추가했습니다.');
          dispatch(addToCart(body));
          notification.close(key);
        }
        const key = `open${Date.now()}`;
        //확인버튼을 누를 경우
        const btn = (
          <Button type="primary" size="small" onClick={addCart}>
            장바구니 담기
          </Button>
        );
      
        notification.open({
          message: '장바구니에 다른 상점의 메뉴가 담겨 있습니다. 선택하신 메뉴를 담으시겠습니까?',
          btn,
          key,
          onClose: close,
        });
      } else {
         //필요한 정보를 Cart 필드에다가 넣어 준다.
        message.success('장바구니에 추가했습니다.');
        dispatch(addToCart(body));
      }
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
          <Meta title={
          
          <h4>
            {menu.name}
            <br/>
            {menu.price}원
          </h4>} />
        </Card>
        {menu.state ? 
        <Button size="large" shape="round" type="primary" onClick={addCart}>
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

  //리뷰 내역 랜더링
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
            <Rate value={review.star} disabled={true}/>
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

  //배달 가능 지역 출력
  const renderDeliveryArea = DeliveryArea && DeliveryArea.map((area, index) => {
    return (
      <div>
        {area.si + ' ' + area.gu + ' ' + area.ro}
      </div>
    )
  })



    return (
        <div style={{ width: '1000px', margin: '3rem auto' }}>
           

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
                <h3>가게 소개</h3>
                {Store.description}
                <Divider />
                <h3>가게 위치</h3>
                {Address}
                <MapContainer address={Address} title={Store.title} />
                거리 : <Distance storeAddress={Address} myAddress={userAddress}/>미터
                <Divider />
                <h3>배달 가능 지역</h3>
                {renderDeliveryArea}
              </div>
              
            </TabPane>

            {/* 리뷰 탭 */}
            <TabPane tab="리뷰" key="3" style={{textAlign:'left'}}> 
              <div style={{textAlign:'center'}}>
              
              </div>

              {/*리뷰 랜더링*/}

              {renderReview 
                ? renderReview 
                : 
                <div>
                  <br/>
                    <Empty description={"작성된 리뷰가 없습니다."}/>
                </div>  
              }
              
              
            </TabPane>
          </Tabs>
        </div>
  )
}

export default UserStorePage
