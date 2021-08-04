const express = require("express");
const router = express.Router();
const multer = require("multer");
const { Store } = require("../models/Store");
const { User } = require("../models/User");

//=================================
//             Store
//=================================

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

router.post("/", (req, res) => {
  let store = new Store({
    id: req.body.id,
    title: req.body.title,
    description: req.body.description,
    image: req.body.image,
    category: req.body.category,
    location: { address: req.body.address },
    image: req.body.image,
  });

  console.log(store);

  store.save((err) => {
    if (err) return res.status(400).json({ success: false, err });
    return res.status(200).json({ success: true });
  });
});

router.get("/stores", (req, res) => {
  Store.find()
    .populate("writer")
    .exec((err, storeInfo) => {
      if (err) return res.status(400).json({ success: false, err });
      return res.status(200).json({ success: true, storeInfo });
    });
});

router.get("/stores_by_id", (req, res) => {
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

router.get("/stores_by_id/order", (req, res) => {
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
      return res.status(200).send(store);
    });
});

router.get("/stores_by_id/menu", (req, res) => {
  let type = req.query.type;
  let storeIds = req.query.id;

  if (type === "array") {
    //id=123123123,324234234,324234234 이거를
    //productIds = ['123123123', '324234234', '324234234'] 이런식으로 바꿔주기
    let ids = req.query.id.split(",");
    let menus = req.query.menu.split(",");
    storeIds = ids.map((item) => {
      return item;
    });
    menuList = menus.map((menu) => {
      return menu;
      console.log(menu);
    })
  }

  //productId를 이용해서 DB에서  productId와 같은 상품의 정보를 가져온다.

  Store.find({ _id: { $in: storeIds } })
    .populate("id")
    .exec((err, store) => {
      if (err) return res.status(400).send(err);
      return res.status(200).send(store);
    });
});


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

router.get("/chicken", (req, res) => {

  Store.find({ category : "chicken" })
    .exec((err, store) => {
      if (err) return res.status(400).send({ success: false, err });
      return res.status(200).send({ success: true, store });
      
    });
});

router.get("/stores_by_id/detail", (req, res) => {
  let type = req.query.type;
  let storeIds = req.query.id;

  if (type === "array") {
    //id=123123123,324234234,324234234 이거를
    //productIds = ['123123123', '324234234', '324234234'] 이런식으로 바꿔주기
    let ids = req.query.id.split(",");
    let menus = req.query.menu.split(",");
    storeIds = ids.map((item) => {
      return item;
    });
    menuList = menus.map((menu) => {
      return menu;
      console.log(menu);
    })
  }

  //productId를 이용해서 DB에서  productId와 같은 상품의 정보를 가져온다.

  Store.find({ _id: { $in: storeIds } })
    .populate("id")
    .exec((err, store) => {
      if (err) return res.status(400).send(err);
      return res.status(200).send(store);
    });
});

router.post("/addreview", (req, res) => {

  Store.findOneAndUpdate({ _id : req.body.id},{
    '$push': {
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
          OrderTime: Date.now()
        }}},{ new: true },
        (err, orderInfo) => {
            if (err) return res.status(400).json({ success: false, err })
            res.status(200).send({ success: true, orderInfo })
        }
  );
})

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


module.exports = router;
