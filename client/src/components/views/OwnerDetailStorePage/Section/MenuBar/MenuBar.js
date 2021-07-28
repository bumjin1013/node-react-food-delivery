import React,{ useState, useEffect } from 'react'
import { Menu, Icon, Button } from 'antd';

const { SubMenu } = Menu;



function MenuBar() {


  const [Collapsed, setCollapsed] = useState(false)

  const toggleCollapsed = () => {
    setCollapsed(!Collapsed)
  };

  return (
    <div>
      <div style={{ width: 256 }}>
       
        <Menu
          defaultSelectedKeys={['1']}
          defaultOpenKeys={['sub1']}
          mode="inline"
          theme="dark"
          inlineCollapsed={Collapsed}
        >
          <SubMenu
            key="order"
            title={
              <span>
                <Icon type="alert" />
                <span>주문관리</span>
              </span>
            }
          >
            <Menu.Item key="5">주문현황</Menu.Item>
            <Menu.Item key="6">이전주문</Menu.Item>
          </SubMenu>
          
          <SubMenu
            key="sub2"
            title={
              <span>
                <Icon type="appstore" />
                <span>Navigation Two</span>
              </span>
            }
          >
            <Menu.Item key="9">Option 9</Menu.Item>
            <Menu.Item key="10">Option 10</Menu.Item>
            <SubMenu key="sub3" title="Submenu">
              <Menu.Item key="11">Option 11</Menu.Item>
              <Menu.Item key="12">Option 12</Menu.Item>
            </SubMenu>

            

          </SubMenu>

        
          <Menu.Item key="6">
            <Icon type="menu" />
          
            <span>메뉴관리</span>
          </Menu.Item>
           
         
        </Menu>
      </div>
      <Button type="primary" onClick={toggleCollapsed} style={{ marginBottom: 16 }}>
          <Icon type={Collapsed ? 'menu-unfold' : 'menu-fold'} />
        </Button>
    </div>
  )
}


export default MenuBar

