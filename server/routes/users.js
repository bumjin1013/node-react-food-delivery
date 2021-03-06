const express = require('express');
const router = express.Router();
const { User } = require("../models/User");
const { auth } = require("../middleware/auth");

//=================================
//             User
//=================================

//인증
router.get("/auth", auth, (req, res) => {
    res.status(200).json({
        _id: req.user._id,
        isAdmin: req.user.role === 0 ? false : true,
        isAuth: true,
        email: req.user.email,
        name: req.user.name,
        lastname: req.user.lastname,
        nickname: req.user.nickname,
        role: req.user.role,
        address: req.user.address,
        image: req.user.image,
        cart: req.user.cart,
        history: req.user.history,
        review: req.user.review,
        coupon: req.user.coupon,
        heart: req.user.heart
    });
});

//이메일 중복확인
router.get("/duplicate", (req, res) => {
    User.find({ email: req.body.email })
    .exec((err, result) => {
        if (err) return res.status(400).json({ success: false, err })
        res.status(200).json({ success: true, result })
    });
});

router.post("/register", (req, res) => {
    const user = new User(req.body);

    user.save((err, doc) => {
        if (err) return res.json({ success: false, err });
        return res.status(200).json({
            success: true
        });
    });
});

//로그인
router.post("/login", (req, res) => {
    User.findOne({ email: req.body.email }, (err, user) => {
        if (!user)
            return res.json({
                loginSuccess: false,
                message: "Auth failed, email not found"
            });

        user.comparePassword(req.body.password, (err, isMatch) => {
            if (!isMatch)
                return res.json({ loginSuccess: false, message: "Wrong password" });

            user.generateToken((err, user) => {
                if (err) return res.status(400).send(err);
                res.cookie("w_authExp", user.tokenExp);
                res
                    .cookie("w_auth", user.token)
                    .status(200)
                    .json({
                        loginSuccess: true, userId: user._id, token: user.token
                    });
            });
        });
    });
});

//자동 로그인
router.post("/login/token", (req, res) => {
    User.findOne({ email: req.body.email }, (err, user) => {
        if (user.token != req.body.token)
            return res.json({
                loginSuccess: false,
                message: "token has expired"
            });

        user.generateToken((err, user) => {
            if (err) return res.status(400).send(err);
            res.cookie("w_authExp", user.tokenExp);
            res
                .cookie("w_auth", user.token)
                .status(200)
                .json({
                    loginSuccess: true, userId: user._id, token: user.token
                });
            });
        });
    });


//로그아웃
router.get("/logout", auth, (req, res) => {
    User.findOneAndUpdate({ _id: req.user._id }, { token: "", tokenExp: "" }, (err, doc) => {
        if (err) return res.json({ success: false, err });
        return res.status(200).send({
            success: true
        });
    });
});

//장바구니 추가
router.post("/cart", auth, (req, res) => {

    console.log(req.body);
    //먼저  User Collection에 해당 유저의 정보를 가져오기 
    User.findOne({ _id: req.user._id },
        (err, userInfo) => {

            // 가져온 정보에서 카트에다 넣으려 하는 상품이 이미 들어 있는지 확인 
            let duplicate = false;
            // 담으려고 하는 메뉴의 상점Id가 다를경우
            let difStore = false;

            userInfo.cart.forEach((item) => {
                if (item.id === req.body.menuId) {
                    duplicate = true;
                }
                if(item.storeId !== req.body.storeId) {
                    difStore = true;
                }
            })
            
            //담으려고 하는 메뉴의 상점Id가 이미 담겨있는 메뉴의 상점Id와 다를 때
            if(difStore){
                User.findOneAndUpdate(
                    { _id: req.user._id },
                    {
                        $set: {
                            cart: {
                                id: req.body.menuId,
                                name: req.body.name,
                                quantity: 1,
                                date: Date.now(),
                                price: req.body.price,
                                image: req.body.image,
                                storeId: req.body.storeId,
                                storeName: req.body.storeName,
                                storeImage: req.body.storeImage
                            }
                        }
                    },
                    { new: true },
                    (err, userInfo) => {
                        if (err) return res.status(400).json({ success: false, err })
                        res.status(200).send(userInfo.cart)
                    }
                )
            
            } else {
                 //상품이 이미 있을때
                if (duplicate) {
                    User.findOneAndUpdate(
                        { _id: req.user._id, "cart.id": req.body.menuId },
                        { $inc: { "cart.$.quantity": 1 } },
                        { new: true },
                        (err, userInfo) => {
                            if (err) return res.status(400).json({ success: false, err })
                            res.status(200).send(userInfo.cart)
                        }
                    )
                }
                //상품이 이미 있지 않을때 
                else {
                    User.findOneAndUpdate(
                        { _id: req.user._id },
                        {
                            $push: {
                                cart: {
                                    id: req.body.menuId,
                                    name: req.body.name,
                                    quantity: 1,
                                    date: Date.now(),
                                    price: req.body.price,
                                    image: req.body.image,
                                    storeId: req.body.storeId,
                                    storeName: req.body.storeName,
                                    storeImage: req.body.storeImage
                                }
                            }
                        },
                        { new: true },
                        (err, userInfo) => {
                            if (err) return res.status(400).json({ success: false, err })
                            res.status(200).send(userInfo.cart)
                        }
                    )
                }
            }
        })
});

