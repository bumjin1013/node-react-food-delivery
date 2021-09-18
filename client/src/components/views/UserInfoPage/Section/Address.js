import React , { useState }from 'react'
import { useDispatch } from 'react-redux';
import Post from '../../../utils/Post';
import { Button, Modal, Input, message } from 'antd';
import { updateAddress } from '../../../../_actions/user_actions';
const { Search } = Input;

function Address(props) {

    const dispatch = useDispatch();
    const [Visible, setVisible] = useState(false);
    const [SearchVisible, setSearchVisible] = useState(false);
    const [Address, setAddress] = useState(null);
    const [DetailAddress, setDetailAddress] = useState();
    const [CurrentAddress, setCurrentAddress] = useState(props.address);

    const addAddress = () => { 
        setVisible(true);
    }

    const handleOk = () => {
        
        if(Address == null){
            message.error('주소를 입력해주세요.')
        } else {
            let body = {
                address: Address + ' ' + DetailAddress
            }
            console.log(body);
            dispatch(updateAddress(body))
            setCurrentAddress(body.address);
            setVisible(false);
        }
        
    }
    
    const handleCancel = () => {
        setVisible(false);
    }

    const searchAddress = () => {
        setSearchVisible(true);
    }

    const searchHandleOk = () => {
        setSearchVisible(false);
    }

    const searchHandleCancel = () => {
        setSearchVisible(false);
    }

    const detailAddress = (event) => {
        setDetailAddress(event.currentTarget.value)
    }

    console.log(CurrentAddress);

   

    if(props.userInfo && props.userInfo.address == null){
        return(
            <div>
                주소를 등록해주세요.
                <Button icon='edit' onClick={addAddress}>주소 등록하기</Button>
                <Modal
                    title="주소 등록하기"
                    visible={Visible}
                    onOk={handleOk}
                    onCancel={handleCancel}
                >
                    <Search placeholder="검색하기 버튼을 눌러 주소를 검색해주세요" onSearch={searchAddress} enterButton value={Address} />
                    <Input placeholder="상세주소를 입력해주세요." style={{marginTop: '10px'}} onChange={detailAddress}/>
                        
                        <Modal
                            title="주소 찾기"
                            visible={SearchVisible}
                            onOk={searchHandleOk}
                            onCancel={searchHandleCancel}
                        >
                            <Post setAddress={setAddress} setSearchVisible={setSearchVisible}/>
                        </Modal>
                </Modal>
            </div>
            
        )
    } else {
        return (
            
            <div>
            {CurrentAddress ? CurrentAddress : null}
            <Button icon='edit' onClick={addAddress}>주소 변경하기</Button>
            <Modal
                title="주소 변경하기"
                visible={Visible}
                onOk={handleOk}
                onCancel={handleCancel}
            >
                <Search placeholder="검색하기 버튼을 눌러 주소를 검색해주세요" onSearch={searchAddress} enterButton value={Address} />
                <Input placeholder="상세주소를 입력해주세요." style={{marginTop: '10px'}} onChange={detailAddress}/>
                    
                    <Modal
                        title="주소 찾기"
                        visible={SearchVisible}
                        onOk={searchHandleOk}
                        onCancel={searchHandleCancel}
                    >
                        <Post setAddress={setAddress} setSearchVisible={setSearchVisible}/>
                    </Modal>
            </Modal>
        </div>
        )
    }
}

export default Address
