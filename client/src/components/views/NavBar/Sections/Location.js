import React, { useState } from 'react'
import Geocode from "react-geocode";

function Location() {

    const [Latitude, setLatitude] = useState(); //위도
    const [Longitude, setLongitude] = useState(); //경도
    const [Address, setAddress] = useState(); //주소

    //현재 디바이스의 위도 경도 가져오기
    const myLocation = () => (
        navigator.geolocation.getCurrentPosition(function(position) {
            setLongitude(position.coords.latitude); // 위도
            setLatitude(position.coords.longitude); // 경도
        })
    )

    Geocode.enableDebug();

    const getAddressFromLatLng = (Latitude, Longitude) => (
        Geocode.fromLatLng(Latitude, Longitude).then(
          response => {
            const address = response.results[0].formatted_address;
            console.log(address);
            setAddress(address);
          },
          error => {
            console.log(error);
          }
        )
    )
      
  
    return (
        <div>
            {Address}
        </div>
    )
}

export default Location
