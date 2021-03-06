import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Layout, Menu, Tabs, Button, PageHeader, Col,Divider , Card, Rate, notification, Avatar, Comment, Tooltip, Empty, message } from 'antd';
import axios from 'axios';
import Meta from "antd/lib/card/Meta";
import { addToCart } from '../../../_actions/user_actions';
import moment from 'moment';
import MapContainer from '../../utils/MapContainer';
import Distance from '../../utils/Distance';

const { SubMenu } = Menu;
const { Header, Content, Sider } = Layout;
const { TabPane } = Tabs;

function UserStorePage(props) {
  const storeId = props.match.params.storeId;
  useEffect(() => {
    axios.get(`http://192.168.0.8:5000/api/stores/stores_by_id?id=${props.match.params.storeId}`)
      .then(response => {
        if(response.data.success){
          console.log(response.data.store);
          setStore(response.data.store[0]);
          setListMenu(response.data.store[0].menu);
          setReview(response.data.store[0].review);
          setAddress(response.data.store[0].address);
          setDeliveryArea(response.data.store[0].deliveryArea);
        } else {
          console.log(response.data.err);
        }
        
      })
      .catch((err) => alert(err));
     
  }, []);

  const dispatch = useDispatch();
  const cart = useSelector(state => state.user.userData && state.user.userData.cart); 
  const userAddress = useSelector(state => state.user.userData && state.user.userData.address)
  
  const [Store, setStore] = useState({});
  const [ListMenu, setListMenu] = useState([]);
  const [Review, setReview] = useState([]);
  const [Address, setAddress] = useState([]);
  const [DeliveryArea, setDeliveryArea] = useState();

  console.log(storeId);
  

  const renderMenu = ListMenu&&ListMenu.map((menu, index) => {

    const addCart = () => {

      let body = {
        menuId: menu._id,
        name: menu.name,
        price: menu.price,
        image: menu.image,
        storeId: Store._id,
        storeName: Store.title
      }

      //?????? ??????????????? ???????????? ????????? ?????? ????????? ????????? ?????? ??????
      if(cart.length > 0 && cart[0].storeId !== Store._id){

        const close = () => {
          dispatch(addToCart(body));
        };

        const addCart = () => {
          message.success('??????????????? ??????????????????.');
          dispatch(addToCart(body));
          notification.close(key);
        }
        const key = `open${Date.now()}`;
        //??????????????? ?????? ??????
        const btn = (
          <Button type="primary" size="small" onClick={addCart}>
            ???????????? ??????
          </Button>
        );
      
        notification.open({
          message: '??????????????? ?????? ????????? ????????? ?????? ????????????. ???????????? ????????? ??????????????????????',
          btn,
          key,
          onClose: close,
        });
      } else {
         //????????? ????????? Cart ??????????????? ?????? ??????.
        message.success('??????????????? ??????????????????.');
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
            {menu.price}???
          </h4>} />
        </Card>
        {menu.state ? 
        <Button size="large" shape="round" type="primary" onClick={addCart}>
          ????????????
        </Button>
        :
        <Button size="large" shape="round" type="danger" disabled="true">
          ??????
        </Button>
        }
        
      </Col>
    );
  });

  //?????? ?????? ?????????
   const renderReview = Review && Review.map((review, index) => {
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
        author={<a>?????????</a>}
        avatar={
          <Avatar
            key={index}
            src="https://zos.alipayobjects.com/rmsportal/ODTLcjxAfvqbxHnVXCYX.png"
            alt="?????????"
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

  //?????? ?????? ?????? ??????
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

            {/* ?????? ??? */}
            <TabPane tab="??????" key="1">
              {renderMenu}
            </TabPane>

            {/* ?????? ??? */}
            <TabPane tab="??????" key="2">
              <div style={{whiteSpace: 'pre-wrap'}} >
                <h3>?????? ??????</h3>
                {Store.description}
                <Divider />
                <h3>?????? ??????</h3>
                {Address}
                <MapContainer address={Address} title={Store.title} />
                ?????? : <Distance storeAddress={Address && Address} myAddress={userAddress && userAddress}/>??????
                <Divider />
                <h3>?????? ?????? ??????</h3>
                {renderDeliveryArea}
              </div>
              
            </TabPane>

            {/* ?????? ??? */}
            <TabPane tab="??????" key="3" style={{textAlign:'left'}}> 
              <div style={{textAlign:'center'}}>
              
              </div>

              {/*?????? ?????????*/}

              {renderReview 
                ? renderReview 
                : 
                <div>
                  <br/>
                    <Empty description={"????????? ????????? ????????????."}/>
                </div>  
              }
              
              
            </TabPane>
          </Tabs>
        </div>
  )
}

export default UserStorePage
