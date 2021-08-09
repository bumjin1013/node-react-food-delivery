import React, { useEffect, useState } from 'react'
import { Layout, Menu, Breadcrumb, Icon, Table, Input, InputNumber, Button, Form } from 'antd';
import axios from 'axios';
import MapContainer from '../../utils/MapContainer';
const { SubMenu } = Menu;
const { Header, Content, Sider } = Layout;

function OwnerStoreSettingPage(props) {
    


  useEffect(() => {
    axios.get(`/api/store/stores_by_id?id=${storeId}&type=single`)
      .then((response) => {
        //상점 정보를 Store state에 넣어줌
        setStore(response.data[0]);

        //현재 DB에 있는 상점 Description을 Description state에 넣어줌.
        setDescription(response.data[0].description);

        setLocation(response.data[0].location.address);
        
      })
      .catch((err) => alert(err));

     
  }, []);

  const storeId = props.match.params.storeId;
  const [Store, setStore] = useState({});
  const [Description, setDescription] = useState();
  const [Location, setLocation] = useState([])

  //수정 버튼을 눌렀을 때 true -> TextArea에 Description내용이 들어가게 해야함, 다시 한번 누르면 false
  const [Edit, setEdit] = useState(false);
  const [ChangedDescription, setChangedDescription] = useState(Description);

  const editClickHandler = () => {
      setEdit(!Edit);
  }

  const descriptionChangeHandler = (event) => {
    setChangedDescription(event.currentTarget.value);
  }

  const editSubmitHandler = () => {
    setEdit(false);
    setDescription(ChangedDescription);

    const body ={
      storeId: storeId,
      description: ChangedDescription
    }

    console.log(body);

    axios.post('/api/store/editstoreinfo', body)
      .then(response => {
        if (response.data.success) {
          alert('상점 정보를 수정하였습니다.')
              } else {
              alert('정보 수정에 실패하였습니다.')
            }
        })
  }

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
          defaultSelectedKeys={['5']}
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

        <Button shape="circle" icon="edit" onClick={editClickHandler}/>
        <br />
        <br />

        {Edit ? 
          <div>
            <Form.Item>
              <Input.TextArea onChange={descriptionChangeHandler} defaultValue={Description} style={{ height: 120 }} />
            </Form.Item> 
            <br />
            <Button shape="circle" icon="check" onClick={editSubmitHandler}/>
          </div>
          : 
          <div style={{whiteSpace: 'pre-wrap'}}>
            {Description}
          </div>
        }
        <br />
        주소 : {Location} 
  
        <MapContainer address={Location} />

        </Content>
      </Layout>
    </Layout>
  </Layout>
        </div>
    )
}

export default OwnerStoreSettingPage
