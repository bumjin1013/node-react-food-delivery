import React, { useEffect, useState } from "react";
import axios from "axios";
import MenuBar from './Section/MenuBar/MenuBar';


function OwnerDetailStorePage(props) {
  const storeId = props.match.params.storeId;

  const [Store, setStore] = useState({});

  useEffect(() => {
    axios.get(`/api/store/stores_by_id?id=${storeId}&type=single`)
      .then((response) => {
        setStore(response.data[0]);
        console.log(response.data[0])
      })
      .catch((err) => alert(err));

     
  }, []);

  return (
    <div>
      <MenuBar />
    </div>
  );
}

export default OwnerDetailStorePage;
