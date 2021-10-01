import React, { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import axios from 'axios';
import { Col, Card, Rate } from 'antd';
import Distance from '../../../../utils/Distance';
import Meta from "antd/lib/card/Meta";

function Store(props) {

    const userAddress = useSelector(state => state.user.userData && state.user.userData.address);
    const store = props.store;
    const []
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
        if(store.address && userAddress){
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
        <Col lg={6} md={8} xs={24} key={store.storeId}>
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
                        <Rate allowHalf value={Star} disabled={true} key={store.storeId}/>
                        <br/>
                        <h4>{store.title}({Star}) </h4>
                        {distance()}m
                    </div> 
                }
            />
            </Card>
        </Col>
    );

}

export default Store
