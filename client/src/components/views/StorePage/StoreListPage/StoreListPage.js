import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Col, Card, Row, PageHeader } from "antd";
import Meta from "antd/lib/card/Meta";
function StoreListPage() {

    
    
  useEffect(() => {
      axios.get("/api/store/chicken").then((response) => {
          setStoreList(response.data.store);   
        })
      .catch((err) => alert(err));
  }, []);

  const [StoreList, setStoreList] = useState([]);

  const renderStore = StoreList.map((store, index) => {
    
    console.log('rednerStore', store);

    return (
      <Col lg={6} md={8} xs={24} key={index}>
        <Card
          hoverable
          cover={
            <a href={`/store/${store._id}/detail`}>
              <img
                style={{ width: "100%", maxHeight: "150px" }}
                src={`http://localhost:5000/${store.image[0]}`}
              />
            </a>
          }
        >
          <Meta title={store.title} />
        </Card>
      </Col>
    );
  });
      

  return (
    <div style={{ width: "75%", margin: "3rem auto" }}>
       <PageHeader
        style={{
        border: '1px solid rgb(235, 237, 240)',
        }}
        onBack={() => window.history.back()}
        title="치킨"
      />
      <br />
      <Row gutter={[16, 16]}>{renderStore}</Row>
        
    </div>
  )
}

export default StoreListPage
