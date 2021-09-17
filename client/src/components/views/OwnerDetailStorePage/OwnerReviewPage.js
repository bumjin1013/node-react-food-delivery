import React, { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux';
import { Layout, Menu, Breadcrumb, Icon, Comment, Tooltip, Avatar, Rate, Input, Button, Collapse, Radio } from 'antd';
import Comments from './Section/Comments';
import { getReview } from '../../../_actions/store_actions';
import { DatePicker } from 'antd';

const { SubMenu } = Menu;
const { Content, Sider } = Layout;
const { MonthPicker, RangePicker, WeekPicker } = DatePicker;
const { Panel } = Collapse;


function OwnerReviewPage(props) {

  const dispatch = useDispatch();
  const storeId = props.match.params.storeId;
  

  useEffect(() => {
    dispatch(getReview(storeId));
  }, []);

  
 

  const review = useSelector(state => state.store.review)

    return (
      <div>
       
    <Layout>
      <Sider width={200} style={{ background: '#fff' }}>
        <Menu
          mode="inline"
          defaultSelectedKeys={['4']}
          style={{ height: '100%', borderRight: 0 }}
        >
          <SubMenu
            key="sub1"
            title={
              <span>
                <Icon type="user" />
                주문관리
              </span>
            }
          >
            <Menu.Item key="1">
                <a href={`/store/${storeId}/order/proceeding`} >주문현황</a>
            </Menu.Item>
            <Menu.Item key="2">
                <a href={`/store/${storeId}/order/completed`} >이전주문</a>
            </Menu.Item>
          </SubMenu>
            <Menu.Item key="3">
                <a href={`/store/${storeId}/menu`} >메뉴관리</a>
            </Menu.Item>
            <Menu.Item key="4">
                <a href={`/store/${storeId}/review`} >리뷰관리</a>
            </Menu.Item>
            <Menu.Item key="5">
                <a href={`/store/${storeId}/setting`} >상점관리</a>
            </Menu.Item>
          
        </Menu>
      </Sider>
      <Layout style={{ padding: '0 24px 24px' }}>
        <Breadcrumb style={{ margin: '16px 0' }}>
         
        </Breadcrumb>
        <Content 
          style={{
            background: '#fff',
            padding: 24,
            margin: 0,
            minHeight: 280,
          }}
        >
          

          
          {review && review.length > 0 ? <Comments review={review} storeId={storeId}/> : null}
          
        </Content>
      </Layout>
    </Layout>

        </div>
    )
}

export default OwnerReviewPage
