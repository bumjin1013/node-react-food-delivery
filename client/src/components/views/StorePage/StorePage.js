import React, { useEffect, useState } from "react";
import { Empty, Button } from "antd";
import axios from "axios";
import { Icon, Col, Card, Row, Carousel } from "antd";
import ImageSlider from "../../utils/ImageSlider";
import Meta from "antd/lib/card/Meta";

function StorePage() {
  useEffect(() => {
    axios.get("/api/store/stores").then((response) => {
      if (response.data.success) {
        setStores(response.data.storeInfo);
      } else {
        alert(" 상점을 로드하는데 실패하였습니다. ");
      }
    });
  }, []);

  const [Stores, setStores] = useState([]);

  const renderCards = Stores.map((store, index) => {
    
    console.log(store);

    return (
      <Col lg={6} md={8} xs={24} key={index}>
        <Card
          hoverable
          cover={
            <a href={`/store/${store._id}/order/proceeding`}>
              <img
                style={{ width: "100%", maxHeight: "150px" }}
                src={`http://localhost:5000/${store.image[0]}`}
              />
            </a>
          }
        >
          <Meta title={store.title} />
        </Card>
      </Col>
    );
  });

  return (
    <div style={{ width: "75%", margin: "3rem auto" }}>

      {Stores.length>0 ?
      <Row gutter={[16, 16]}>{renderCards}</Row>
        :
      <Empty
        image={Empty.PRESENTED_IMAGE_SIMPLE}
        imageStyle={{
          height: 60,
        }}
        description={<span>운영 중인 가게가 없습니다</span>}
      />
    }
      <a href="/store/addstore">
        <br />
        <br />
        <Button type="primary">가게 추가하기</Button>
      </a>
    </div>
  );
}

export default StorePage;
