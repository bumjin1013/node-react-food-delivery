import React, { useState } from 'react'
import { Form, Input, Divider, Button } from 'antd';
import Axios from 'axios';


function OrderPage(props) {
    
    const [Cart, setCart] = useState(props.user.userData.cart);
    const [PhoneNumber, setPhoneNumber] = useState("");
    const [Address, setAddress] = useState("");
    const [ToOwner, setToOwner] = useState("");
    const [ToRider, setToRider] = useState("");


    let totalPrice = 0;
    const renderCart = Cart.map((cart, index) => {
        return(
            totalPrice += cart.price * cart.quantity
        );
    })

    const addressChangeHandler = (event) => {
        setAddress(event.currentTarget.value)
    }
    const phoneNumberChangeHandler = (event) => {
        setPhoneNumber(event.currentTarget.value)
    }

    const toOwnerChangeHandler = (event) => {
        setToOwner(event.currentTarget.value)
    }

    const toRiderChangeHandler = (event) => {
        setToRider(event.currentTarget.value)
    }
    const submitHandler = (event) => {
        event.preventDefault();

        if (!Address || !PhoneNumber  === 0) {
            return alert(" 모든 값을 넣어주셔야 합니다.")
        }


        //서버에 채운 값들을 request로 보낸다.

      
    /*
      Axios.post('/api/user/order', body) && Axios.post('api/owner/order')
            .then(response => {
                if (response.data.success) {
                    alert('주문에 성공했습니다.')
                    propshistory.push('/')
                } else {
                    alert('주문에 실패하였습니다.')
                }
            })
            */
          
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
            <h2>결제금액</h2>
            <label>주문금액 : {totalPrice}원</label>
            <br/>
            <label>배달팁 : 2000원</label>
            <Divider />
            <h2>총 결제금액 : {totalPrice  + 2000}원</h2>

            <Button type="primary" shape="round" icon="dollar" size={'large'}>
                {totalPrice + 2000}원 결제하기
            </Button>
            
            
        </div>
    )
}

export default OrderPage
