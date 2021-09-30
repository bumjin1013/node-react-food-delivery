import React, { useEffect } from 'react';

const { kakao } = window;

function Distance(props) {
    
    console.log('Distance실행');
    
    let mlon = 36.36312534027716; 
    let mlat = 127.34761826956469;
    let vlon = 36.36158769651651;
    let vlat = 127.34974254072932;

    const polyline = new kakao.maps.Polyline({
        /* map:map, */
        path : [
        new kakao.maps.LatLng(mlon,mlat),
        new kakao.maps.LatLng(vlon,vlat)
        ],
     strokeWeight: 2,
     strokeColor: '#FF00FF',
     strokeOpacity: 0.8,
     strokeStyle: 'dashed'
    });
    
    //return getTimeHTML(polyline.getLength());//미터단위로 길이 반환;
    console.log("길이"+polyline.getLength());
    return polyline.getLength();
    
}
    

export default Distance;