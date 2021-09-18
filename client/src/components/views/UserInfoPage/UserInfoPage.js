import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Icon, Card, Button, Input, Empty, message } from 'antd';
import GetAddress from './Section/GetAddress';
import Post from '../../utils/Post';
import Address from './Section/Address';

const { Search } = Input;

function UserInfoPage() {
    useEffect(() => {
        axios.get("/api/users/userinfo").then((response) => {
          if (response.data.success) {
              setUserInfo(response.data.userInfo);
              setNickname(response.data.userInfo.nickname);
              setCoupon(response.data.userInfo.coupon)
          } else {
            alert("유저 정보 로드에 실패하였습니다.");
          }
        });
      }, []);

    const [UserInfo, setUserInfo] = useState([]);
    const [Nickname, setNickname] = useState();
    const [IsEdit, setIsEdit] = useState(false);
    const [EditedNickname, setEditedNickname] = useState(UserInfo.nickname);
    const [Coupon, setCoupon] = useState([]);
    const [Latitude, setLatitude] = useState(); //위도
    const [Longitude, setLongitude] = useState(); //경도

    console.log(EditedNickname);
    const editClick = () => {
      setIsEdit(true);
    }
    const editSuccess = () => {

        if(EditedNickname == '') {
            message.error('변경할 닉네임을 입력해주세요.');
        } else {
            setIsEdit(false);
            setNickname(EditedNickname);
            
      
            const body = {
              nickname: EditedNickname
            }
        
            axios.post('/api/users/edituserinfo', body)
              .then(response => {
                if (response.data.success) {
                  message.success('닉네임을 수정하였습니다.')
                } else {
                  message.error('닉네임 수정에 실패하였습니다.')
                }
            })
        }
      
    }

    const nicknameChangeHandler = (event) => {
      setEditedNickname(event.currentTarget.value);
    }

    const renderCoupon = Coupon.map((coupon, index) => {
      
      //사용 한 쿠폰 출력 X
      if(!coupon.isUsed){
      return(
          <Card>
            <h3>{coupon.coupon}</h3>
            <br/>
            {coupon.contents}
            <br />
          </Card>
      )}
    })

    //현재 디바이스의 위도 경도 가져오기
    navigator.geolocation.getCurrentPosition(function(position) {
      setLatitude(position.coords.latitude); // 위도
      setLongitude(position.coords.longitude); // 경도
    })
    
    const getAddress = () => {
      
      return(
        <GetAddress latitude={Latitude} longitude={Longitude} />
      )
    }

    const renderAddress = () => {
        
        return(
            <Address address={UserInfo.address}/>
        )
    }

    
        
          
    return (
        <div style={{ width: '60%', margin: '3rem auto' }}>
            <h2> <Icon type="user"/> 사용자 정보 </h2> 

            <Card style={{ width: 'auto' }}>
                이메일 : {UserInfo.email}
                <br/>
                <br/>
                이름 : {UserInfo.name}
                <br />
                <br />
                주소 : { UserInfo.address ? renderAddress() : <Icon type="loading" />}
                <br/>
                <br/>
                나의 위치 : { Latitude&&Longitude ? getAddress() : <Icon type="loading" />}
                
                <br/>
                <br/>
                닉네임 :
                {IsEdit 
                  ? 
                  <div>
                    <Input defaultValue={Nickname} onChange={nicknameChangeHandler} style={{width: 200}}/>
                    <Button icon="check" onClick={editSuccess}/>
                  </div>
                  : 
                  <div>
                     {Nickname} 
                    <Button icon="edit" onClick={editClick}/>
                  </div>
                }
                 </Card>

          <br />   
          <h2><Icon type="smile"/> 쿠폰 </h2>
          <Card style={{ width: 'auto' }}>
            {renderCoupon.length > 0 ? renderCoupon : <Empty/>}
          </Card>
          
          
        </div>
    )
}


export default UserInfoPage
