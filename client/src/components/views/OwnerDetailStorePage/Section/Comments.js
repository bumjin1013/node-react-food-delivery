import React, { useEffect, useState } from 'react'
import SingleComment from './SingleComment';
import { Layout, Menu, Breadcrumb, Icon, Comment, Tooltip, Avatar, Rate, Input, Button, Collapse, Radio, DatePicker } from 'antd';

const { MonthPicker, RangePicker, WeekPicker } = DatePicker;
const { Panel } = Collapse;
function Comments(props) {

    const [Value, setValue] = useState(1);

    const onChange = (date, dateString) => {
        console.log(date, dateString);
      }
    
      const callback = (key) => {
        console.log(key);
      }
    
      const radioChange = (e) => {
        console.log('radio checked', e.target.value);
        setValue(e.target.value);
      }

      
    return (

        <div>
            <Collapse onChange={callback}>
            <Panel header="정렬" key="1">

            <Radio.Group onChange={radioChange} value={Value}>
              <Radio value={1}>기본순</Radio>
              <Radio value={2}>댓글 없는 리뷰</Radio>
              <Radio value={3}>별점 높은 순</Radio>
              <Radio value={4}>별점 낮은 순</Radio>
            </Radio.Group>

              날짜 선택<DatePicker onChange={onChange} />
            </Panel>
          </Collapse>
          
            {props.review && props.review.slice(0).reverse().map((comment, index) => (
                (!comment.responseTo &&
                    <React.Fragment>
                        <SingleComment comment={comment} storeId={props.storeId}/>
                    </React.Fragment>
                )
            ))}
        </div>
    )
}

export default Comments