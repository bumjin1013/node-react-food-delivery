import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Icon, Card, Button, Input } from 'antd';



function UserInfoPage() {
    useEffect(() => {
        axios.get("/api/users/userinfo").then((response) => {
          if (response.data.success) {
            console.log(response.data);
              setUserInfo(response.data.userInfo);
              setNickname(response.data.userInfo.nickname);
          } else {
            alert("유저 정보 로드에 실패하였습니다.");
          }
        });
      }, []);

    const [UserInfo, setUserInfo] = useState([]);
    const [Nickname, setNickname] = useState();
    const [IsEdit, setIsEdit] = useState(false);
    const [EditedNickname, setEditedNickname] = useState(UserInfo.nickname);

    const editClick = () => {
      setIsEdit(true);
    }
    const editSuccess = () => {
      setIsEdit(false);
      setNickname(EditedNickname);
      

      const body = {
        nickname: EditedNickname
      }
  
      axios.post('/api/users/edituserinfo', body)
        .then(response => {
          if (response.data.success) {
            alert('닉네임을 수정하였습니다.')
          } else {
            alert('닉네임 수정에 실패하였습니다.')
          }
      })
    }

    const nicknameChangeHandler = (event) => {
      setEditedNickname(event.currentTarget.value);
    }

    return (
        <div style={{ width: '60%', margin: '3rem auto' }}>
            <h2> <Icon type="user"/> 사용자 정보 </h2> 

            <Card style={{ width: 'auto' }}>
                이메일 : {UserInfo.email}
                <br/>
                <br/>
                이름 : {UserInfo.name}
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
                
                
           <Icon type="percentage"/> 쿠폰 
           
            <Card style={{ width: 'auto' }}>
            </Card>
           
        </div>
    )
}


export default UserInfoPage
