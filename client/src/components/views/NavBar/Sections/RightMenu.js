/* eslint-disable jsx-a11y/anchor-is-valid */
import React from 'react';
import { useDispatch } from 'react-redux';
import { Menu, Icon, Badge, Tooltip } from 'antd';
import axios from 'axios';
import { USER_SERVER } from '../../../Config';
import { withRouter } from 'react-router-dom';
import { useSelector } from "react-redux";

function RightMenu(props) {

  const dispatch = useDispatch();
  const user = useSelector(state => state.user);
  const owner = useSelector(state => state.owner);

  const logoutHandler = () => {
    axios.get(`${USER_SERVER}/logout`).then(response => {
      if (response.status === 200) {
        props.history.push("/login");
      } else {
        alert('Log Out Failed')
      }
    });
  };
  
 
  

  const historyClickHandler = () => {
    props.history.push('/history');
  }

  const userClickHandler = () => {
    props.history.push('/user');
  }

  const cartClickHandler = () => {
    props.history.push('/cart');
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
              <Icon type="shopping-cart" style={{ fontSize: 30, marginBottom: 3}} onClick={cartClickHandler} />
            </Tooltip>
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

