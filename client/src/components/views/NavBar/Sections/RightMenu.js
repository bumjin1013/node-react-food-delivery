/* eslint-disable jsx-a11y/anchor-is-valid */
import React, { useState, useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { Menu, Icon, Badge, Modal, Card } from 'antd';
import axios from 'axios';
import { USER_SERVER } from '../../../Config';
import { withRouter } from 'react-router-dom';
import { useSelector } from "react-redux";

function RightMenu(props) {

  const user = useSelector(state => state.user)
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [Cart, setCart] = useState([]);
  const [StoreName, setStoreName] = useState();

  let storeName;
  let totalPrice =0;
  

  const showModal = () => {
    setCart(user.userData.cart);
    setIsModalVisible(true);
  };

  const handleOk = () => {
    setIsModalVisible(false);
  };

  const handleCancel = () => {
    setIsModalVisible(false);
  };

  const logoutHandler = () => {
    axios.get(`${USER_SERVER}/logout`).then(response => {
      if (response.status === 200) {
        props.history.push("/login");
      } else {
        alert('Log Out Failed')
      }
    });
  };

  const renderCart = Cart.map((cart, index) => {
    storeName = Cart[0].storeName;
    totalPrice += cart.quantity * cart.price

    console.log(storeName);
    return(
      <div>
        <Card key={index} style={{ width: 470 }}>
          <p>{cart.name}</p>
          <p>{cart.quantity}개</p>
          <p>{cart.price * cart.quantity}원</p>
        </Card>
      </div>
    );
  })

  

  if (user.userData && !user.userData.isAuth) {
    return (
      <Menu mode={props.mode}>
        <Menu.Item key="mail">
          <a href="/login">Signin</a>
        </Menu.Item>
        <Menu.Item key="app">
          <a href="/register">Signup</a>
        </Menu.Item>
      </Menu>
    )
  } else {
    return (
      <Menu mode={props.mode}>
        <Menu.Item key="cart" style= {{paddingBottom: 3}}>
          <Badge count={user.userData && user.userData.cart.length}>
              <Icon type="shopping-cart" style={{ fontSize: 30, marginBottom: 3}} onClick={showModal} />
              <Modal title="장바구니" visible={isModalVisible} onOk={handleOk} onCancel={handleCancel} cancelText="닫기" okText="주문하기">
              
                <h1>{storeName}</h1>
                {renderCart}
                <br />
                  
                  
                <h3>총 주문금액 : {totalPrice}</h3> 
                  
              </Modal>
          </Badge>
        </Menu.Item>

        <Menu.Item key="logout">
          <a onClick={logoutHandler}>Logout</a>
        </Menu.Item>
      </Menu>
    )
  }
}

export default withRouter(RightMenu);

