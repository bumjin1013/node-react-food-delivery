import React, { useState, useEffect } from 'react';

const { kakao } = window;

function Distance(props) {

    var geocoder = new kakao.maps.services.Geocoder();

    const [Origin, setOrigin] = useState();
    const [Destination, setDestination] = useState();


    useEffect(() => {
        // 상점 주소를 좌표로 변경
        geocoder.addressSearch(props.storeAddress, function(result, status) {
            // 정상적으로 검색이 완료됐으면 
            if (status === kakao.maps.services.Status.OK) {
                setOrigin(new kakao.maps.LatLng(result[0].y, result[0].x));
            } 
        });    

        // 유저의 주소를 좌표로 변경
        geocoder.addressSearch(props.myAddress, function(result, status) {
            // 정상적으로 검색이 완료됐으면 
            if (status === kakao.maps.services.Status.OK) {
                setDestination(new kakao.maps.LatLng(result[0].y, result[0].x));
            } 
        });    

        
    }, [])

    const polyline = new kakao.maps.Polyline({
        /* map:map, */
        path : [
        new kakao.maps.LatLng(Origin && Origin.Ma, Origin && Origin.La),
        new kakao.maps.LatLng(Destination && Destination.Ma, Destination && Destination.La)
        ],
    strokeWeight: 2,
    strokeColor: '#FF00FF',
    strokeOpacity: 0.8,
    strokeStyle: 'dashed'
    });    
   
   
    console.log(polyline.getLength())
    return (
        polyline.getLength().toFixed(0)
    );

}
    

export default Distance;