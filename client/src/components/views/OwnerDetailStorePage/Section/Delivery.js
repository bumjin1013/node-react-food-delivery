import React, { useState, useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux';
import { Table, Cascader, Button, message, Popconfirm } from 'antd';
import { addDeliveryArea, deleteDeliveryArea, getDeliveryArea } from '../../../../_actions/store_actions';

function Delivery(props) {

    const dispatch = useDispatch();
    const [Selected, setSelected] = useState();
    const deliveryArea = useSelector(state => state.store.area);
    let area = '';

    useEffect(() => {
       
        dispatch(getDeliveryArea(props.storeId));
    }, [])

    const options = [
        {
          value: '서울',
          label: '서울',
          children: [
            {
                value: '강남구',
                label: '강남구',
                children: [
                    {
                        value: '가로수길',
                        label: '가로수길',
                    },
                    {
                        value: '강남대로',
                        label: '강남대로',
                    },
                    {
                        value: '개포로',
                        label: '개포로',
                    },
                    {
                        value: '광평로',
                        label: '광평로',
                    },
                    {
                        value: '남부순환로',
                        label: '남부순환로',
                    },
                    {
                        value: '논현로',
                        label: '논현로',
                    },
                    {
                        value: '도곡로',
                        label: '도곡로',
                    },
                    {
                        value: '도산대로',
                        label: '도산대로',
                    },
                    {
                        value: '밤고개로',
                        label: '밤고개로',
                    },
                    {
                        value: '봉은사로',
                        label: '봉은사로',
                    },
                    {
                        value: '분당수서로',
                        label: '분당수서로',
                    },
                    {
                        value: '삼성로',
                        label: '삼성로',
                    },
                    {
                        value: '선릉로',
                        label: '선릉로',
                    },
                    {
                        value: '압구정로',
                        label: '압구정로',
                    },
                    {
                        value: '양재대로',
                        label: '양재대로',
                    },
                    {
                        value: '양재천동자전거길',
                        label: '양재천동자전거길',
                    },
                    {
                        value: '양재천로',
                        label: '양재천로',
                    },
                    {
                        value: '양재천서자전거길',
                        label: '양재천서자전거길',
                    },
                    {
                        value: '언주로',
                        label: '언주로',
                    },
                    {
                        value: '역삼로',
                        label: '역삼로',
                    },
                    {
                        value: '영동대로',
                        label: '영동대로',
                    },
                    {
                        value: '올림픽대로',
                        label: '올림픽대로',
                    },
                    {
                        value: '용인서울고속도로',
                        label: '용인서울고속도로',
                    },
                    {
                        value: '일원로',
                        label: '일원로',
                    },
                    {
                        value: '자곡로',
                        label: '자곡로',
                    },
                    {
                        value: '탄천자전거길',
                        label: '탄천자전거길',
                    },
                    {
                        value: '테헤란로',
                        label: '테헤란로',
                    },
                    {
                        value: '학동로',
                        label: '학동로',
                    },
                    {
                        value: '한강남자전거길',
                        label: '한강남자전거길',
                    },
                    {
                        value: '헌릉로',
                        label: '헌릉로',
                    },
                ]
            },
          ],
        }
      ];
      
    // rowSelection object indicates the need for row selection 
    const columns = [
        {
          title: '시',
          dataIndex: 'si',
        },
        {
          title: '구',
          dataIndex: 'gu',
        },
        {
          title: '도로명주소',
          dataIndex: 'ro',
        },
      ];

    const rowSelection = {
        onChange: (selectedRowKeys, selectedRows) => {
            setSelected(selectedRows); 
        },
        getCheckboxProps: record => ({
            disabled: record.name === 'Disabled User', // Column configuration not to be checked
            name: record.name
        }),
        type: 'radio'
    }

    const onChangeArea = (value) => {
        area = value;
    }   
 

    const addDeliveryAreaButton = () => {
        
        if(area === ''){
            message.error('배달 지역을 선택해주세요.');
        } else {
            let body = {
                storeId: props.storeId,
                si: area[0],
                gu: area[1],
                ro: area[2]
            }
            dispatch(addDeliveryArea(body));
            message.success('배달 지역을 추가하였습니다.');
            dispatch(getDeliveryArea(props.storeId));
        }
    }

    console.log('Selected', Selected && Selected[0]._id);
    const deleteDeliveryAreaButton = () => {
        let body = {
            _id: Selected[0]._id,
            storeId: props.storeId
        }
        dispatch(deleteDeliveryArea(body));
        message.success('배달 지역을 삭제하였습니다.');
    }

    return (
        <div>
            <Cascader options={options} onChange={onChangeArea} placeholder="배달지역을 선택해주세요" />
            <Popconfirm placement="topLeft" title='배달 지역을 추가하시겠습니까?' onConfirm={addDeliveryAreaButton} okText="예" cancelText="취소">
                <Button icon="plus" />
            </Popconfirm>
            <Popconfirm placement="topLeft" title='배달 지역을 삭제하시겠습니까?' onConfirm={deleteDeliveryAreaButton} okText="예" cancelText="취소">
                <Button icon="minus" />
            </Popconfirm>
            
            <Table rowSelection={rowSelection} columns={columns} dataSource={deliveryArea} />
        </div>
    )
}

export default Delivery
