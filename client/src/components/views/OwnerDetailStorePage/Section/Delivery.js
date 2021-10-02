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
          value: '서울특별시',
          label: '서울특별시',
          children: [
            {
                value: '강남구',
                label: '강남구',
                children: [
                    {
                        value: '역삼동',
                        label: '역삼동'
                    },
                    {
                        value: '개포동',
                        label: '개포동'
                    },
                    {
                        value: '청담동',
                        label: '청담동'
                    },
                    {
                        value: '삼성동',
                        label: '삼성동'
                    },
                    {
                        value: '대치동',
                        label: '대치동'
                    },
                    {
                        value: '신사동',
                        label: '신사동'
                    },
                    {
                        value: '논현동',
                        label: '논현동'
                    },
                    {
                        value: '압구정동',
                        label: '압구정동'
                    },
                    {
                        value: '세곡동',
                        label: '세곡동'
                    },
                    {
                        value: '자곡동',
                        label: '자곡동'
                    },
                    {
                        value: '율현동',
                        label: '율현동'
                    },
                    {
                        value: '일원동',
                        label: '일원동'
                    },
                    {
                        value: '수서동',
                        label: '수서동'
                    },
                    {
                        value: '도곡동',
                        label: '도곡동'
                    },
                ]
            },
            {
                value: '강동구',
                label: '강동구',
                children: [
                    {
                        value: '명일동',
                        label: '명일동'
                    },
                    {
                        value: '고덕동',
                        label: '고덕동'
                    },
                    {
                        value: '상일동',
                        label: '상일동'
                    },
                    {
                        value: '길동',
                        label: '길동'
                    },
                    {
                        value: '둔촌동',
                        label: '둔촌동'
                    },
                    {
                        value: '암사동',
                        label: '암사동'
                    },
                    {
                        value: '성내동',
                        label: '성내동'
                    },
                    {
                        value: '천호동',
                        label: '천호동'
                    },
                    {
                        value: '강일동',
                        label: '강일동'
                    },
                ]
            },
            {
                value: '강북구',
                label: '강북구',
                children: [
                    {
                        value: '미아동',
                        label: '미아동'
                    },
                    {
                        value: '번동',
                        label: '번동'
                    },
                    {
                        value: '수유동',
                        label: '수유동'
                    },
                    {
                        value: '우이동',
                        label: '우이동'
                    },
                ]
            },
            {
              value: '종로구',
              label: '종로구',
              children: [
                {
                    value: '가회동',
                    label: '가회동',
                },
                {
                    value: '견지동',
                    label: '견지동',
                },
                {
                    value: '경운동',
                    label: '경운동',
                },
                {
                    value: '계동',
                    label: '계동',
                },
                {
                    value: '공평동',
                    label: '공평동',
                },
                {
                    value: '관수동',
                    label: '관수동',
                },
                {
                    value: '관철동',
                    label: '관철동',
                },
                {
                    value: '관훈동',
                    label: '관훈동',
                },
                {
                    value: '교남동',
                    label: '교남동',
                },
                {
                    value: '교북동',
                    label: '교북동',
                },
                {
                    value: '구기동',
                    label: '구기동',
                },
                {
                    value: '궁정동',
                    label: '궁정동',
                },
                {
                    value: '권농동',
                    label: '권농동',
                },
                {
                    value: '낙원동',
                    label: '낙원동',
                },
                {
                    value: '내수동',
                    label: '내수동',
                },
                {
                    value: '내자동',
                    label: '내자동',
                },
                {
                    value: '누상동',
                    label: '누상동',
                },
                {
                    value: '누하동',
                    label: '누하동',
                },
                {
                    value: '당주동',
                    label: '당주동',
                },
                {
                    value: '도렴동',
                    label: '도렴동',
                },
                {
                    value: '돈의동',
                    label: '돈의동',
                },
                {
                    value: '동숭동',
                    label: '동숭동',
                },
                {
                    value: '명륜',
                    label: '명륜',
                },
                {
                    value: '묘동',
                    label: '묘동',
                },
                {
                    value: '무악동',
                    label: '무악동',
                },
                {
                    value: '봉익동',
                    label: '봉익동',
                },
                {
                    value: '부암동',
                    label: '부암동',
                },
                {
                    value: '사간동',
                    label: '사간동',
                },
                {
                    value: '사직동',
                    label: '사직동',
                },
                {
                    value: '삼청동',
                    label: '삼청동',
                },
                {
                    value: '서린동',
                    label: '서린동',
                },
                {
                    value: '세종로',
                    label: '세종로',
                },
                {
                    value: '소격동',
                    label: '소격동',
                },
                {
                    value: '송월동',
                    label: '송월동',
                },
                {
                    value: '송현동',
                    label: '송현동',
                },
                {
                    value: '수송동',
                    label: '수송동',
                },
                {
                    value: '숭인동',
                    label: '숭인동',
                },
                {
                    value: '신교동',
                    label: '신교동',
                },
                {
                    value: '신문로',
                    label: '신문로',
                },
                {
                    value: '신영동',
                    label: '신영동',
                },
                {
                    value: '안국동',
                    label: '안국동',
                },
                {
                    value: '연건동',
                    label: '연건동',
                },
                {
                    value: '연지동',
                    label: '연지동',
                },
                {
                    value: '예지동',
                    label: '예지동',
                },
                {
                    value: '옥인동',
                    label: '옥인동',
                },
                {
                    value: '와룡동',
                    label: '와룡동',
                },
                {
                    value: '운니동',
                    label: '운니동',
                },
                {
                    value: '원남동',
                    label: '원남동',
                },
                {
                    value: '원서동',
                    label: '원서동',
                },
                {
                    value: '이화동',
                    label: '이화동',
                },
                {
                    value: '익선동',
                    label: '익선동',
                },
                {
                    value: '인의동',
                    label: '인의동',
                },
                {
                    value: '장사동',
                    label: '장사동',
                },
                {
                    value: '재동',
                    label: '재동',
                },
                {
                    value: '적선동',
                    label: '적선동',
                },
                {
                    value: '종로',
                    label: '종로',
                },
                {
                    value: '중학동',
                    label: '중학동',
                },
                {
                    value: '창성동',
                    label: '창성동',
                },
                {
                    value: '창신동',
                    label: '창신동',
                },
                {
                    value: '청운동',
                    label: '청운동',
                },
                {
                    value: '청진동',
                    label: '청진동',
                },
                {
                    value: '체부동',
                    label: '체부동',
                },
                {
                    value: '충신동',
                    label: '충신동',
                },
                {
                    value: '통의동',
                    label: '통의동',
                },
                {
                    value: '통인동',
                    label: '통인동',
                },
                {
                    value: '팔판동',
                    label: '팔판동',
                },
                {
                    value: '평동',
                    label: '평동',
                },
                {
                    value: '평창동',
                    label: '평창동',
                },
                {
                    value: '필운동',
                    label: '필운동',
                },
                {
                    value: '행촌동',
                    label: '행촌동',
                },
                {
                    value: '혜화동',
                    label: '혜화동',
                },
                {
                    value: '홍지동',
                    label: '홍지동',
                },
                {
                    value: '홍파동',
                    label: '홍파동',
                },
                {
                    value: '화동',
                    label: '화동',
                },
                {
                    value: '효자동',
                    label: '효자동',
                },
                {
                    value: '효제동',
                    label: '효제동',
                },
                {
                    value: '훈정동',
                    label: '훈정동',
                },
              ],
            },
            {
                value: '중구',
                label: '중구',
                children: [
                    {
                        value: '광희동',
                        label: '광희동',
                    },
                    {
                        value: '남대문로',
                        label: '남대문로',
                    },
                    {
                        value: '남산동',
                        label: '남산동',
                    },
                    {
                        value: '남창동',
                        label: '남창동',
                    },
                    {
                        value: '남학동',
                        label: '남학동',
                    },
                    {
                        value: '다동',
                        label: '다동',
                    },
                    {
                        value: '만리동',
                        label: '만리동',
                    },
                    {
                        value: '명동',
                        label: '명동',
                    },
                    {
                        value: '무교동',
                        label: '무교동',
                    },
                    {
                        value: '무학동',
                        label: '무학동',
                    },
                    {
                        value: '묵정동',
                        label: '묵정동',
                    },
                    {
                        value: '방산동',
                        label: '방산동',
                    },
                    {
                        value: '봉래동',
                        label: '봉래동',
                    },
                    {
                        value: '북창동',
                        label: '북창동',
                    },
                    {
                        value: '산림동',
                        label: '산림동',
                    },
                    {
                        value: '삼각동',
                        label: '삼각동',
                    },
                    {
                        value: '서소문동',
                        label: '서소문동',
                    },
                    {
                        value: '소공동',
                        label: '소공동',
                    },
                    {
                        value: '수표동',
                        label: '수표동',
                    },
                    {
                        value: '수하동',
                        label: '수하동',
                    },
                    {
                        value: '순화동',
                        label: '순화동',
                    },
                    {
                        value: '신당동',
                        label: '신당동',
                    },
                    {
                        value: '쌍림동',
                        label: '쌍림동',
                    },
                    {
                        value: '예관동',
                        label: '예관동',
                    },
                    {
                        value: '예장동',
                        label: '예장동',
                    },
                    {
                        value: '오장동',
                        label: '오장동',
                    },
                    {
                        value: '을지로',
                        label: '을지로',
                    },
                    {
                        value: '의주로',
                        label: '의주로',
                    },
                    {
                        value: '인현동',
                        label: '인현동',
                    },
                    {
                        value: '입정동',
                        label: '입정동',
                    },
                    {
                        value: '장교동',
                        label: '장교동',
                    },
                    {
                        value: '장충동',
                        label: '장충동',
                    },
                    {
                        value: '저동',
                        label: '저동',
                    },
                    {
                        value: '정동',
                        label: '정동',
                    },
                    {
                        value: '주교동',
                        label: '주교동',
                    },
                    {
                        value: '주자동',
                        label: '주자동',
                    },
                    {
                        value: '중림동',
                        label: '중림동',
                    },
                    {
                        value: '초동',
                        label: '초동',
                    },
                    {
                        value: '충무로',
                        label: '충무로',
                    },
                    {
                        value: '충정로',
                        label: '충정로',
                    },
                    {
                        value: '태평로',
                        label: '태평로',
                    },
                    {
                        value: '필동',
                        label: '필동',
                    },
                    {
                        value: '황학동',
                        label: '황학동',
                    },
                    {
                        value: '회현동',
                        label: '회현동',
                    },
                    {
                        value: '흥인동',
                        label: '흥인동',
                    }, 
                ],
            }
          ],
        },
        {
          value: 'jiangsu',
          label: 'Jiangsu',
          children: [
            {
              value: 'nanjing',
              label: 'Nanjing',
              children: [
                {
                  value: 'zhonghuamen',
                  label: 'Zhong Hua Men',
                },
              ],
            },
          ],
        },
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
          title: '동',
          dataIndex: 'dong',
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
                dong: area[2]
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
