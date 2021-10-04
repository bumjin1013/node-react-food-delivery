import React, { useState } from "react";
import moment from "moment";
import { Formik } from 'formik';
import * as Yup from 'yup';
import { registerUser } from "../../../_actions/user_actions";
import { useDispatch } from "react-redux";
import Post from "../UserInfoPage/Section/Post";


import {
  Form,
  Input,
  Button,
  Modal
} from 'antd';
const { Search } = Input;
const formItemLayout = {
  labelCol: {
    xs: { span: 24 },
    sm: { span: 8 },
  },
  wrapperCol: {
    xs: { span: 24 },
    sm: { span: 16 },
  },
};
const tailFormItemLayout = {
  wrapperCol: {
    xs: {
      span: 24,
      offset: 0,
    },
    sm: {
      span: 16,
      offset: 8,
    },
  },
};

function RegisterPage(props) {

  const [SearchVisible, setSearchVisible] = useState(false);
  const [Address, setAddress] = useState(null);
  const searchAddress = () => {
    setSearchVisible(true);
  }
  const searchHandleOk = () => {
    setSearchVisible(false);
  }
  const searchHandleCancel = () => {
    setSearchVisible(false);
  }
  const dispatch = useDispatch();

  console.log(Address);
  return (

    <Formik
      initialValues={{
        email: '',
        nickname: '',
        name: '',
        password: '',
        confirmPassword: ''
      }}
      validationSchema={Yup.object().shape({
        name: Yup.string()
          .required('이름을 입력해주세요'),
        nickname: Yup.string()
          .required('별명을 입력해주세요'),
        email: Yup.string()
          .email('이메일 형식이 아닙니다')
          .required('이메일을 입력해주세요'),
        password: Yup.string()
          .min(6, '비밀번호는 6자리 이상이어야 합니다')
          .required('비밀번호를 입력해주세요'),
        confirmPassword: Yup.string()
          .oneOf([Yup.ref('password'), null], '비밀번호가 일치하지 않습니다')
          .required('비밀번호를 입력해주세요')
      })}
      onSubmit={(values, { setSubmitting }) => {
        setTimeout(() => {

          let dataToSubmit = {
            email: values.email,
            password: values.password,
            name: values.name,
            nickname: values.nickname,
            image: `http://gravatar.com/avatar/${moment().unix()}?d=identicon`,
            address: {
              address: Address,
              detail: values.detail
            }
          };

          dispatch(registerUser(dataToSubmit)).then(response => {
            if (response.payload.success) {
              props.history.push("/login");
            } else {
              alert(response.payload.err.errmsg)
            }
          })

          setSubmitting(false);
        }, 500);
      }}
    >
      {props => {
        const {
          values,
          touched,
          errors,
          dirty,
          isSubmitting,
          handleChange,
          handleBlur,
          handleSubmit,
          handleReset,
        } = props;
        return (
          <div className="app">
            <h2>회원가입</h2>
            <Form style={{ minWidth: '375px' }} {...formItemLayout} onSubmit={handleSubmit} >

              <Form.Item required label="이름">
                <Input
                  id="name"
                  placeholder="이름을 입력해주세요"
                  type="text"
                  value={values.name}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  className={
                    errors.name && touched.name ? 'text-input error' : 'text-input'
                  }
                />
                {errors.name && touched.name && (
                  <div className="input-feedback">{errors.name}</div>
                )}
              </Form.Item>

              <Form.Item required label="별명">
                <Input
                  id="nickname"
                  placeholder="별명을 입력해주세요"
                  type="text"
                  value={values.nickname}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  className={
                    errors.nickname && touched.nickname ? 'text-input error' : 'text-input'
                  }
                />
                {errors.nickname && touched.nickname && (
                  <div className="input-feedback">{errors.nickname}</div>
                )}
              </Form.Item>

              <Form.Item required label="이메일" hasFeedback validateStatus={errors.email && touched.email ? "error" : 'success'}>
                <Input
                  id="email"
                  placeholder="이메일을 입력해주세요"
                  type="email"
                  value={values.email}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  className={
                    errors.email && touched.email ? 'text-input error' : 'text-input'
                  }
                />
                {errors.email && touched.email && (
                  <div className="input-feedback">{errors.email}</div>
                )}
              </Form.Item>

              <Form.Item required label="비밀번호" hasFeedback validateStatus={errors.password && touched.password ? "error" : 'success'}>
                <Input
                  id="password"
                  placeholder="비밀번호를 입력해주세요"
                  type="password"
                  value={values.password}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  className={
                    errors.password && touched.password ? 'text-input error' : 'text-input'
                  }
                />
                {errors.password && touched.password && (
                  <div className="input-feedback">{errors.password}</div>
                )}
              </Form.Item>

              <Form.Item required label="비밀번호 확인" hasFeedback>
                <Input
                  id="confirmPassword"
                  placeholder="비밀번호를 입력해주세요"
                  type="password"
                  value={values.confirmPassword}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  className={
                    errors.confirmPassword && touched.confirmPassword ? 'text-input error' : 'text-input'
                  }
                />
                {errors.confirmPassword && touched.confirmPassword && (
                  <div className="input-feedback">{errors.confirmPassword}</div>
                )}
              </Form.Item>
              
              <Form.Item required label="주소" hasFeedback>
                <Search placeholder="검색하기 버튼을 눌러 주소를 검색해주세요" onSearch={searchAddress} enterButton value={Address} />
              </Form.Item>
              
                  
              <Modal
                title="주소 찾기"
                visible={SearchVisible}
                onOk={searchHandleOk}
                onCancel={searchHandleCancel}
              >
                <Post setAddress={setAddress} setSearchVisible={setSearchVisible}/>
              </Modal>


              <Form.Item required label="상세주소">
                <Input
                  id="detail"
                  placeholder="상세주소를 입력해주세요"
                  type="text"
                  value={values.detail}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  className={
                    errors.detail && touched.detail ? 'text-input error' : 'text-input'
                  }
                />
                {errors.detail && touched.detail && (
                  <div className="input-feedback">{errors.detail}</div>
                )}
              </Form.Item>

              <Form.Item {...tailFormItemLayout}>
                <Button onClick={handleSubmit} type="primary" disabled={isSubmitting}>
                  Submit
                </Button>
              </Form.Item>

             
            </Form>
          </div>
        );
      }}
    </Formik>
  );
};


export default RegisterPage
