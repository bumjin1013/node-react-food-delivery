import React, { useState } from 'react'
import { Typography, Button, Form, Input } from 'antd';
import FileUpload from '../../../utils/FileUpload';
import Axios from 'axios';
const { TextArea } = Input;

const Categorys = [
    { key: "korean", value: "한식" },
    { key: "bunsick", value: "분식" },
    { key: "chinese", value: "중식" },
    { key: "chicken", value: "치킨" },
    { key: "pizza", value: "피자" },
    { key: "burger", value: "햄버거" }
]

function AddStorePage(props) {

    const [Title, setTitle] = useState("")
    const [Description, setDescription] = useState("")
    const [Address, setAddress] = useState("")
    const [Category, setCategory] = useState('korean');
    const [Image, setImage] = useState([])

    const titleChangeHandler = (event) => {
        setTitle(event.currentTarget.value)
    }

    const descriptionChangeHandler = (event) => {
        setDescription(event.currentTarget.value)
    }

    const addressChangeHandler = (event) => {
        setAddress(event.currentTarget.value)
    }

    const categoryChangeHandler = (event) => {
        setCategory(event.currentTarget.value)
    }

    const updateImage = (newImage) => {
        setImage(newImage)
    }

    const submitHandler = (event) => {
        event.preventDefault();

        if (!Title || !Description || !Address || !Category || Image.length === 0) {
            return alert(" 모든 값을 넣어주셔야 합니다.")
        }


        //서버에 채운 값들을 request로 보낸다.

        const body = {
            //로그인 된 사람의 ID 
            id: props.owner.ownerData._id,
            title: Title,
            description: Description,
            image: Image,
            category: Category,
            address: Address
        }

        Axios.post('/api/store', body)
            .then(response => {
                if (response.data.success) {
                    alert('상품 업로드에 성공 했습니다.')
                    props.history.push('/store')
                } else {
                    alert('상품 업로드에 실패 했습니다.')
                }
            })
    }


    return (
        <div style={{ maxWidth: '700px', margin: '2rem auto' }}>
            <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
                <h2> 가게 추가</h2>
            </div>

            <Form onSubmit={submitHandler}>
                <label>상점 이미지</label>
                {/* DropZone */}
                <FileUpload refreshFunction={updateImage} />

                <br />
                <br />
                <label>상점 이름</label>
                <Input onChange={titleChangeHandler} value={Title} />
                <br />
                <br />
                <label>설명</label>
                <TextArea onChange={descriptionChangeHandler} value={Description} />
                <br />
                <br />
                <label>주소</label>
                <TextArea onChange={addressChangeHandler} value={Address} />
                <br />
                <br />
                <label>카테고리</label>
                <br />
                <select onChange={categoryChangeHandler} value={Category}>
                    {Categorys.map(item => (
                        <option key={item.key} value={item.key}> {item.value}</option>
                    ))}
                </select>
                <br />
                <br />
                <button type="submit">
                    확인
                </button>
            </Form>


        </div>
    )
}

export default AddStorePage
