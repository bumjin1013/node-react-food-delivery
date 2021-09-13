import React, { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux';
import { Layout, Menu, Breadcrumb, Icon, Table, Modal, Form, Button, Input } from 'antd';
import axios from 'axios';
import { updateLocale } from 'moment';
import { getMenu, changeState, changeMenu, deleteMenu } from '../../../_actions/store_actions';
const { SubMenu } = Menu;
const { Header, Content, Sider } = Layout;

function OwnerMenuPage(props) {

    const dispatch = useDispatch();
    const storeId = props.match.params.storeId;

    useEffect(() => {
        dispatch(getMenu(storeId));
    }, []);

    const menu = useSelector(state => state.store.menu);
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
       
        setIsModalVisible(true);
        setChangedName(Selected[0].name); 
        setChangedPrice(Selected[0].price);
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

        dispatch(changeMenu(body));

        setIsModalVisible(false);
    }

    //메뉴 삭제 버튼 클릭시 
    const deleteHandler = (event) => {
        event.preventDefault();

        const body = {
            menuId: Selected[0]._id,
            storeId: storeId
        }

        dispatch(deleteMenu(body));
    } 

    //메뉴 상태 변경 버튼 클릭시
    const stateChangeHandler = (event) => {
       
        let CurrentState;
        Selected[0].state ? CurrentState = false : CurrentState = true;
        const body = {
            storeId: storeId,
            menuId: Selected[0]._id,
            state: CurrentState
        }   
        dispatch(changeState(body))
    }

  
    //메뉴 수정 모달 렌더링
    const renderEditMenu = Selected.map((item, index) => {

        return(
            <div style={{textAlign:'center'}} > 
                <img style={{ maxWidth: '60%' }} src={`http://localhost:5000/${Selected[index].image}`}/>
                <br/>
                <div style={{textAlign:'center'}}>
                    메뉴 : <Input defaultValue={Selected[0].name} onChange={menuChangeHandler} style={{width:'200px'}}/>
                    <br />
                    가격 : <Input defaultValue={Selected[0].price} onChange={priceChangeHandler} style={{width:'200px'}}/>
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
                <a href={`/store/${storeId}/order/proceeding`} >주문현황</a>
            </Menu.Item>
            <Menu.Item key="2">
                <a href={`/store/${storeId}/order/completed`} >이전주문</a>
            </Menu.Item>
          </SubMenu>
            <Menu.Item key="3">
                <a href={`/store/${storeId}/menu`} >메뉴관리</a>
            </Menu.Item>
            <Menu.Item key="4">
                <a href={`/store/${storeId}/review`} >리뷰관리</a>
            </Menu.Item>
            <Menu.Item key="5">
                <a href={`/store/${storeId}/setting`} >상점관리</a>
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
            <a href={`/store/${storeId}/menu/add`} >메뉴 추가</a>
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

          <Table rowSelection={rowSelection} columns={columns} dataSource={menu} />
          
          {/*메뉴 수정 클릭시 나오는 모달 창 */}
          <Modal title="메뉴 수정" visible={IsModalVisible} onOk={updateMenu} onCancel={handleCancel} destroyOnClose={true}>
            <Form.Item>
              {renderEditMenu}
            </Form.Item>
          </Modal>
     
        </Content>
      </Layout>
    </Layout>

        </div>
    )
}

export default OwnerMenuPage
