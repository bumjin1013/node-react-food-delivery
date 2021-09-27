import React, { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux';
import { Layout, Menu, Breadcrumb, Icon, Card, Button, Typography, notification, message, Popconfirm } from 'antd';
import { getOrder, updateOrderState } from '../../../_actions/store_actions';
import moment from 'moment';
import { io } from 'socket.io-client';
import Axios from 'axios';

const { SubMenu } = Menu;
const { Header, Content, Sider } = Layout;
const { Title } = Typography;


function OwnerOrderProceedingPage(props) {

  const dispatch = useDispatch();
  const storeId = props.match.params.storeId;
  const socket = io(`http://localhost:5000`);
  const order = useSelector(state => state.store.order);

  let data = { storeId: storeId }
  //본인 상점의 storeId로 만들어진 room에 입장.
  socket.emit("Join Room", data);
  
  //새로운 주문 도착시 알림
  const alertNewOrder = (data) => {

    //닫기
    const close = () => {
      console.log(
        'Notification was closed. Either the close button was clicked or duration time elapsed.',
      );
    }
    
    //주문 수락 버튼
    const newOrderConfirm = () => {
      //새로운 주문 주문내역에 추가
      dispatch(getOrder(storeId))
      message.success('주문을 수락하였습니다.');

      //알림 닫기
      notification.close(key)
      
      const body ={
        userId: data.userId,
        storeId: storeId,
        orderId: data.orderId,
        state: "조리중"
      }
      
      socket.emit("Input Order State", body)
      //주문상태 update
      dispatch(updateOrderState(body));

      Axios.post('/api/users/updateHistoryState', body)
      .then(response => {
        if (response.data) {
          console.log('success');
        } else {
            alert('오류');
        }
      })
    }

    //주문 취소 버튼
    const newOrderCancel = () => {
      //알림 닫기
      message.success('주문을 취소하였습니다.');

      notification.close(key)

      const body ={
        storeId: storeId,
        orderId: data.orderId,
        state: "주문취소"
      }

      socket.emit("Input Order State", body)
      //주문상태 update
      dispatch(updateOrderState(body));

      Axios.post('/api/users/updateHistoryState', body)
      .then(response => {
        if (response.data) {
          console.log('success');
        } else {
            alert('오류');
        }
      })
    }

    //새로운 주문 알림 key값
    const key = `open${Date.now()}`;

    //새로 들어온 주문 내역 랜더링
    const renderNewOrder = () => {
      return(
        <div>
          주문번호 : {data.orderId}
          <br/>        
          주소 : {data.addresss}
          <br/>
          사장님께 : {data.toOwner}
          <br/>
          배달기사에게 : {data.toRider}
          <br/>
          결제금액 : {data.price}
          <br/>
          <Button type="primary" onClick={newOrderConfirm}>주문수락</Button>
          <Button type="danger" onClick={newOrderCancel}>주문취소</Button>
        </div>
      )
    }

    //주문 알림 창
    notification.open({
      message: '주문이 들어왔습니다.',
      description: renderNewOrder(),
      duration: null,
      key,
      onClose: close,
      icon: <Icon type="alert" style={{ color: '#108ee9' }}  />,
    });
  };
    
  useEffect(() => {

    dispatch(getOrder(storeId))

    socket.on("Output Order", dataFromBackEnd => { 
      console.log('backend', dataFromBackEnd);
      alertNewOrder(dataFromBackEnd.order[0]);
    })
  }, []);

  


  //주문 렌더링
  // array.slice(0).reverse() 를 통해 원본 배열을 건드리지 않고 배열의 사본을 만들어 map 실행 - 시간 역순 표시 
  const renderOrder = order && order.slice(0).reverse().map((item, index) => {

    //주문확인
    const orderConfirm = () => {
    
      const body ={
        userId: item.userId,
        storeId: storeId,
        orderId: item.orderId,
        state: "조리중"
      }
      socket.emit("Join OrderId Room", body);
      socket.emit("Input Order State", body)

      dispatch(updateOrderState(body));

      Axios.post('/api/users/updateHistoryState', body)
      .then(response => {
        if (response.data) {
          console.log('success');
        } else {
            alert('오류');
        }
      })
    }

    //주문취소
    const orderCancel = () => {
      const body ={
        userId: item.userId,
        storeId: storeId,
        orderId: item.orderId,
        state: "주문취소"
      }
      message.success('주문을 취소하였습니다.');

      socket.emit("Join OrderId Room", body);
      socket.emit("Input Order State", body);
      dispatch(updateOrderState(body));

      Axios.post('/api/users/updateHistoryState', body)
      .then(response => {
        if (response.data) {
          console.log('success');
        } else {
            alert('오류');
        }
      })
    }

    //배달중
    const deliveryStart = () => {
      const body ={
        userId: item.userId,
        storeId: storeId,
        orderId: item.orderId,
        state: "배달중"
      }
  
      socket.emit("Join OrderId Room", body);
      socket.emit("Input Order State", body)
      dispatch(updateOrderState(body));

      Axios.post('/api/users/updateHistoryState', body)
      .then(response => {
        if (response.data) {
          console.log(response.data);
        } else {
            alert('오류');
        }
      })
    }

    //배달완료
    const deliveryFinish = () => {
      const body ={
        userId: item.userId,
        storeId: storeId,
        orderId: item.orderId,
        state: "배달완료"
      }
      
      socket.emit("Join OrderId Room", body);
      socket.emit("Input Order State", body)
      dispatch(updateOrderState(body));

      Axios.post('/api/users/updateHistoryState', body)
      .then(response => {
        if (response.data) {
          console.log('success');
        } else {
            alert('오류');
        }
      })
    }
    let menuList = "";

    for(let i=0; i<item.menu.length; i++){
        menuList += item.menu[i].name + "-" + item.menu[i].quantity + "개 ";
    }

    if(item.state !== "주문취소" && item.state !== "배달완료"){ 
    return(
      <Card size="small" title={<Title level={4}>주문번호: {item.orderId}</Title>}  style={{ width: 'auto'}} extra={<Title level={4}>{item.state}</Title>}
      actions={[
        <Button type="primary" onClick={orderConfirm}>주문 확인</Button>,
        <Popconfirm placement="bottom" title={'주문취소를 누르면 다시 되돌릴 수 없습니다. 주문을 취소하시겠습니까?'} onConfirm={orderCancel} okText="확인" cancelText="취소">
          <Button type="danger">주문 취소</Button>
        </Popconfirm>,
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
    )}
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
