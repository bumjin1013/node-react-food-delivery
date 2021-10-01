import React, { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';
import axios from 'axios';
import { Col, Card, Row, PageHeader, Rate } from "antd";
import Meta from "antd/lib/card/Meta";
import Distance from '../../../utils/Distance';
function StoreListPage(props) {

  useEffect(() => {
      axios.get(`/api/store/category?category=${category}`).then((response) => {
          setStoreList(response.data.store);   
        })
      .catch((err) => alert(err));
  }, []);

  const [StoreList, setStoreList] = useState([]);
  const category = props.match.params.category;
  const userAddress = useSelector(state => state.user.userData && state.user.userData.address);

  //DB카테고리 한글로 변경
  let Category;

  switch(category) {
    case "korean":
      Category = "한식";
      break;
    case "bunsick":
      Category = "분식";
      break;
    case "chinese":
      Category = "중식";
      break;
    case "chicken":
      Category = "치킨";
      break;
    case "pizza":
      Category = "피자";
      break;
    case "burger":
      Category = "햄버거";
      break;  
  } 
  
  

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

    //유저와 상점 직선거리 
    const distance = () => {
      if(store && userAddress){
        return (
          <Distance storeAddress={store.address} myAddress={userAddress} style={{float: 'right'}} />
        )
      } else {
        return (
        null
        )
      }
    }
  
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
              <div>
                <Rate allowHalf value={Star} disabled={true} key={index}/>
                <br/>
                <h4>{store.title}({Star}) </h4>
                {distance()}m
              </div> 
            }
          />
        </Card>
      </Col>
    );
  });
      

  return (
    <div style={{ width: '1000px', margin: '3rem auto' }}>
       <PageHeader
        style={{
        border: '1px solid rgb(235, 237, 240)',
        }}
        onBack={() => window.history.back()}
        title={Category}
      />
      <br />
      <Row gutter={[16, 16]}>{renderStore}</Row>
        
    </div>
  )
}

export default StoreListPage
