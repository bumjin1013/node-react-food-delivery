import React from 'react';
import { useSelector } from 'react-redux';
import { Icon, Popover } from 'antd';


function Address() {

    const address = useSelector(state => state.user.userData && state.user.userData.address);

    if(address !== undefined){
        return (
            <div>
                {address.address + ' ' + address.detail}
                <Popover placement="bottom" title='주소' content='바꾸기' trigger="click">
                    <Icon type="caret-down" />
                </Popover>
      
            </div>
        )
    } else {
        return (
            '주소를 입력해주세요'
        )
    }
}

export default Address
