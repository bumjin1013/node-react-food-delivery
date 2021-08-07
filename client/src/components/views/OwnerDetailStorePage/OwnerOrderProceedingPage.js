import React, { useEffect, useState } from 'react'
import { Layout, Menu, Breadcrumb, Icon, Card, Button, Typography} from 'antd';
import axios from 'axios';


const { SubMenu } = Menu;
const { Header, Content, Sider } = Layout;
const { Title } = Typography;


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
  


  //주문 렌더링
  const renderOrder = Order.map((order, index) => {

    const orderConfirm = () => {
    
      const body ={
        storeId: storeId,
        orderId: order.orderId,
        state: "조리중"
      }

      axios.post('/api/store/updateorderstate', body)
        .then(response => {
          if (response.data.success) {
            window.location.reload();
          } else {
            alert('상태 변경에 실패하였습니다.');
          }
        })
    }
  
    const orderCancel = () => {
      const body ={
        storeId: storeId,
        orderId: order.orderId,
        state: "주문취소"
      }
  
      console.log(body);
  
      axios.post('/api/store/updateorderstate', body)
        .then(response => {
          if (response.data.success) {
            alert('주문을 취소하였습니다.');
            window.location.reload();
          } else {
            alert('주문 취소에 실패하였습니다..');
          }
        })
    }
    const deliveryStart = () => {
      const body ={
        storeId: storeId,
        orderId: order.orderId,
        state: "배달중"
      }
  
      console.log(body);
  
      axios.post('/api/store/updateorderstate', body)
        .then(response => {
          if (response.data.success) {
            window.location.reload();
          } else {
            alert('상태 변경에 실패하였습니다.')
          }
        })
    }
    const deliveryFinish = () => {
      const body ={
        storeId: storeId,
        orderId: order.orderId,
        state: "배달완료"
      }
  
      console.log(body);
  
      axios.post('/api/store/updateorderstate', body)
        .then(response => {
          if (response.data.success) {
          window.location.reload();
          } else {
            alert('상태 변경에 실패하였습니다.')
          }
        })
    }
    let menuList = "";

    for(let i=0; i<order.menu.length; i++){
        menuList += order.menu[i].name + "-" + order.menu[i].quantity + "개 ";
    }

    
    return(
      <Card size="small" title={<Title level={4}>주문번호: {order.orderId}</Title>}  style={{ width: 'auto'}} extra={<Title level={4}>{order.state}</Title>}
      actions={[
        <Button type="primary" onClick={orderConfirm}>주문 확인</Button>,
        <Button type="danger" onClick={orderCancel}>주문 취소</Button>,
        <Button type="primary" onClick={deliveryStart}>배달 출발</Button>,
        <Button type="primary" onClick={deliveryFinish}>배달 완료</Button>
      ]}
      >
        
        <h3>메뉴 : {menuList}</h3>

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
       <Menu.Item key="1">
        <a href={`/store/${Store._id}/detail`}>
          {Store.title}
        </a>
      </Menu.Item>
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
