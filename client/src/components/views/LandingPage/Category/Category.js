import React from 'react'
import korean from './Icon/korean.png';
import bunsick from './Icon/bunsick.png';
import chineese from './Icon/chineese.png';
import fastfood from './Icon/fastfood.png';
import pizza from './Icon/pizza.png';
import chicken from './Icon/chicken.png';
import Icon from '@ant-design/icons';


const iconStyle = {
    width: '13%',
    margin: 10
  };

function Category() {

    return (
        <div>
            <div style={{textAlign: 'center'}}>
                <a href={`/korean`}>
                    <img src={korean} alt="korean" style={iconStyle} />
                </a>
                <a href={`/bunsick`}>
                    <img src={bunsick} alt="bunsick" style={iconStyle} />
                </a>
                <a href={`/chineese`}>
                    <img src={chineese} alt="chineese" style={iconStyle} />
                </a>
                <a href={`/chicken`}>
                    <img src={chicken} alt="chicken" style={iconStyle} />
                </a>
                <br />
                <a href={`/pizza`}>
                    <img src={pizza} alt="pizza" style={iconStyle} />
                </a>
                <a href={`/fastfood`}>
                    <img src={fastfood} alt="fastfood" style={iconStyle} />
                </a>
            </div>
    </div>
   
    )
}

export default Category
