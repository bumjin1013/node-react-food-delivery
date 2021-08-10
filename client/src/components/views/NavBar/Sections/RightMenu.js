/* eslint-disable jsx-a11y/anchor-is-valid */
import React, { useState } from 'react';
import { useDispatch } from 'react-redux';
import { Menu, Icon, Badge, Modal, Card, Button,Tooltip, Empty } from 'antd';
import axios from 'axios';
import { USER_SERVER } from '../../../Config';
import { withRouter } from 'react-router-dom';
import { useSelector } from "react-redux";
import { removeCartItem } from '../../../../_actions/user_actions';

function RightMenu(props) {

  const dispatch = useDispatch();
  const user = useSelector(state => state.user)
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [Cart, setCart] = useState([]);
  const [StoreName, setStoreName] = useState();

  let storeName;
  let totalPrice = 0;
  

  const showModal = () => {
    setCart(user.userData.cart);
    setIsModalVisible(true);
  };

  const handleOk = () => {
    
    setIsModalVisible(false);
    if(Cart.length > 0){
    props.history.push('/order');
    } else {
      alert('장바구니에 메뉴를 추가해주세요.');
    }
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
    totalPrice += cart.quantity * cart.price;

    const deleteHandler = () => {
      let body = {
        menuId: cart.id
      }
      dispatch(removeCartItem(body))
      
      
      setCart(user.userData.cart);
      console.log(Cart);
    }

    return(
      <div>
        <Card key={index} style={{ width: 'auto' }}>
          {cart.name} - {cart.quantity}개 : {cart.price * cart.quantity}원
              <Button icon="delete" onClick={deleteHandler} />
        </Card>
      </div>
    );
  })

  

  const historyClickHandler = () => {
    props.history.push('/history');
  }

  const userClickHandler = () => {
    props.history.push('/user');
  }

  

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
        <Menu.Item key="user" style= {{paddingBottom: 3}}>
          <Tooltip placement="bottom" title={"마이페이지"}>
              <Icon type="user" style={{ fontSize: 30}} onClick={userClickHandler} />
            </Tooltip>
        </Menu.Item>

        <Menu.Item key="history" style= {{paddingBottom: 3}}>
          <Tooltip placement="bottom" title={"주문내역"}>
            <Icon type="read" style={{ fontSize: 30}} onClick={historyClickHandler} />
            </Tooltip>
        </Menu.Item>

        <Menu.Item key="cart" style= {{paddingBottom: 3}}>
          <Badge count={user.userData && user.userData.cart.length}>
            <Tooltip placement="bottom" title={"장바구니"}>
              <Icon type="shopping-cart" style={{ fontSize: 30, marginBottom: 3}} onClick={showModal} />
              </Tooltip>
              <Modal title="장바구니" visible={isModalVisible} onOk={handleOk} onCancel={handleCancel} cancelText="닫기" okText="주문하기">
                <h1>{storeName}</h1>

                {renderCart ? renderCart : <Empty />}
                <br />
                <h3>총 주문금액 : {totalPrice}원</h3> 
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

