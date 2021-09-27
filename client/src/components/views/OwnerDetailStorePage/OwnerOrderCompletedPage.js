import React, { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux';
import { Layout, Menu, Breadcrumb, Icon, Card, Button, Typography } from 'antd';
import axios from 'axios';
import moment from 'moment';
import { getOrder } from '../../../_actions/store_actions';

const { SubMenu } = Menu;
const { Header, Content, Sider } = Layout;
const { Title } = Typography;

function OwnerOrderCompletedPage(props) {

  const dispatch = useDispatch();
  const storeId = props.match.params.storeId;

  useEffect(() => {
    dispatch(getOrder(storeId))
  }, []);

  const order = useSelector(state => state.store.order);

  //이전주문 렌더링
  const renderOrder = order && order.slice(0).reverse().map((order, index) => {
    
    let menuList = "";
  
    for(let i=0; i<order.menu.length; i++){
        menuList += order.menu[i].name + "-" + order.menu[i].quantity + "개 ";
    }
  
    if(order.state != "조리중" && order.state != "배달중" && order.state != "확인중"){ 
      return(
        <Card size="small" title={<Title level={4}>주문번호: {order.orderId}</Title>}  style={{ width: 'auto'}} extra={<Title level={4}>{order.state}</Title>}
        actions={[
        ]}
        >
          <h3>메뉴 : {menuList}</h3>
          주문일시 : {moment(order.orderTime).format('YY년MM월DD일 HH시mm분')}
          <br/>
          주소 : {order.address}
          <br/>
          전화번호 : {order.phoneNumber}
          <br/>
          사장님에게 : {order.toOwner}
          <br/>
          배달기사에게 : {order.toRider}
          <br />
      </Card>
      )
    }
  })
 
    return (
      <div>
       
    <Layout>
      <Sider width={200} style={{ background: '#fff' }}>
        <Menu
          mode="inline"
          defaultSelectedKeys={['2']}
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

export default OwnerOrderCompletedPage
