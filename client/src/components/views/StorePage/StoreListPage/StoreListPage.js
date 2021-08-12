import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Col, Card, Row, PageHeader, Rate } from "antd";
import Meta from "antd/lib/card/Meta";

function StoreListPage(props) {

  useEffect(() => {
      axios.get(`/api/store/category?category=${category}`).then((response) => {
          setStoreList(response.data.store);   
        })
      .catch((err) => alert(err));
  }, []);

  const [StoreList, setStoreList] = useState([]);
  const category = props.match.params.category;

  const renderStore = StoreList.map((store, index) => {
    
    console.log('rednerStore', store);

    //별점 계산
    let totalStar = 0;

    for(let i=0; i<store.review.length; i++){
      totalStar += store.review[i].star
    }

    // 평균 별점
    let Star;
    //리뷰가 1개 이상이면 더한 총 별점 / 리뷰 갯수 = Star , 리뷰가 없으면 0
    store.review.length > 0 ? Star = (totalStar/store.review.length).toFixed(1) : Star = 0
  
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
          <Meta 
            title={
              <h4>
                <Rate value={Star} disabled={true} key={index}/>
                <br/>
                {store.title}({Star})
                
              </h4> 
            } 
          />
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
        title={category}
      />
      <br />
      <Row gutter={[16, 16]}>{renderStore}</Row>
        
    </div>
  )
}

export default StoreListPage
