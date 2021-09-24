import React from 'react'
import { Button, notification, Icon } from 'antd';
function NewOrder() {

    console.log('NewOrder 실행됨.')

    const openNotification = () => {
        notification.open({
          message: 'Notification Title',
          description:
            'This is the content of the notification. This is the content of the notification. This is the content of the notification.',
          icon: <Icon type="smile" style={{ color: '#108ee9' }} />,
        });
      };
      

    return (
        <div>
            {openNotification}
        </div>
    )
}

export default NewOrder
