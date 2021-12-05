const express = require("express");
const router = express.Router();
const multer = require("multer");
const { Store } = require("../models/Store");
const { auth } = require("../middleware/authOwner");
//=================================
//             Store
//=================================

//multer로 이미지 저장
var storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "uploads/");
  },
  filename: function (req, file, cb) {
    cb(null, `${Date.now()}_${file.originalname}`);
  },
});

var upload = multer({ storage: storage }).single("file");

router.post("/image", (req, res) => {
  //가져온 이미지를 저장을 해주면 된다.
  upload(req, res, (err) => {
    if (err) {
      return req.json({ success: false, err });
    }
    return res.json({
      success: true,
      filePath: res.req.file.path,
      fileName: res.req.file.filename,
    });
  });
});


router.post("/",  (req, res) => {
  let store = new Store({
    id: req.body.id,
    title: req.body.title,
    description: req.body.description,
    image: req.body.image,
    category: req.body.category,
    address: req.body.address ,
    image: req.body.image,
  });

  store.save((err) => {
    if (err) return res.status(400).json({ success: false, err });
    return res.status(200).json({ success: true });
  });
});

router.get("/stores",  auth, (req, res) => {
  Store.find({ "id": req.owner._id })
    .exec((err, storeInfo) => {
      if (err) return res.status(400).json({ success: false, err });
      return res.status(200).json({ success: true, storeInfo });
    });
});

router.get("/stores_by_id",  (req, res) => {

  let storeId = req.query.id;
  
  Store.find({ _id: { $in: storeId } }, {
    "order": false
  })
    .populate("id")
    .exec((err, doc) => {
      
      
      //별점 계산
      let totalStar = 0;
    
      for(let i=0; i<doc[0].review.length; i++){
        totalStar += doc[0].review[i].star
      }
    
      // 평균 별점
      let star;
      //리뷰가 1개 이상이면 더한 총 별점 / 리뷰 갯수 = Star , 리뷰가 없으면 0
      doc[0].review.length > 0 ? star = (totalStar/doc[0].review.length).toFixed(1) : star = 0

      //계산한 별점 store object에 추가하여 response
      store = JSON.parse(JSON.stringify(doc)); 
      store["star"] = star;

      if (err) return res.status(400).send({ sucess: false, err});
      return res.status(200).json({ success: true, store, star });
    });
});

//get menu
router.get("/menu", (req, res) => {
  
  Store.findOne({ _id : req.query.id})
  .exec((err, store) => {
    if (err) return res.status(400).send(err);
    return res.status(200).json(store.menu);
    
  });
})

//add menu
router.post("/menu", (req, res) => {

  Store.findOneAndUpdate({ _id : req.body.id},{
    '$push': {
      "menu": {
        "name": req.body.name, 
        "price": req.body.price,
        "image": req.body.image
      }}},{ new: true },
      (err, menuInfo) => {
          if (err) return res.status(400).json({ success: false, err })
          res.status(200).send( menuInfo.menu )
      }
    )
});

//edit menu
router.put('/menu', (req, res) => {

  Store.findOneAndUpdate({_id: req.body.storeId, menu: { $elemMatch: {_id: req.body.menuId }}},{
    "$set": {
      "menu.$.name": req.body.name,
      "menu.$.price": req.body.price
        }},{ new: true },
        (err, changedInfo) => {
            if (err) return res.status(400).json({ success: false, err })
            res.status(200).json( changedInfo.menu )
        }
  );
})

//delete menu
router.delete('/menu', (req, res) => {

  Store.findOneAndUpdate({_id: req.body.storeId, menu: { $elemMatch: {_id: req.body.menuId }}},{
    "$pull": {
      "menu": {
        _id: req.body.menuId
      }}},{ new: true },
        (err, changedInfo) => {
            if (err) return res.status(400).json({ success: false, err })
            res.status(200).json(changedInfo.menu)
        }
  );
})

//카테고리
router.get("/category", (req, res) => {

  let si = req.query.address.split(' ')[0];
  let gu = req.query.address.split(' ')[1];
  let ro = req.query.address.split(' ')[2];

  Store.find({ "category" : req.query.category, "deliveryArea" : { $elemMatch : { "si": si, "gu": gu, "ro": ro}} },{
    "_id": true,
    "image": true,
    "title": true,
    "review": true
  })
    .exec((err, store) => {
      if (err) return res.status(400).send({ success: false, err });
      return res.status(200).send({ success: true, store });
      
    });
});

//리액트 네이티브 상점 호출 
router.get("/list", (req, res) => {
  
  let si = req.query.address.split(' ')[0];
  let gu = req.query.address.split(' ')[1];
  let ro = req.query.address.split(' ')[2];

  Store.find({ "deliveryArea" : { $elemMatch : { "si": si, "gu": gu, "ro": ro}} },{
    "_id": true,
    "image": true,
    "title": true,
    "category": true,
    "review": {
      "star":true
    },
    "menu": true
  })
    .exec((err, store) => {
      if (err) return res.status(400).send({ success: false, err });
      return res.status(200).send({ success: true, store });
      
    });
});

