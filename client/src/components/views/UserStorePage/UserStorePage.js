import React, { useEffect, useState } from 'react'
import { Layout, Menu, Tabs, Button, PageHeader, Col, Card } from 'antd';
import axios from 'axios';
import { updateLocale } from 'moment';
import Meta from "antd/lib/card/Meta";
const { SubMenu } = Menu;
const { Header, Content, Sider } = Layout;
const { TabPane } = Tabs;

function UserStorePage(props) {

  
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

  const renderMenu = ListMenu.map((menu, index) => {
    
    console.log('renderMemnu', menu);

    return (
      <Col lg={6} md={8} xs={24} key={index}>
        <Card
          hoverable
          cover={
            <a href={`/store/${menu._id}/detail`}>
              <img
                style={{ width: "100%", maxHeight: "150px" }}
                src={`http://localhost:5000/${menu.image[0]}`}
              />
            </a>
          }
        >
          <Meta title={menu.name} />
        </Card>
      </Col>
    );
  });

  

    return (
        <div style={{ width: '75%', margin: '3rem auto' }}>
            <PageHeader
                style={{
                    border: '1px solid rgb(235, 237, 240)',
                }}
                onBack={() => window.history.back()}
                title={Store.title}
            />
                <div style={{ textAlign: 'center' }}>
                    
                    <img style={{ maxWidth: '50%' }} src={`http://localhost:5000/${Store.image}`}/>
                </div >
        
            <Tabs style={{ textAlign: 'center' }} defaultActiveKey="1" >
                <TabPane tab="메뉴" key="1">
                    {renderMenu}
                </TabPane>
             <TabPane tab="정보" key="2">
                Content of Tab Pane 2
            </TabPane>
            <TabPane tab="리뷰" key="3">
                Content of Tab Pane 3
            </TabPane>
            </Tabs>
        </div>

    )
}

export default UserStorePage
