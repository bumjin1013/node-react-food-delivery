import React, { useEffect, useState } from 'react'
import { Layout, Menu, Breadcrumb, Icon, Table, Tag, Divider, Button } from 'antd';
import axios from 'axios';
import { updateLocale } from 'moment';
const { SubMenu } = Menu;
const { Header, Content, Sider } = Layout;


function OwnerMenuPage(props) {

  
  useEffect(() => {
    axios.get(`/api/store/stores_by_id?id=${storeId}&type=single`)
      .then((response) => {
        setStore(response.data[0]);
        setListMenu(response.data[0].menu);
      })
      .catch((err) => alert(err));

     
  }, []);

  const storeId = props.match.params.storeId;
  const [Store, setStore] = useState({});
  const [ListMenu, setListMenu] = useState([]);
  const [EditMenu, setEditMenu] = useState([]);

  const menuEditor = ListMenu.map((menu, index) => {

    setEditMenu[index](menu)

  })

  
  const columns = [
    {
      title: '사진',
      dataIndex: 'image',
      key: 'image',
      render: (text, menu) => {
        return (
         <div>
         <img style={{ maxWidth: '10%' }}src={`http://localhost:5000/${menu.image}`}/>
         
         </div>
       );},
    },
    {
      title: '상품명',
      dataIndex: 'name',
      key: 'name'
    },
    {
      title: '가격',
      dataIndex: 'price',
      key: 'price',
    }
  ];

    return (
      <div>
        <Layout>
            <Header className="header">
      <div className="logo" />

    <Menu
      theme="dark"
      mode="horizontal"
      
      style={{ lineHeight: '64px' }}
    >
      <Menu.Item key="1">nav 1</Menu.Item>
    </Menu>
    </Header>
    <Layout>
      <Sider width={200} style={{ background: '#fff' }}>
        <Menu
          mode="inline"
          defaultSelectedKeys={['3']}
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
  
         {/* Menu Table 생성 */}
          <Table columns={columns} dataSource={ListMenu} />
  
        
          <Button type="primary">
            <a href={`/store/${Store._id}/menu/add`} >메뉴 추가</a>
          </Button>
          
        
          
          
        </Content>
      </Layout>
    </Layout>
  </Layout>
        </div>
    )
}

export default OwnerMenuPage
