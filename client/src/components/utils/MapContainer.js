import React, { useEffect } from 'react';

const { kakao } = window;

const MapContainer = (props) => {
    
    let x = (props.x);
    let y = (props.y);

    useEffect(() => {
        const container = document.getElementById('myMap');

        
		const options = {
			center: new kakao.maps.LatLng(x, y),
			level: 3
		};

        const map = new kakao.maps.Map(container, options);

        var markerPosition  = new kakao.maps.LatLng(x, y); 

        // 마커를 생성합니다
        var marker = new kakao.maps.Marker({
            position: markerPosition    
        });

        // 마커가 지도 위에 표시되도록 설정합니다
        marker.setMap(map);


    }, []);


    return (
        <div id='myMap' style={{
            width: '300px', 
            height: '300px',
            textAlign: 'center'
        }}></div>
    );
}

export default MapContainer; 