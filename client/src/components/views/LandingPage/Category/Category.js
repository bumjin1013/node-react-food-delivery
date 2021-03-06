import React from 'react'
import korean from './Icon/korean.png';
import bunsick from './Icon/bunsick.png';
import chineese from './Icon/chineese.png';
import fastfood from './Icon/fastfood.png';
import pizza from './Icon/pizza.png';
import chicken from './Icon/chicken.png';


const iconStyle = {
    width: '100px',
    margin: 10
  };

function Category(props) {

    return (
        <div>
            <div style={{textAlign: 'center'}}>
                <a href={`/store/${"korean"}`}>
                    <img src={korean} alt="korean" style={iconStyle} name="korean" />
                </a>
                <a href={`/store/${"bunsick"}`}>
                    <img src={bunsick} alt="bunsick" style={iconStyle} name="bunsick" />
                </a>
                <a href={`/store/${"chinese"}`}>
                    <img src={chineese} alt="chinese" style={iconStyle} name="chinese" />
                </a>
                <a href={`/store/${"chicken"}`} >
                    <img src={chicken} alt="chicken" style={iconStyle} name="chicken" />
                </a>
                <br />
                <a href={`/store/${"pizza"}`}>
                    <img src={pizza} alt="pizza" style={iconStyle} name="pizza" />
                </a>
                <a href={`/store/${"burger"}`}>
                    <img src={fastfood} alt="fastfood" style={iconStyle} name="fastfood" />
                </a>
            </div>
    </div>
   
    )
}

export default Category
