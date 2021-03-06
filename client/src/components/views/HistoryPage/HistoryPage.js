import React, { useState, useEffect } from 'react';
import { Icon } from 'antd';
import axios from 'axios';
import History from './Section/History';
import { io } from 'socket.io-client';

function HistoryPage(props) {

  
  useEffect(() => {
    axios.get("/api/users/history").then((response) => {
      if (response.data) {
        setHistoryList(response.data); 
      } else {
        alert("주문내역을 로드하는데 실패하였습니다. ");
      }
    });

  }, []);
  
  const [HistoryList, setHistoryList] = useState([]);
  
  

  return (

    
    <div style={{ width: '60%', margin: '3rem auto' }}>
      <h2> <Icon type="read"/> 주문내역 </h2>      
        {HistoryList && HistoryList.slice(0).reverse().map((history, index) => (
        (!history.responseTo &&
        <React.Fragment key={index}>
            <History history={history} writer={props.user.userData.nickname} />
        </React.Fragment>
      )))}
    </div>


  )
}

export default HistoryPage