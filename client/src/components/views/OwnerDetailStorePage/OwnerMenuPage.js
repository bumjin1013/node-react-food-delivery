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
    setChangedPrice(event.currentTarget.value);
  }

  //radio버튼 선택후 메뉴 수정 버튼 누를시
  const showModal = () => {
    //선택 Radio Button 메뉴의 정보 (Selected[0]에 담김), 그 내용들을 ChangedName, ChangedPrice에 담아주어 Default로 넣어줌
    //이렇게 안하고 모달창을 띄워버리면 Input에 Default값으로 해당 메뉴의 이름과 가격의 값이 출력되긴하나 확인버튼을 누르면
    //서버에 ChangedName과 ChangedPrice의 값의 null로 입력되어있어 그 상태로 update가 되어버림 
    setChangedName(Selected[0].name); 
    setChangedPrice(Selected[0].price);
    setIsModalVisible(true);
  };

  //모달창 끄기
  const handleCancel = () => {
    setIsModalVisible(false);
  };

  //메뉴 수정 버튼 클릭시
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
          alert('메뉴를 수정하였습니다.');
        } else {
          alert('메뉴 수정에 실패하였습니다.');
        }
      })
    setIsModalVisible(false);
  }

  //메뉴 삭제 버튼 클릭시 
  const deleteHandler = (event) => {
    event.preventDefault();

    const body = {
      menuId: Selected[0]._id,
      storeId: Store._id
    }

    axios.post('/api/store/deletemenu', body)
      .then(response => {
        if (response.data.success) {
          alert('메뉴를 삭제하였습니다.');
          window.location.reload()
        } else {
          alert('메뉴 삭제에 실패하였습니다.');
        }
      })
  }

  //메뉴 상태 변경 버튼 클릭시
  const stateChangeHandler = (event) => {

    let CurrentState;
  
    Selected[0].state ? CurrentState = false : CurrentState = true;

    event.preventDefault();

    const body = {
      storeId: Store._id,
      menuId: Selected[0]._id,
      state: CurrentState
    }

    axios.post('/api/store/changestate', body)
      .then(response => {
        if (response.data.success) {
          alert(Selected[0].name + '의 상태를 변경하였습니다.');
          window.location.reload();
        } else {
          alert('상태 변경에 실패하였습니다.');
        }
      })
  }

  
  //메뉴 수정 모달 렌더링
  const renderEditMenu = Selected.map((item, index) => {

    return(
      <div style={{textAlign:'center'}} > 
        <img style={{ maxWidth: '60%' }} src={`http://localhost:5000/${Selected[index].image}`}/>
        <br/>
        <div style={{textAlign:'left'}}>
        메뉴 : <Input defaultValue={ChangedName} onChange={menuChangeHandler}/>
        가격 : <Input defaultValue={ChangedPrice} onChange={priceChangeHandler}/>
        </div>
      </div>
    )
  })

  
  //테이블 columns
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
    },
    {
      title: '상태',
      dataIndex: 'state',
      key: 'state',
      render: (text, menu) => {

        let CurrentState;
        
        menu.state ? CurrentState = "판매중" : CurrentState = "품절"
        return (
          <div>
            {CurrentState}
          </div>
       );},
    }
  ];

  const rowSelection = {
    onChange: (selectedRowKeys, selectedRows) => {
      console.log(`selectedRowKeys: ${selectedRowKeys}`, 'selectedRows: ', selectedRows);
      setSelected(selectedRows);
      
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
       <Menu.Item key="1">
        <a href={`/store/${Store._id}/detail`}>
          {Store.title}
        </a>
      </Menu.Item>
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
         <div style={{textAlign:'left'}}>
          <Button type="primary" style={{margin: '3px', textAlign:'right'}}>
            <a href={`/store/${Store._id}/menu/add`} >메뉴 추가</a>
          </Button>
             
          <Button onClick={showModal} style={{margin: '3px'}}> 
            선택 수정
          </Button>

          <Button type="danger" onClick={deleteHandler} style={{margin: '3px'}}> 
            선택 삭제
          </Button>

          <Button type="primary" onClick={stateChangeHandler} style={{margin: '3px'}}> 
            상태 변경
          </Button>
        </div>
        <br />

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
