import React from 'react';
import Category from './Category/Category';
import Banner from './Banner/Banner.png';
import axios from 'axios';

function LandingPage(props) {

    const getCoupon = () => {

        //로그인 되지 않은 상태
        if(!props.user.userData.isAuth){
            alert('로그인이 필요합니다.');
        } else { //로그인 된 상태

            let body = {
                coupon: "10000원 할인쿠폰",
                value: 10000,
                contents: "15000원 이상 주문 시 사용 가능",
                minPrice: 15000
            }
            //userData에서 coupon을 확인해 쿠폰 중복 발급 제한
            if(props.user.userData.coupon.length > 0){
                alert('이미 쿠폰을 발급 받으셨습니다.');
            } else {
                axios.post('/api/users/getcoupon', body)
                .then(response => {
                    if (response.data.success) {
                        alert('쿠폰이 발급되었습니다.');
                    } else {
                        alert('쿠폰 발급에 실패하였습니다.');
                    }
                })
            }      
        }  
    }
    
    return (
        <div style={{ width: '75%', margin: '3rem auto' }}>
            <div style={{ textAlign: 'center' }}>
                <img src={Banner} style={{width: '75%'}} onClick={() => getCoupon()}/>
            </div>
            <br />
            <Category />
        </div>
    )
}

export default LandingPage