//장바구니에서 선택 상품 삭제
router.delete('/cart', auth, (req, res) => {

    User.findOneAndUpdate(
        { _id: req.user._id },
        {
            "$pull":
                { "cart": { "id": req.body.menuId } }
        },
        { new: true },
        (err, userInfo) => {
            if (err) return res.status(400).json({ success: false, err })
            res.status(200).send(userInfo.cart)
        }
    )
})

//장바구니 상품 조회
router.get('/cart', auth, (req, res) => {

    User.findOne({ _id: req.user._id })
    .exec((err, doc) => {

        if (err) return res.status(400).json({ success: false, err })
        res.status(200).send(doc.cart)
    });
})

//장바구니 상품 수량 변경
router.put('/cart', auth, (req, res) => {
    
    //+ 버튼을 눌렀을 경우
    if(req.body.quantity == true) {
        User.findOneAndUpdate({ _id: req.user._id, cart: { $elemMatch: { id: req.body.menuId }} },
            {
                $inc: { "cart.$.quantity": 1 }
            },
            { new: true },
            (err, userInfo) => {
                if (err) return res.status(400).json({ success: false, err })
                res.status(200).send(userInfo.cart)
            })
    //- 버튼을 눌렀을 경우
    } else {
        User.findOneAndUpdate({ _id: req.user._id, cart: { $elemMatch: { id: req.body.menuId }} },
            {
                $inc: { "cart.$.quantity": -1 }
            },
            { new: true },
            (err, userInfo) => {
                if (err) return res.status(400).json({ success: false, err })
                res.status(200).send(userInfo.cart)
            })
    }
})

//주문 
router.post("/order", auth, (req, res) => {

    //사용한 쿠폰이 존재하면 쿠폰 삭제
    if(req.body.coupon != null) {
        User.findOneAndUpdate(
            { _id: req.user._id },
            {
                "$pull":
                    { "coupon": { "coupon": req.body.coupon.coupon } }
            },
            { new: true }
        )
    }
    
    //history정보 업데이트
    User.findOneAndUpdate({ _id: req.user._id },{
        $push: {
            history: {
              storeId: req.body.storeId, 
              storeName: req.body.storeName,
              menu: req.body.menu,
              address: req.body.address,
              phoneNumber: req.body.phoneNumber,
              price: req.body.price,
              toOwner: req.body.toOwner,
              toRider: req.body.toRider,
              orderTime: req.body.orderTime,
              orderId: req.body.orderId,
              reviewAuth: false,
              socketId: null,
              review: [],
              state: '주문 확인중'
            }},
              $set:{cart: []} //주문 성공후 장바구니를 비워줌
            },{ new: true },
            (err, orderInfo) => {
                if (err) return res.status(400).json({ success: false, err })
                res.status(200).send({ success: true, orderInfo })
            }
          )
});
  
//주문내역
router.get('/history', auth, (req, res) => {
   console.log('history');
    User.findOne({ _id: req.user._id })
    .exec((err, doc) => {
        if (err) return res.status(400).json({ success: false, err })
        res.status(200).json( doc.history )
    });
});

//주문 상태 변경
router.post('/history', (req, res) => {
    //배달 완료시 리뷰 권한 true
    if(req.body.state === "배달완료"){
        User.findOneAndUpdate({_id: req.body.userId, history: { $elemMatch: {orderId: req.body.orderId }}},{
            "$set": {
                "history.$.state": req.body.state,
                "history.$.reviewAuth": true
                }
            },{ new: true },
            (err, doc) => {
                if (err) return res.status(400).json({ success: false, err })
                res.status(200).json({ success: true })
            }
        );
    } else {
        User.findOneAndUpdate({_id: req.body.userId, history: { $elemMatch: {orderId: req.body.orderId }}},{
            "$set": {
                "history.$.state": req.body.state
                }
            },{ new: true },
            (err, doc) => {
                if (err) return res.status(400).json({ success: false, err })
                res.status(200).json({ success: true })
            }
        );
    }
})


