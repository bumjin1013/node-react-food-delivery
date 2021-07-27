import React, { useEffect, useState } from 'react'
import { Layout, Menu, Breadcrumb, Icon, Form, Input } from 'antd';
import axios from 'axios';
import FileUpload from '../../../utils/FileUpload';

const { SubMenu } = Menu;
const { Header, Content, Sider } = Layout;

function OwnerMenuPage(props) {

  useEffect(() => {
    axios.get(`/api/store/stores_by_id?id=${storeId}&type=single`)
      .then((response) => {
        setStore(response.data[0]);
        console.log(response.data[0])
      })
      .catch((err) => alert(err));

     
  }, []);

  const storeId = props.match.params.storeId;
  const [Store, setStore] = useState({});
  const [Name, setName] = useState('');
  const [Price, setPrice] = useState('');
  const [Image, setImage] = useState([]);
  
  const nameChangeHandler = (event) => {
    setName(event.currentTarget.value)
}

const priceChangeHandler = (event) => {
    setPrice(event.currentTarget.value)
}

const updateImage = (newImage) => {
    setImage(newImage)
}

const submitHandler = (event) => {
    event.preventDefault();

    if (!Name || !Price ) {
        return alert(" 메뉴 이름과 가격을 입력해 주세요.")
    }


    //서버에 채운 값들을 request로 보낸다.

    const body = {
        // 상점 id
        id: Store._id,
        name: Name,
        price: Price,
        image: Image
    }


    axios.post('/api/store/addMenu', body)
        .then(response => {
            if (response.data.success) {
                alert('메뉴 업로드에 성공 했습니다.')
                props.history.push(`/store/${Store._id}/menu`)
            } else {
                alert('메뉴 업로드에 실패 했습니다.')
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
            {/* Contents */}
            <Form onSubmit={submitHandler}>
                <label>메뉴 사진</label>
                {/* DropZone */}
                <FileUpload refreshFunction={updateImage} />

                <br />
                <br />
                <label>메뉴 이름</label>
                <Input onChange={nameChangeHandler} value={Name} />
                <br />
                <br />
                <label>가격</label>
                <Input onChange={priceChangeHandler} value={Price} />
                <br />
                <br />
                <button type="submit">
                    확인
                </button>
            </Form>
        </Content>
      </Layout>
    </Layout>
  </Layout>
        </div>
    )
}

export default OwnerMenuPage
