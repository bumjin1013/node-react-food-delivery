import React, { useEffect, useState } from 'react'
import { Layout, Menu, Breadcrumb, Icon, Card } from 'antd';
import axios from 'axios';

const { SubMenu } = Menu;
const { Header, Content, Sider } = Layout;

function OwnerOrderProceedingPage(props) {


  useEffect(() => {
    axios.get(`/api/store/stores_by_id?id=${storeId}&type=single`)
      .then((response) => {
        setStore(response.data[0]);
        setOrder(response.data[0].order);
        console.log(response.data[0])
      })
      .catch((err) => alert(err));

     
  }, []);

  const storeId = props.match.params.storeId;
  const [Store, setStore] = useState({});
  const [Order, setOrder] = useState([]);

  const renderOrder = Order.map((order, index) => {
    let menuList = ""

    for(let i=0; i<order.menu.length; i++){
        menuList += order.menu[i].name + "-" + order.menu[i].quantity + "개 ";
        
      }
    return(
      <Card size="small" title={order.userId}  style={{ width: 300 }}>
        <h3>메뉴 : {menuList}</h3>

        주소 : {order.address}
        <br/>
        전화번호 : {order.phoneNumber}
        <br/>
        사장님에게 : {order.toOwner}
        <br/>
        배달기사에게 : {order.toRider}
      </Card>
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
      defaultSelectedKeys={['0']}
      style={{ lineHeight: '64px' }}
    >
      <Menu.Item key="1">nav 1</Menu.Item>
    </Menu>
    </Header>
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
            <Menu.Item key="5">
                <a href={`/store/${Store._id}/setting`} >상점관리</a>
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
  </Layout>
        </div>
    )
}

export default OwnerOrderProceedingPage
