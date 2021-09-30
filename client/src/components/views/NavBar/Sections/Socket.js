import React, { useEffect } from 'react'
import { io } from 'socket.io-client';
import { notification, mesasge, Icon } from 'antd';

function Socket(props) {

    //소켓 연결
    const socket = io(`http://localhost:5000`);

    //주문이 진행중인 상태일 때만 소켓으로 연결시켜 상점과 통신 가능
    if(props.history.orderId.state !== "배달완료" || props.history.orderId.state !== "주문취소"){
        let data = { orderId: props.history.orderId }
        socket.emit("Join OrderId Room", data)
    }


    const alert = (data) => {

        const key = `open${Date.now()}`;

        //닫기
        const close = () => {
            console.log(
                'Notification was closed. Either the close button was clicked or duration time elapsed.',
            );
        }

        if(data.state == "주문취소"){
            notification.open({
                message: '주문이 사장님의 요청으로 취소되었습니다.',
                duration: null,
                key,
                onClose: close,
                icon: <Icon type="alert" style={{ color: '#108ee9' }}  />,
              });
        } else {
            notification.open({
                message: '주문하신 음식이 ' + data.state + '로 변경되었습니다.',
                duration: null,
                key,
                onClose: close,
                icon: <Icon type="alert" style={{ color: '#108ee9' }}  />,
              });
        }
        
    }

    useEffect(() => {
        socket.on("Output Order State", dataFromBackend => {
            alert(dataFromBackend);
        })
    }, [])

    return (
        null
    )

}

export default Socket