//유저 정보 출력 (마이페이지)
router.get('/info', auth, (req, res) => {

    User.findOne({ _id: req.user._id })
    .exec((err, userInfo) => {
        if (err) return res.status(400).json({ success: false, err })
        res.status(200).json({ success: true, userInfo })
    });
})

//닉네임 수정
router.post('/info', auth, (req, res) => {

    User.findOneAndUpdate({ _id: req.user._id },{
        $set:{nickname: req.body.nickname}  
        },{ new: true },
        (err, userInfo) => {
            if (err) return res.status(400).json({ success: false, err })
            res.status(200).send({ success: true, userInfo })
        }
    )
})

//주소 추가
router.post('/address', auth, (req, res) => {

    User.findOneAndUpdate({ _id: req.user._id },{
        $set:{
            address: {
                address: req.body.address,
                detail: req.body.detail
            }
        }  
        },{ new: true },
        (err, result) => {
            if (err) return res.status(400).json({ success: false, err })
            console.log(result.address);
            res.status(200).send({ success: true, address: result.address })
        }
    )
})

//리뷰 추가
router.post("/review", auth, (req, res) => {
    //주문번호로 history에서 주문내역을 찾은후 리뷰 추가, reviewAuth를 false로 변경
    User.findOneAndUpdate({ _id : req.user._id, history: {$elemMatch: {orderId: req.body.orderId }}},{
        "$push": {
            "history.$.review": {
                "createdAt" : Date(),
                "writer": req.body.writer, 
                "contents": req.body.contents,
                "image": req.body.image,
                "star": req.body.star
            }},
        "$set": {
            "history.$.reviewAuth": false
        }
        },{ new: true },
        (err, result) => {
            if (err) return res.status(400).json({ success: false, err })
            res.status(200).send({ success: true, history: result.history })
        }
      )
  });

//10000원 쿠폰 받기
router.post('/coupon', auth, (req, res) => {
    User.findOneAndUpdate({ _id: req.user._id },{
        "$push": {
            "coupon": {
                "coupon": req.body.coupon,
                "value": req.body.value,
                "minPrice": req.body.minPrice,
                "contents": req.body.contents,
                "isUsed": false
            }
        }
    },{ new: true },
    (err, couponInfo) => {
        if (err) return res.status(400).json({ success: false, err })
        res.status(200).send({ success: true, couponInfo })
    })
})

//결제 페이지 - 상품의 토탈 가격을 백엔드 에서 계산에서 json으로 추가해 넘겨줌
router.get('/payments', auth, (req, res) => {

    let totalPrice = 0;

    User.findOne({ _id: req.user._id })
    .exec((err, userInfo) => {
        //장바구니에 담겨있는 상품의 가격 * 개수 
        userInfo.cart.map((cart, index) => {
            totalPrice += cart.price * cart.quantity
        })
        //userInfo object에 직접 object값을 변경해줘도 반영이 되지 않음 
        //userInfo 를 Deep Copy하여 paymentsInfo를 만들어 준후 totalPrice값을 paymentsInfo에 추가해 준 후 paymentsInfo를 res.json으로 보냄
        paymentsInfo = JSON.parse(JSON.stringify(userInfo)); 
        paymentsInfo["totalPrice"] = totalPrice;

        if (err) return res.status(400).json({ success: false, err })
        res.status(200).json({ success: true, paymentsInfo })
    });
})

//찜 목록에 추가
router.post('/heart', auth, (req, res) => {

    User.findOneAndUpdate({ _id : req.user._id },{
        "$push": {
            "heart": {
                "storeId": req.body.storeId,
            }
        }},{ new: true },
        (err, result) => {
            if (err) return res.status(400).json({ success: false, err })
            res.status(200).send({ success: true, heart: result.heart })
        }
      )
})

//찜 목록에서 제거
router.delete('/heart', auth, (req, res) => {

    User.findOneAndUpdate({ _id : req.user._id },{
        "$pull": {
            "heart": {
                "storeId": req.body.storeId,
            }
        }},{ new: true },
        (err, result) => {
            if (err) return res.status(400).json({ success: false, err })
            res.status(200).send({ success: true, heart: result.heart })
        }
      )
})

module.exports = router;
