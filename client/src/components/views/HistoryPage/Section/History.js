import React, { useState, useEffect, useRef } from 'react';
import { Card, Row, Col, Icon, Form, Input, Modal, Rate, Button, Tooltip, Divider } from 'antd';
import axios from 'axios';
import moment from 'moment';
import FileUpload from '../../../utils/FileUpload';
import Dropzone from 'react-dropzone';
import { io } from 'socket.io-client';

function History(props) {

    const socket = io(`http://localhost:5000`);

    useEffect(() => {

        socket.on("Output Update State", dataFromBackEnd => { 
            console.log('backend', dataFromBackEnd.state);
          })

    })
    //리뷰 모달창 초기 flase
    const [IsModalVisible, setIsModalVisible] = useState(false);
    const [Contents, setContents] = useState("");
    //별점 초기 5점
    const [Star, setStar] = useState("5");
    //Image State
    const [Image, setImage] = useState([]);
    //multer사용을 위한 이미지
    const updateImage = (newImage) => {
        setImage(newImage)
    }
    //리뷰 내용
    const contentsChangeHandler = (event) => {
        setContents(event.currentTarget.value)
    }
    //리뷰 모달창 열기 - 누른 버튼의 index를 사용해 IsModalVisible의 해당 Index만 true로 변경
    const showModal = () => {
        setIsModalVisible(true);
    }
    //리뷰 모달창 닫기
    const handleCancel = () => {
        setIsModalVisible(false);
    }
    //별점 
    const starChangeHandler = (value) => {
        setStar(value)
    }
    //메뉴 내역 String으로 출력하기 위해 menuList선언
    let menuList = ""

    //for문 돌려서 주문내역을 하나의 String으로 합침
    for(let i=0; i<props.history.menu.length; i++){
        menuList += props.history.menu[i].name + "-" + props.history.menu[i].quantity + "개  ";
    }
    const reviewHandler = (event) => {
        event.preventDefault(event);
        //body에 리뷰 관련 정보 저장
        const body ={
            id: props.history.storeId,
            image: Image,
            writer: props.writer,
            star: Star,
            contents: Contents,
            orderId: props.history.orderId
        }

        //저장한 정보들을 addreview 라우터로 전송
        axios.post('/api/store/addreview', body) && axios.post('/api/users/addreview', body)
            .then(response => {
                if(response.data.success) {
                    alert('리뷰를 성공적으로 등록하였습니다.')
                    window.location.reload();
                } else {
                alert('리뷰 등록에 실패 했습니다.')
                }
            })
        //완료후 모달창 종료
        setIsModalVisible(false);
    }
 
    return(
        <div>
            <Card title={props.history.storeName}  style={{ width: 'auto' }} extra={props.history.state}>
                <div>
                    주문일시 : {moment(props.history.orderTime).format('YY년MM월DD일 HH시mm분')}
                    <br/>
                    주소 : {props.history.address}
                    <br/>
                    메뉴 : {menuList}
                    <br/>
                    주문가격 : {props.history.price} 원
                    <br/>
                    사장님께 : {props.history.toOwner}
                    <br/>
                    배달기사께 : {props.history.toRider}
                </div>
            
            {/* 리뷰 작성 모달창 */}
            <Modal title="리뷰 작성" visible={IsModalVisible} onOk={reviewHandler} onCancel={handleCancel}>
                별점 : <Rate allowHalf defaultValue={5} onChange={starChangeHandler} value={Star}/>
                <br />
                <div>
                    <FileUpload refreshFunction={updateImage} />
                </div>    
                <Form.Item label="내용">
                    <Input.TextArea onChange={contentsChangeHandler} value={Contents} />
                </Form.Item>
            </Modal>
  
            {/* 리뷰를 작성한 경우에는 리뷰작성 버튼 보이지 않음 reviewAuth = false */}
            {props.history.reviewAuth ? 
                <Button type="primary" onClick={showModal}>
                    리뷰 작성하기
                </Button>
                : 
                <div>
                    <Divider />
                    <h4>작성한 리뷰</h4>
                    작성일자: {moment(props.history.review[0].orderTime).format('YY년MM월DD일 HH시mm분')}
                    <br/>
                    <Rate allowHalf value={props.history.review[0].star} disabled={true}/>
                    <br/>
                    {props.history && props.history.review[0].image ?
                    <div>
                        <img src={`http://localhost:5000/${props.history.review[0].image[0]}`} style={{width: "50%", maxHeight: "150px"}} />
                        <br />
                    </div>
                    : null }
                    
                    {props.history.review[0].contents}
                </div> 
            }
            </Card>
            <br/>
        </div>
    )
}

export default History
