import React, { useState, useEffect } from 'react'
import Geocode from "react-geocode";

Geocode.setApiKey('AIzaSyCySSNpuv0j28_PKnKdTff4IjXF4mYpcwY');
Geocode.enableDebug();
Geocode.setRegion('kor');

const { kakao } = window;

function GetAddress(props) {

  
    const [Address, setAddress] = useState(); //주소
    
    console.log(props.latitude, props.longitude)
    
    useEffect(() => {
        
        console.log(props.latitude, props.longitude);
        console.log('getAddress 실행됨')
        let geocoder = new kakao.maps.services.Geocoder();
      
        let coord = new kakao.maps.LatLng(props.latitude, props.longitude);
        let callback = function(result, status) {
            if (status === kakao.maps.services.Status.OK) {
                setAddress(result[0].address.address_name);
                console.log('Address', Address);
            }
        };
      
        geocoder.coord2Address(coord.getLng(), coord.getLat(), callback);
       
    }, [])

    
    return (
        <div>
         {Address}
        </div>
    )
    
}

export default GetAddress
