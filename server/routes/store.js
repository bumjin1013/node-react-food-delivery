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
    location: { address: req.body.address },
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
  let type = req.query.type;
  let storeIds = req.query.id;

  if (type === "array") {
    //id=123123123,324234234,324234234 이거를
    //productIds = ['123123123', '324234234', '324234234'] 이런식으로 바꿔주기
    let ids = req.query.id.split(",");
    storeIds = ids.map((item) => {
      return item;
    });
  } 

  //productId를 이용해서 DB에서  productId와 같은 상품의 정보를 가져온다.

  Store.find({ _id: { $in: storeIds } })
    .populate("id")
    .exec((err, store) => {
      if (err) return res.status(400).send(err);
      return res.status(200).json(store);
    });
});

router.get("/stores_by_id/getMenu", (req, res) => {

})



//메뉴 추가
router.post("/addMenu", (req, res) => {

  Store.findOneAndUpdate({ _id : req.body.id},{
    '$push': {
      "menu": {
        "name": req.body.name, 
        "price": req.body.price,
        "image": req.body.image
      }}},{ new: true },
      (err, menuInfo) => {
          if (err) return res.status(400).json({ success: false, err })
          res.status(200).send({ success: true, menuInfo })
      }
    )
});

//치킨 카테고리
router.get("/category", (req, res) => {

  let category = req.query.category;

  Store.find({ "category" : category })
    .exec((err, store) => {
      if (err) return res.status(400).send({ success: false, err });
      return res.status(200).send({ success: true, store });
      
    });
});

//Store 스키마의 review에 유저의 리뷰 추가
router.post("/addreview", (req, res) => {

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
          state: "확인중"
        }}},{ new: true },
        (err, orderInfo) => {
            if (err) return res.status(400).json({ success: false, err })
            res.status(200).send({ success: true, orderInfo })
        }
  );
})

//사장님 댓글 추가
router.post('/addcomments', (req, res) => {

  console.log(req.body);

  Store.findOneAndUpdate({_id: req.body.storeId, review: { $elemMatch: {_id: req.body.reviewId }}},{
    "$push": {
      "review.$.comments": req.body.comments
        }},{ new: true },
        (err, commentsInfo) => {
            if (err) return res.status(400).json({ success: false, err })
            res.status(200).json({ success: true, commentsInfo })
        }
  );
})


//상점 정보 수정
router.post('/editstoreinfo', (req, res) => {

  console.log(req.body);

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

//메뉴 수정
router.post('/updatemenu', (req, res) => {

  console.log(req.body);


  Store.findOneAndUpdate({_id: req.body.storeId, menu: { $elemMatch: {_id: req.body.menuId }}},{
    "$set": {
      "menu.$.name": req.body.name,
      "menu.$.price": req.body.price
        }},{ new: true },
        (err, changedInfo) => {
            if (err) return res.status(400).json({ success: false, err })
            res.status(200).json({ success: true, changedInfo })
        }
  );
})

//메뉴 삭제
router.post('/deletemenu', (req, res) => {

  console.log(req.body);
  Store.findOneAndUpdate({_id: req.body.storeId, menu: { $elemMatch: {_id: req.body.menuId }}},{
    "$pull": {
      "menu": {
        _id: req.body.menuId
      }}},{ new: true },
        (err, changedInfo) => {
            if (err) return res.status(400).json({ success: false, err })
            res.status(200).json({ success: true, changedInfo })
        }
  );
})

// 판매중 <-> 품절 상태 변경
router.post('/changestate', (req, res) => {

  console.log(req.body);
  Store.findOneAndUpdate({_id: req.body.storeId, menu: { $elemMatch: {_id: req.body.menuId }}},{
    "$set": {
      "menu.$.state": req.body.state
      }},{ new: true },
        (err, changedInfo) => {
            if (err) return res.status(400).json({ success: false, err })
            res.status(200).json({ success: true, changedInfo })
        }
  );
})

//주문 상태 변경
// 주문확인 -> 조리중 
// 주문취소 -> 주문취소 
// 배달출발 -> 배달중 
// 배달완료 -> 배달완료 
router.post('/updateorderstate', (req, res) => {

  console.log(req.body);

  //body로 받은 storeId, orderId를 이용하여 찾고 state를 body.state로 변경
  Store.findOneAndUpdate({_id: req.body.storeId, order: { $elemMatch: {orderId: req.body.orderId }}},{
    "$set": {
      "order.$.state": req.body.state
      }},{ new: true },
        (err, changedInfo) => {
            if (err) return res.status(400).json({ success: false, err })
            res.status(200).json({ success: true, changedInfo })
        }
  );
})


module.exports = router;
