import React, { useState, useEffect, useRef } from 'react';
import { Card, Row, Col, Icon, Form, Input, Modal, Rate, Button, Tooltip, Divider } from 'antd';
import axios from 'axios';
import moment from 'moment';
import FileUpload from '../../../utils/FileUpload';
import { useDispatch, useSelector } from 'react-redux';
import Dropzone from 'react-dropzone';
import { getChats, afterPostMessage } from '../../../../_actions/chat_actions';
import ChatCard from './ChatCard';
import { io } from 'socket.io-client';

function History(props) {

    const dispatch = useDispatch();
    const chat = useSelector(state => state.chat);
    const user = useSelector(state => state.user);
    const socket = io("http://localhost:5000"); //connet client-to-server
    const [ChatMessage, setChatMessage] = useState("")

    const messagesEnd = useRef(null);

    const renderCards = () => 
        chat.chats && chat.chats.map((chats) => (
            <ChatCard key={chats._id} {...chats}/>
    ));

    useEffect(() => {
        dispatch(getChats())
   
        socket.on("Output Chat Message", messageFromBackEnd => {
            console.log(messageFromBackEnd);
            dispatch(afterPostMessage(messageFromBackEnd))
        })
    }, [])

    useEffect(() => {

        //messagesEnd.current.scrollIntoView({behavior: 'smooth'});
  
      }, [renderCards()])


    const handleSearchCHange = (event) => {
        setChatMessage(event.target.value);
    }

    const submitChatMessage = (event) => {
        event.preventDefault();

        let chatMessage = ChatMessage;
        let userId = user.userData._id;
        let userName = user.userData.name;
        let userImage = user.userData.image;
        let nowTime = moment();
        let type = "Text";

        socket.emit("Input Chat Message", {
            chatMessage,
            userId,
            userName,
            userImage,
            nowTime,
            type
        });
        setChatMessage("");
    }

    console.log(ChatMessage);
    const onDrop = (files) => {
        console.log(files)


        if (props.user.userData && !props.user.userData.isAuth) {
            return alert('Please Log in first');
        }



        let formData = new FormData;

        const config = {
            header: { 'content-type': 'multipart/form-data' }
        }

        formData.append("file", files[0])

        axios.post('/api/chat/uploadfiles', formData, config)
            .then(response => {
                if (response.data.success) {
                    let chatMessage = response.data.url;
                    let userId = user.userData._id
                    let userName = user.userData.name;
                    let userImage = user.userData.image;
                    let nowTime = moment();
                    let type = "VideoOrImage"

                    socket.emit("Input Chat Message", {
                        chatMessage,
                        userId,
                        userName,
                        userImage,
                        nowTime,
                        type
                    });
                }
            })
    }
    //리뷰 모달창 초기 flase
    const [IsModalVisible, setIsModalVisible] = useState(false);
    //채팅 모달창 초기 false
    const [IsChatVisible, setIsChatVisible] = useState(false);
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
    //채팅 모달창 열기
    const openChat = () => {
        setIsChatVisible(true);
    }
    //채팅 모달창 닫기
    const ChatCancel = () => {
        setIsChatVisible(false);
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
            <Card title={props.history.storeName}  style={{ width: 'auto' }} extra={"주문일시: "+moment(props.history.orderTime).format('YY년MM월DD일 HH시mm분')}>
                <div>
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

                <Button onClick={openChat}>사장님과 연락하기</Button> 
                
            {/* 채팅 모달창*/}
            <Modal title="채팅창" visible={IsChatVisible} onCancel={ChatCancel}>
                <div style={{ maxWidth: '800px', margin: '0 auto' }}>
                <div className="infinite-container" style={{ height: '500px', overflowY:' scroll' }}>
                    {chat && (
                        <div>{renderCards()}</div>
                    )} 
                <div
                    ref={messagesEnd}
                    style={{ float: "left", clear: "both" }}
                
                />
                </div>
                <Row >
                    <Form layout="inline" onSubmit={submitChatMessage}>
                        <Col span={18}>
                            <Input
                                id="message"
                                prefix={<Icon type="message" style={{ color: 'rgba(0,0,0,.25)' }} />}
                                placeholder="Let's start talking"
                                type="text"
                                value={ChatMessage}
                                onChange={handleSearchCHange}

                            />
                        </Col>

                        <Col span={2}>
                            <Dropzone onDrop={onDrop}>
                                {({ getRootProps, getInputProps }) => (
                                    <section>
                                        <div {...getRootProps()}>
                                            <input {...getInputProps()} />
                                                <Button>
                                                    <Icon type="upload" />
                                                </Button>
                                        </div>
                                    </section>
                                )}
                            </Dropzone>       
                        </Col>

                        <Col span={4}>
                            <Button type="primary" style={{ width: '100%' }} onClick={submitChatMessage} htmlType="submit">
                                <Icon type="enter" />
                            </Button>
                        </Col>
                    </Form>
                </Row>
            </div>
                
            </Modal>

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
                    <Rate value={props.history.review[0].star} disabled={true}/>
                    <br/>
                    {props.history.review[0].image.length > 0 ?
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
