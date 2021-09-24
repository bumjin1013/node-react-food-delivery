import React, { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux';
import { Layout, Menu, Breadcrumb, Icon, Card, Button, Typography } from 'antd';
import { getOrder, updateOrderState } from '../../../_actions/store_actions';
import axios from 'axios';
import moment from 'moment';
import { io } from 'socket.io-client';
import NewOrder from './Section/NewOrder';

const { SubMenu } = Menu;
const { Header, Content, Sider } = Layout;
const { Title } = Typography;


function OwnerOrderProceedingPage(props) {

  const dispatch = useDispatch();
  const storeId = props.match.params.storeId;
  const socket = io(`http://localhost:5000`);
  
  let data = { storeId: storeId }
  socket.emit("Join Room", data);

  const alertNewOrder = () => {
    console.log('alertNewOrder')
    return(
      <NewOrder/>
    )
  }
    
  useEffect(() => {

    socket.on("Output Order", dataFromBackEnd => { 
      console.log('backend', dataFromBackEnd);
      alertNewOrder();

    })
    dispatch(getOrder(storeId))
  }, []);

  const order = useSelector(state => state.store.order);


  //주문 렌더링
  // array.slice(0).reverse() 를 통해 원본 배열을 건드리지 않고 배열의 사본을 만들어 map 실행 
  const renderOrder = order && order.slice(0).reverse().map((item, index) => {

    //주문확인
    const orderConfirm = () => {
    
      const body ={
        storeId: storeId,
        orderId: item.orderId,
        state: "조리중"
      }

      dispatch(updateOrderState(body));
    }

    //주문취소
    const orderCancel = () => {
      const body ={
        storeId: storeId,
        orderId: item.orderId,
        state: "주문취소"
      }
  
      dispatch(updateOrderState(body));
    }

    //배달중
    const deliveryStart = () => {
      const body ={
        storeId: storeId,
        orderId: item.orderId,
        state: "배달중"
      }
  
      dispatch(updateOrderState(body));
    }

    //배달완료
    const deliveryFinish = () => {
      const body ={
        storeId: storeId,
        orderId: item.orderId,
        state: "배달완료"
      }
  
      dispatch(updateOrderState(body));
    }
    let menuList = "";

    for(let i=0; i<item.menu.length; i++){
        menuList += item.menu[i].name + "-" + item.menu[i].quantity + "개 ";
    }

    if(item.state !== ("주문취소" || "배달완료")) 
    return(
      <Card size="small" title={<Title level={4}>주문번호: {item.orderId}</Title>}  style={{ width: 'auto'}} extra={<Title level={4}>{item.state}</Title>}
      actions={[
        <Button type="primary" onClick={orderConfirm}>주문 확인</Button>,
        <Button type="danger" onClick={orderCancel}>주문 취소</Button>,
        <Button type="primary" onClick={deliveryStart}>배달 출발</Button>,
        <Button type="primary" onClick={deliveryFinish}>배달 완료</Button>
      ]}
      >
        
        <h3>메뉴 : {menuList}</h3>
        주문일시 : {moment(item.orderTime).format('YY년MM월DD일 HH시mm분')}
        <br/>
        주소 : {item.address}
        <br/>
        전화번호 : {item.phoneNumber}
        <br/>
        사장님에게 : {item.toOwner}
        <br/>
        배달기사에게 : {item.toRider}
        <br />

        
      </Card>
    )
  })

  

    return (
      <div>
      
    <Layout>
      <Sider width={200} style={{ background: '#fff' }}>
        <Menu
          mode="inline"
          defaultSelectedKeys={['1']}
          defaultOpenKeys={['sub1']}
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
                <a href={`/store/${storeId}/order/proceeding`} >주문현황</a>
            </Menu.Item>
            <Menu.Item key="2">
                <a href={`/store/${storeId}/order/completed`} >이전주문</a>
            </Menu.Item>
          </SubMenu>
            <Menu.Item key="3">
                <a href={`/store/${storeId}/menu`} >메뉴관리</a>
            </Menu.Item>
            <Menu.Item key="4">
                <a href={`/store/${storeId}/review`} >리뷰관리</a>
            </Menu.Item>
            <Menu.Item key="5">
                <a href={`/store/${storeId}/setting`} >상점관리</a>
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

          
          {renderOrder}
          
        </Content>
      </Layout>
    </Layout>
 
        </div>
    )
}

export default OwnerOrderProceedingPage
