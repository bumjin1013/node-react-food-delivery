import React from 'react';
import { useSelector } from 'react-redux';
import { Icon, Popover } from 'antd';

function Address() {

    const address = useSelector(state => state.user.userData && state.user.userData.address);

    return (
        <div>
            {address}
            <Popover placement="bottom" title='주소' content='바꾸기' trigger="click">
                <Icon type="caret-down" />
            </Popover>

        </div>
    )
}

export default Address
