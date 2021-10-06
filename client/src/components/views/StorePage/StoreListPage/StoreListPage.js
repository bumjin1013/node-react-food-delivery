import React, { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';
import axios from 'axios';
import { Col, Card, Row, PageHeader, Rate } from "antd";
import Store from './Section/Store';
function StoreListPage(props) {

  const userAddress = useSelector(state => state.user.userData && state.user.userData.isAuth ? state.user.userData.address.address : null);
  
  console.log(userAddress);
  
  useEffect(() => {

    if(userAddress){
      axios.get(`/api/store/category?category=${category}&address=${userAddress}`).then((response) => {
          setStoreList(response.data.store);   
        })
      .catch((err) => alert(err));
    }
  }, [userAddress]);

  const [StoreList, setStoreList] = useState([]);
  const category = props.match.params.category;
  

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
      <Row gutter={[16, 16]}>
        {StoreList && StoreList.map((store, index) => (
          <Store store={store}/>
        ))}
      </Row>
        
    </div>
  )
}

export default StoreListPage
