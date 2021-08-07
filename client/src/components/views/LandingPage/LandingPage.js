import React, { useState } from 'react';
import { Icon, Col, Card, Row, Carousel} from 'antd';
import Meta from 'antd/lib/card/Meta';
import ImageSlider from '../../utils/ImageSlider';
import Category from './Category/Category';

function LandingPage() {

    return (
        <div style={{ width: '75%', margin: '3rem auto' }}>

            <div style={{ textAlign: 'center' }}>
                <h1>오늘 뭐먹지?</h1>
            </div>
            <br />
            <br />
            <br />
            <br />
            <br />
            <br />
            <br />
            <br />
            <Category />

            


        </div>
    )
}

export default LandingPage
