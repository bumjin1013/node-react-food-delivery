import React, { useState, useEffect } from 'react';
import LeftMenu from './Sections/LeftMenu';
import RightMenu from './Sections/RightMenu';
import Location from './Sections/Location';
import { Drawer, Button, Icon } from 'antd';
import './Sections/Navbar.css';
import { useDispatch, useSelector } from "react-redux";
import { getHistory } from "../../../_actions/user_actions";
import Socket from './Sections/Socket';

function NavBar() {

  //실시간 주문상태 통신을 위한 socket연결
  const user = useSelector(state => state.user);
  const dispatch = useDispatch();

  useEffect(() => {

    if(user.userData && user.userData.isAuth){
      dispatch(getHistory());
    }
  }, [])

  const [visible, setVisible] = useState(false)

  const showDrawer = () => {
    setVisible(true)
  };

  const onClose = () => {
    setVisible(false)
  };
  
  return (
    <nav className="menu" style={{ position: 'fixed', zIndex: 5, width: '100%' }}>
      {/* 로그인 한 상태일 시 로그인 한 유저의 주문정보를 Socket 컴포넌트로 전달 */}
      {user.userData && user.userData.history ? user.userData && user.userData.history.map((history, index) => (
        (!history.responseTo &&
          <React.Fragment key={index}>
              <Socket history={history} />
          </React.Fragment>
      ))) : null}
      <div className="menu__logo">
        <a href="/">오늘 뭐먹지?</a>
      </div>
      <div className="menu__container">
        <div className="menu_left">
          <LeftMenu mode="horizontal" />
        </div>
        <div className="menu_rigth">
          <RightMenu mode="horizontal" />
        </div>
        <Button
          className="menu__mobile-button"
          type="primary"
          onClick={showDrawer}
        >
          <Icon type="align-right" />
        </Button>
        <Drawer
          title="Basic Drawer"
          placement="right"
          className="menu_drawer"
          closable={false}
          onClose={onClose}
          visible={visible}
        >
          <LeftMenu mode="inline" />
          <Location />
          <RightMenu mode="inline" />
        </Drawer>
      </div>
    </nav>
  )
}

export default NavBar