import React from 'react'
import {Icon} from 'antd';

function Footer() {
    return (
        <div style={{
            height: '80px', display: 'flex',
            flexDirection: 'column', alignItems: 'center',
            justifyContent: 'center', fontSize:'1rem'
        }}>
           <p> 
               <Icon type="github" />
               <a href="https://github.com/bumjin1013"> https://github.com/bumjin1013 </a> 
           </p>
        </div>
    )
}

export default Footer
