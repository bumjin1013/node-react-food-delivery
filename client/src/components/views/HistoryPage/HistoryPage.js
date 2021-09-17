import React, { useState, useEffect } from 'react';
import { Card, Row, Col, Icon, Form, Input, Modal, Rate, Button, Tooltip, Divider } from 'antd';
import axios from 'axios';
import moment from 'moment';
import FileUpload from '../../utils/FileUpload';
import History from './Section/History';

function HistoryPage(props) {

  useEffect(() => {
    axios.get("/api/users/history").then((response) => {
      if (response.data.success) {
        setHistoryList(response.data.history.history); 
  
      } else {
        alert(" 상점을 로드하는데 실패하였습니다. ");
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