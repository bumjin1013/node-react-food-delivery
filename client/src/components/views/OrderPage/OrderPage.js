import React, { useState } from 'react'
import { Form, Input, Divider, Button } from 'antd';
import axios from 'axios';

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

        if (!Address === 0) {
            return alert("주소를 입력해주세요.")
        }

        if (!PhoneNumber === 0) {
            return alert("전화번호를 입력해주세요.")
        }


        //서버에 채운 값들을 request로 보낸다.
        let body = {
            userId: props.user.userData._id,
            address: Address, 
            phoneNumber: PhoneNumber,
            toOwner: ToOwner,
            toRider: ToRider,
            menu: Cart,
            price: totalPrice,
            storeId: Cart[0].storeId,
            storeName: Cart[0].storeName,
            orderTime: Date(),
            orderId: Date.now()
        }

        console.log(body);
      
        
        axios.post('/api/users/order', body) && axios.post('/api/store/order', body)
            .then(response => {
                if (response.data.success) {
                    alert('주문에 성공했습니다.')
                    props.history.push('/history')
                } else {
                    alert('주문에 실패하였습니다.')
                }
            })
            
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
            <label>배달팁 : 0원</label>
            <Divider />
            <h2>총 결제금액 : {totalPrice}원</h2>

            <Button type="primary" shape="round" icon="dollar" size={'large'} onClick={submitHandler}>
                {totalPrice}원 결제하기
            </Button>
            
        </div>
    )
}

export default OrderPage
