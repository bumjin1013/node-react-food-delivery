import React, { useState, useEffect } from 'react'
import { Form, Input, Divider, Button, Modal, Card, Radio, Typography } from 'antd';
import axios from 'axios';
const { Title } = Typography;

var IMP = window.IMP; // 생략 가능
IMP.init("imp54545514"); // 예: imp00000000

function OrderPage(props) {

    useEffect(() => {
        axios.get("/api/users/payments").then((response) => {
          if (response.data.success) {
            setCart(response.data.paymentsInfo.cart);
            setCoupon(response.data.paymentsInfo.coupon);
            setTotalPrice(response.data.paymentsInfo.totalPrice)
            console.log(response.data.paymentsInfo);
          } else {
            alert("주문 정보 로드에 실패하였습니다.");
          }
        });
      }, []);

    const [Cart, setCart] = useState([]);
    const [PhoneNumber, setPhoneNumber] = useState("");
    const [Address, setAddress] = useState("");
    const [ToOwner, setToOwner] = useState("");
    const [ToRider, setToRider] = useState("");
    const [IsModalVisible, setIsModalVisible] = useState(false);
    const [Coupon, setCoupon] = useState([]);
    const [SelectedCoupon, setSelectedCoupon] = useState([]);
    const [TotalPrice, setTotalPrice] = useState();
    const [DiscountedPrice, setDiscountedPrice] = useState();
    const [IsCouponUsed, setIsCouponUsed] = useState(false);

    const addressChangeHandler = (event) => {
        setAddress(event.currentTarget.value);
    }
    const phoneNumberChangeHandler = (event) => {
        setPhoneNumber(event.currentTarget.value);
    }

    const toOwnerChangeHandler = (event) => {
        setToOwner(event.currentTarget.value);
    }

    const toRiderChangeHandler = (event) => {
        setToRider(event.currentTarget.value);
    }

    const showModal = () => {
        setIsModalVisible(true);
    }

    const handleOk = () => {
        //쿠폰 사용 최소금액 확인
        if(TotalPrice > SelectedCoupon.minPrice){
            setDiscountedPrice(TotalPrice - SelectedCoupon.value);
            setIsCouponUsed(true);
        } else {
            alert(`쿠폰의 최소 주문금액이 ${SelectedCoupon.minPrice}원 입니다`)
        }
        setIsModalVisible(false);
    }

    const handleCancel = () => {
        setIsModalVisible(false);
    }

    //모달창에 쿠폰 내역 랜더링
    const renderCoupon = Coupon.map((coupon, index) => {

        //radio 버튼으로 클릭한 쿠폰 정보를 SelectedCoupon state에 저장
        const selectCoupon = () => {
            setSelectedCoupon(coupon);
        }
        return(
            <Card>     
                <Radio value={index} onChange={selectCoupon}>{coupon.coupon}</Radio>
                <br/>
                {coupon.contents}
            </Card>
        )
    })

    

    //10000000 ~ 99999999 까지의 난수 생성
    let ranNum = Math.floor(Math.random() * 99999999 + 10000000);
    //Date.now에 난수를 더하여 중복 방지
    let orderId = Date.now() + '-' + ranNum;
    
    const requestPay = () => {

        if (!Address === 0) {
            return alert("주소를 입력해주세요.")
        }

        if (!PhoneNumber === 0) {
            return alert("전화번호를 입력해주세요.")
        }

        
        // IMP.request_pay(param, callback) 결제창 호출
        IMP.request_pay({ // param
          pg: "html5_inicis",
          pay_method: "card",
          merchant_uid: orderId,
          name: Cart[0].name,
          amount: IsCouponUsed ? DiscountedPrice : TotalPrice,
          buyer_email: props.user.userData.email,
          buyer_name: props.user.userData.name,
          buyer_tel: PhoneNumber,
          buyer_addr: Address,
          buyer_postcode: "01181"
        }, rsp => { // callback
            if (rsp.success) { // 결제 성공 시: 결제 승인 또는 가상계좌 발급에 성공한 경우
              // axios로 HTTP 요청
              axios({
                url: '/api/payments/complete', // 예: https://www.myservice.com/payments/complete
                method: "post",
                headers: { "Content-Type": "application/json" },
                data: {
                  imp_uid: rsp.imp_uid,
                  merchant_uid: rsp.merchant_uid
                }
            }).then((data) => { // 응답 처리
                switch(data.status) {
                  case "vbankIssued":
                    // 가상계좌 발급 시 로직
                    break;
                  case "success":
                    alert('주문에 성공했습니다.')
                    props.history.push('/history')
                    break;
                }
              });

              //서버에 채운 값들을 request로 보낸다.
                let body = {
                    userId: props.user.userData._id,
                    address: Address, 
                    phoneNumber: PhoneNumber,
                    toOwner: ToOwner,
                    toRider: ToRider,
                    menu: Cart,
                    price: IsCouponUsed ? DiscountedPrice : TotalPrice,
                    storeId: Cart[0].storeId,
                    storeName: Cart[0].storeName,
                    orderTime: Date(),
                    orderId: Date.now(),
                    coupon: SelectedCoupon
                }
              //DB에 저장
                axios.post('/api/users/order', body) && axios.post('/api/store/order', body)
                .then(response => {
                    if (response.data.success) {
                        alert('주문에 성공했습니다.')
                    } else {
                        alert('주문에 실패하였습니다.')
                    }
                })
            } else {
              alert(`결제에 실패하였습니다. 에러 내용: ${rsp.error_msg}`);
            }
          });
        }
            
            

    return (
        <div style={{ width: '60%', margin: '3rem auto' }}>
            
            <h2>배달정보</h2>
            <label>주소</label>
            <Input onChange={addressChangeHandler} value={Address} />
            <br />
            <br />
            <label>전화번호</label>
            <Input onChange={phoneNumberChangeHandler} value={PhoneNumber} />
            <br />
            <Divider />

            <h2>요청사항</h2>
            <label>사장님께</label>
            <Input onChange={toOwnerChangeHandler} value={ToOwner} />
            <br />
            <br />
            <label>라이더님께</label>
            <Input onChange={toRiderChangeHandler} value={ToRider} />
            <Divider />

            <h2>할인</h2>
            <Button onClick={showModal}>쿠폰 사용하기</Button>
            {/* 쿠폰 모달창 */}
            <Modal title="쿠폰 내역" visible={IsModalVisible} onOk={handleOk} onCancel={handleCancel} okText={"선택"} cancelText={"취소"}>  
                <Form.Item>
                    <Radio.Group name="radiogroup">
                        {renderCoupon}
                    </Radio.Group>
                </Form.Item>
            </Modal>
            <br/>
            <Divider />
            
            <h2>결제금액</h2>
            <label>주문금액 : {IsCouponUsed ? DiscountedPrice : TotalPrice}원</label>
            <br/>
            <label>배달팁 : 0원</label>
            <Divider />

            <h2>총 결제금액 : {IsCouponUsed ? DiscountedPrice : TotalPrice}원</h2>

            <Button type="primary" shape="round" icon="dollar" size={'large'} onClick={requestPay}>
                {IsCouponUsed ? DiscountedPrice : TotalPrice}원 결제하기
            </Button>
            
        </div>
    )
}


export default OrderPage
