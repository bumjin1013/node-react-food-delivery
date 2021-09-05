/* eslint-disable jsx-a11y/anchor-is-valid */
import React, { useState } from 'react';
import { useDispatch } from 'react-redux';
import { Menu, Icon, Badge, Modal, Card, Button,Tooltip, Empty } from 'antd';
import axios from 'axios';
import { USER_SERVER } from '../../../Config';
import { withRouter } from 'react-router-dom';
import { useSelector } from "react-redux";
import { removeCartItem, getCartItems } from '../../../../_actions/user_actions';


function RightMenu(props) {

  const dispatch = useDispatch();
  const user = useSelector(state => state.user);
  const owner = useSelector(state => state.owner);
  const cart = user.cartDetail && user.cartDetail.isAuth ? user.cartDetail : null;
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [StoreName, setStoreName] = useState();

  //장바구니에 표시될 상점 이름, 총 가격
  let storeName;
  let totalPrice = 0;

  //장바구니 내역 불러오기
  dispatch(getCartItems());

  const showModal = () => {
    setIsModalVisible(true);
  };

  const handleOk = () => {
    
    setIsModalVisible(false);
    if(cart.length > 0){
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
  
  //장바구니 랜더링
  const renderCart = cart && cart.map((cart, index) => {
    storeName = cart.storeName;
    totalPrice += cart.quantity * cart.price;

    const deleteHandler = () => {
      let body = {
        menuId: cart.id
      }
      //장바구니 해당 메뉴 삭제
      dispatch(removeCartItem(body));

      //삭제 후 재 랜더링
      setTimeout(() => {
        dispatch(getCartItems());
      }, 10);
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
  } else if(owner.ownerData) {
    return(
      <Menu mode={props.mode}>
         <Menu.Item key="logout">
          <a onClick={logoutHandler}>Logout</a>
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

                {renderCart}
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

