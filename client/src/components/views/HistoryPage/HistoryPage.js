import React, { useState, useEffect } from 'react';
import { Card, Row, Col, Icon } from 'antd';
import axios from 'axios';
import moment from 'moment';

function HistoryPage() {

    useEffect(() => {
        axios.get("/api/users/history").then((response) => {
          if (response.data.success) {
            setHistory(response.data.history.history); 
          } else {
            alert(" 상점을 로드하는데 실패하였습니다. ");
          }
        });
      }, []);

    const [History, setHistory] = useState([]);
   

    const renderHistory = History.map((history, index) => {

        let menuList = ""

        for(let i=0; i<history.menu.length; i++){
            menuList += history.menu[i].name + "-" + history.menu[i].quantity + "개  ";
        }
        return(
            <div>
                <Card key={index} title={history.storeName}  style={{ width: 'auto' }} extra={"주문일시: "+moment(history.orderTime).format('YY년MM월DD일 HH시mm분')}>
                <p>주문가격: {history.price} 원</p>
                <p></p>
                <p>메뉴 : {menuList}</p>
                </Card>
            </div>
        )
    })

    return (
        <div style={{ width: '60%', margin: '3rem auto' }}>
            <h2> <Icon type="read"/> 주문내역 </h2> 
            
            {renderHistory}
        </div>
    )
}

export default HistoryPage