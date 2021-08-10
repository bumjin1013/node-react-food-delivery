import React, { useState, useEffect } from 'react';
import { Card, Row, Col, Icon, Form, Input, Modal, Rate, Button, Tooltip, Divider } from 'antd';
import axios from 'axios';
import moment from 'moment';
import FileUpload from '../../utils/FileUpload';

function HistoryPage(props) {

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
  const [IsModalVisible, setIsModalVisible] = useState(false);
  const [Contents, setContents] = useState("");
  const [Star, setStar] = useState("5");
  const [Image, setImage] = useState([]);
  const [Review, setReview] = useState(false);
  const [showReviewModal, setShowReviewModal] = useState(false);

  //리뷰 내용
  const contentsChangeHandler = (event) => {
    setContents(event.currentTarget.value)
  }
  //모달창 열기
  const showModal = () => {
    setIsModalVisible(true);
  };
  //모달창 닫기
  const handleCancel = () => {
    setIsModalVisible(false);
  };
  //별점 
  const starChangeHandler = (value) => {
    setStar(value)
  }
  //multer사용을 위한 이미지
  const updateImage = (newImage) => {
    setImage(newImage)
  }

  //리뷰 보기 버튼 클릭 시 
  const showReview = () => {
    //작성한 리뷰의 모달창 Show
    setShowReviewModal(true)
  }

  //모달창 닫기 버튼 클릭 시 
  const closeReviewModal = () => {
    setShowReviewModal(false);
  }



 

  //주문내역 랜더링
  const renderHistory = History.map((history, index) => {
    
    //메뉴 내역 String으로 출력하기 위해 menuList선언
    let menuList = ""

    //for문 돌려서 주문내역을 하나의 String으로 합침
    for(let i=0; i<history.menu.length; i++){
      menuList += history.menu[i].name + "-" + history.menu[i].quantity + "개  ";
    }

    const reviewHandler = (event) => {
      event.preventDefault();
      
      //body에 리뷰 관련 정보 저장
      const body ={
        id: history.storeId,
        image: Image,
        writer: props.user.userData.nickname,
        star: Star,
        contents: Contents,
        orderId: history.orderId
      }


      //저장한 정보들을 addreview 라우터로 전송
      axios.post('/api/store/addreview', body) && axios.post('/api/users/addreview', body)
        .then(response => {
          if (response.data.success) {
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
      <div key={index}>
        <Card title={history.storeName}  style={{ width: 'auto' }} extra={"주문일시: "+moment(history.orderTime).format('YY년MM월DD일 HH시mm분')}>
          <div>
          주소 : {history.address}
          <br/>
          메뉴 : {menuList}
          <br/>
          주문가격 : {history.price} 원
          <br/>
          사장님께 : {history.toOwner}
          <br/>
          배달기사께 : {history.toRider}

          </div>
          

          {/* 리뷰를 작성한 경우에는 리뷰작성 버튼 보이지 않음 reviewAuth = false */}
          {history.reviewAuth ? 
            <Button type="primary" onClick={showModal}>
              리뷰 작성하기
            </Button> : 
             <div>
             <Divider />
             <h4>작성한 리뷰</h4>
             작성일자: {moment(history.review[0].orderTime).format('YY년MM월DD일 HH시mm분')}
             <br/>
             <Rate value={history.review[0].star} disabled={true}/>
             <br/>
             <img src={`http://localhost:5000/${history.review[0].image[0]}`} style={{width: "15%", maxHeight: "150px"}} />
             <br/>
             내용: {history.review[0].contents}
           </div> 
          }

          <Modal title="리뷰 작성" visible={IsModalVisible} onOk={reviewHandler} onCancel={handleCancel} >
            별점 : <Rate allowHalf defaultValue={5} onChange={starChangeHandler} value={Star}/>
            <br />
            <div>
              <FileUpload refreshFunction={updateImage} />
            </div>    
            <Form.Item name={['user', 'introduction']} label="내용">
              <Input.TextArea onChange={contentsChangeHandler} value={Contents} />
            </Form.Item>
          </Modal>

          
        </Card>
        <br/>
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