//Store 스키마의 review에 유저의 리뷰 추가
router.post("/review", (req, res) => {

  Store.findOneAndUpdate({ _id : req.body.id},{
    "$push": {
      "review": {
        "createdAt" : Date(),
        "writer": req.body.writer, 
        "contents": req.body.contents,
        "image": req.body.image,
        "star": req.body.star
      }}},{ new: true },
      (err, reviewInfo) => {
          if (err) return res.status(400).json({ success: false, err })
          res.status(200).send({ success: true, reviewInfo })
      }
    )
});

//get Review
router.get("/review", (req, res) => {
  
  Store.findOne({ _id : req.query.id})
  .exec((err, store) => {
    if (err) return res.status(400).send(err);
    return res.status(200).json(store.review);
    
  });
})

//add comments
router.post('/comments', (req, res) => {

  Store.findOneAndUpdate({_id: req.body.storeId, review: { $elemMatch: {_id: req.body.reviewId }}},{
    "$push": {
      "review.$.comments": req.body.comments
        }},{ new: true },
        (err, store) => {
            if (err) return res.status(400).json({ success: false, err })
            res.status(200).json(store.review)
        }
  );
})


//get order
router.get("/order", (req, res) => {
  
  Store.findOne({ _id : req.query.id})
  .exec((err, store) => {
    if (err) return res.status(400).send(err);
    return res.status(200).json(store.order);
    
  });
})

//상점의 order에 주문내역 넣기
router.post('/order', (req, res) => {
  Store.findOneAndUpdate({ _id: req.body.storeId },{
    $push: {
        order: {
          userId: req.body.userId,
          menu: req.body.menu,
          address: req.body.address,
          phoneNumber: req.body.phoneNumber,
          price: req.body.price,
          toOwner: req.body.toOwner,
          toRider: req.body.toRider,
          orderId: req.body.orderId,
          orderTime: req.body.orderTime,
          socketId: null,
          state: "확인중"
        }}},{ new: true },
        (err, orderInfo) => {
            if (err) return res.status(400).json({ success: false, err })
            res.status(200).send({ success: true, orderInfo })
        }
  );
})

//edit info
router.put('/info', (req, res) => {

  Store.findOneAndUpdate({_id: req.body.storeId},{
    $set: {
      description: req.body.description
        }},{ new: true },
        (err, changedInfo) => {
            if (err) return res.status(400).json({ success: false, err })
            res.status(200).json({ success: true, changedInfo })
        }
    );
})

// 판매중 <-> 품절 상태 변경
router.put('/state', (req, res) => {

  Store.findOneAndUpdate({_id: req.body.storeId, menu: { $elemMatch: {_id: req.body.menuId }}},{
    "$set": {
      "menu.$.state": req.body.state
      }},{ new: true },
        (err, result) => {
            if (err) return res.status(400).json({ success: false, err })
            res.status(200).json({success: true, order: result.order})
        }
  );
})

//주문 상태 변경
// 주문확인 -> 조리중 
// 주문취소 -> 주문취소 
// 배달출발 -> 배달중 
// 배달완료 -> 배달완료 
router.put('/order-state', (req, res) => {

  //body로 받은 storeId, orderId를 이용하여 찾고 state를 body.state로 변경
  Store.findOneAndUpdate({ _id: req.body.storeId, order: { $elemMatch: { orderId: req.body.orderId }}},{
    "$set": {
      "order.$.state": req.body.state
      }},{ new: true },
        (err, result) => {
            if (err) return res.status(400).json({ success: false, err })
            res.status(200).json({ success: true, order: result.order})
        }
  );
})

//배달 지역 정보 가져오기
router.get('/area', (req, res) => {
  Store.findOne({ _id: req.query.storeId },{
    "_id": false,
    "deliveryArea": true
  })
  .exec((err, doc) => {
    if (err) return res.status(400).send(err);
    return res.status(200).json(doc.deliveryArea);
  });
})

//배달 지역 추가
router.post('/area', (req, res) => {
  Store.findOneAndUpdate({ _id: req.body.storeId },{
    "$push": {
      "deliveryArea": {
        "si": req.body.si,
        "gu": req.body.gu,
        "ro": req.body.ro
      }}},{ new: true },
        (err, store) => {
            if (err) return res.status(400).json({ success: false, err })
            res.status(200).json(store.deliveryArea)
        }
  );
})

//배달 지역 삭제
router.delete('/area', (req, res) => {

  Store.findOneAndUpdate({ _id: req.body.storeId }, {
    "$pull": {
      "deliveryArea": { 
        _id: req.body._id 
      }}},{ new: true },
  (err, doc) => {
      if (err) return res.status(400).json({ success: false, err })
      res.status(200).json(doc.deliveryArea)
  })

})

//본인 상점을 찜한 유저의 _id 추가
router.post('/heart', (req, res) => {

  Store.findOneAndUpdate({ _id : req.body.storeId },{
      "$push": {
        "heart":{
          "userId": req.body.userId,
        }
      }},{ new: true },
      (err, result) => {
          if (err) return res.status(400).json({ success: false, err })
          res.status(200).send({ success: true })
      }
    )
})

//찜 목록에서 user._id 삭제
router.delete('/heart', (req, res) => {

  console.log(req.body);

  Store.findOneAndUpdate({ _id : req.body.storeId },{
      "$pull": {
        "heart":{
          "userId": req.body.userId,
        }
      }},{ new: true },
      (err, result) => {
          if (err) return res.status(400).json({ success: false, err })
          res.status(200).send({ success: true })
      }
    )
})

module.exports = router;
