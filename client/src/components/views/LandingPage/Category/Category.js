import React from 'react'
import korean from './Icon/korean.png';
import bunsick from './Icon/bunsick.png';
import chineese from './Icon/chineese.png';
import fastfood from './Icon/fastfood.png';
import pizza from './Icon/pizza.png';
import chicken from './Icon/chicken.png';


const iconStyle = {
    width: '13%',
    margin: 10
  };

function Category(props) {

    const clickHandler = (event) => {
        
    }

    return (
        <div>
            <div style={{textAlign: 'center'}}>
                <a href={`/korean`} onClick={clickHandler}>
                    <img src={korean} alt="korean" style={iconStyle} value={korean}/>
                </a>
                <a href={`/bunsick`}>
                    <img src={bunsick} alt="bunsick" style={iconStyle} value={bunsick}/>
                </a>
                <a href={`/chineese`}>
                    <img src={chineese} alt="chineese" style={iconStyle} value={chineese}/>
                </a>
                <a href={`/chicken`} >
                    <img src={chicken} alt="chicken" style={iconStyle} value={chicken} onClick={clickHandler}/>
                </a>
                <br />
                <a href={`/pizza`}>
                    <img src={pizza} alt="pizza" style={iconStyle} value={pizza}/>
                </a>
                <a href={`/fastfood`}>
                    <img src={fastfood} alt="fastfood" style={iconStyle} value={fastfood}/>
                </a>
            </div>
    </div>
   
    )
}

export default Category
