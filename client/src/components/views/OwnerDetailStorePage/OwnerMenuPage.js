import React, { useEffect, useState } from 'react'
import { Layout, Menu, Breadcrumb, Icon, Table, Modal, Form, Button, Input } from 'antd';
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
  const [IsModalVisible, setIsModalVisible] = useState(false);
  const [Selected, setSelected] = useState([]);
  const [ChangedName, setChangedName] = useState();
  const [ChangedPrice, setChangedPrice] = useState();
  

  const menuChangeHandler = (event) => {
    setChangedName(event.currentTarget.value);
  }

  const priceChangeHandler = (event) => {
    setChangedPrice(event.currentTarget.value)
  }

  const showModal = () => {
    
    setChangedName(Selected[0].name);
    setChangedPrice(Selected[0].price);
    setIsModalVisible(true);
  };

  const handleCancel = () => {
    setIsModalVisible(false);
  };

  const updateMenu = (event) => {
    event.preventDefault();

    const body = {
      storeId: storeId,
      menuId: Selected[0]._id,
      name:  ChangedName,
      price: ChangedPrice
    }

    axios.post('/api/store/updatemenu', body)
      .then(response => {
        if (response.data.success) {
          alert('메뉴를 수정하였습니다.')
        } else {
          alert('메뉴 수정에 실패하였습니다.')
        }
      })
    setIsModalVisible(false);
  }

  const deleteHandler = (event) => {
    event.preventDefault();

    const body = {
      menuId: Selected[0]._id,
      storeId: Store._id
    }

    axios.post('/api/store/deletemenu', body)
      .then(response => {
        if (response.data.success) {
          alert('메뉴를 삭제하였습니다.')
          window.location.reload()
        } else {
          alert('메뉴 삭제에 실패하였습니다.')
        }
      })

      
  }

  

  const renderEditMenu = Selected.map((item, index) => {

    return(
      <div style={{textAlign:'center'}}> 
        <img style={{ maxWidth: '60%' }} src={`http://localhost:5000/${Selected[index].image}`}/>
        <br/>
        <div style={{textAlign:'left'}}>
        메뉴 : <Input defaultValue={ChangedName} onChange={menuChangeHandler}/>
        가격 : <Input defaultValue={ChangedPrice} onChange={priceChangeHandler}/>
        </div>
      </div>
    )
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

  const rowSelection = {
    onChange: (selectedRowKeys, selectedRows) => {
      console.log(`selectedRowKeys: ${selectedRowKeys}`, 'selectedRows: ', selectedRows);
      setSelected(selectedRows);
      console.log(Selected);
      
    },
    getCheckboxProps: record => ({
      disabled: record.name === 'Disabled User', // Column configuration not to be checked
      name: record.name
    }),
    type: 'radio'
  };

  

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
          <Button type="primary">
            <a href={`/store/${Store._id}/menu/add`} >메뉴 추가</a>
          </Button>
             
          <Button onClick={showModal}> 
            메뉴 수정
          </Button>

          <Button type="danger" onClick={deleteHandler}> 
            선택 삭제
          </Button>

          <br/>
          <br/>

          <Table rowSelection={rowSelection} columns={columns} dataSource={ListMenu} />
          
          {/*메뉴 수정 클릭시 나오는 모달 창 */}
          <Modal title="메뉴 수정" visible={IsModalVisible} onOk={updateMenu} onCancel={handleCancel}>
            <Form.Item>
              {renderEditMenu}
            </Form.Item>
          </Modal>
     
        </Content>
      </Layout>
    </Layout>
  </Layout>
        </div>
    )
}

export default OwnerMenuPage
