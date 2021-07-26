import React,{ useState } from 'react'
import { Menu } from 'antd';

function MenuBar() {
  
  const [Current, setCurrent] = useState('order');

  const handleClick = (event) => {
    setCurrent(event.key);
  };


  return (
    <div>
      <Menu theme="dark" onClick={handleClick} selectedKeys={[Current]} mode="horizontal">
        <Menu.Item key="order" >
          <a href="/owner/order">
            주문 관리
          </a>
        </Menu.Item>
        
        <Menu.Item key="menu" >
          <a href="/owner/menu">
            메뉴 관리
          </a>
        </Menu.Item>
          
        <Menu.Item key="review" >
          <a href="/owner/review">
            리뷰 관리
          </a>
        </Menu.Item>

        <Menu.Item key="storeSetting" >
          <a href="/owner/setting">
            상점 관리
          </a>
        </Menu.Item>
      </Menu>
    </div>
  )
}

export default MenuBar
