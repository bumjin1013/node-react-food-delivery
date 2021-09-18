/* eslint-disable jsx-a11y/anchor-is-valid */
import React, { useState } from 'react';
import { useDispatch } from 'react-redux';
import { Icon, Card, Button, message } from 'antd';
import { useSelector } from "react-redux";
import { removeCartItem, getCartItems } from '../../../_actions/user_actions';


function CartPage(props) {

    const dispatch = useDispatch();
    const user = useSelector(state => state.user);
  
    //장바구니에 표시될 상점 이름, 총 가격
    let storeName;
    let totalPrice = 0;

    //장바구니 내역 불러오기
    dispatch(getCartItems());

     //장바구니 랜더링
    const renderCart = user.cartDetail && user.cartDetail.map((cart, index) => {
        storeName = cart.storeName;
        totalPrice += cart.quantity * cart.price;

        const deleteHandler = () => {
            let body = {
             menuId: cart.id
        }
        //장바구니 해당 메뉴 삭제
        dispatch(removeCartItem(body));

        //삭제 후 재 랜더링
        setTimeout(() => {
            dispatch(getCartItems());
        }, 10);
        }

        return(
            <div>
                <Card key={index} style={{width: 'auto'}}>
                {cart.name} - {cart.quantity}개 : {cart.price * cart.quantity}원
                <Button icon="delete" onClick={deleteHandler} />
                </Card>
            </div>
        );
    })
    
    //주문하기 버튼
    const orderButton = () => {
        if(user.cartDetail && user.cartDetail.length > 0){
            props.history.push('/order');
            } else {
            message.error('장바구니에 메뉴를 추가해주세요.');
        }
    }

    return (
        <div style={{ width: '60%', margin: '3rem auto' }}>
            <h2><Icon type="shopping-cart"/> 장바구니</h2>

            <h2>{storeName}</h2>
            {renderCart}

            <h2>총 금액 : {totalPrice} 원</h2>
            <Button type="primary" shape="round" size="large" onClick={orderButton}>주문 하기</Button>
        </div>
    )
}

export default CartPage
