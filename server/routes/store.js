const express = require('express');
const router = express.Router();
const multer = require('multer');
const { Store } = require("../models/Store");

//=================================
//             Store
//=================================


var storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, 'uploads/')
    },
    filename: function (req, file, cb) {
        cb(null, `${Date.now()}_${file.originalname}`)
    }
})

var upload = multer({ storage: storage }).single("file")

router.post('/image', (req, res) => {

    //가져온 이미지를 저장을 해주면 된다.
    upload(req, res, err => {
        if (err) {
            return req.json({ success: false, err })
        }
        return res.json({ success: true, filePath: res.req.file.path, fileName: res.req.file.filename })
    })

})




router.post('/', (req, res) => {

    let store = new Store(
        { 'id' : req.body.id, 
        'title' : req.body.title,
        'description': req.body.description,
        'image:': req.body.image,
        'category': req.body.category,
        'location': { 'address': req.body.address },
        'image': req.body.image 
        })
    
    console.log(store)

    store.save((err) => {
        if (err) return res.status(400).json({ success: false, err })
        return res.status(200).json({ success: true })
    })

})

router.get('/stores', (req, res) => {

    Store.find()
        .populate("writer")
        .exec((err, storeInfo) => {
            if(err) return res.status(400).json({ success: false, err})
            return res.status(200).json({ success: true, storeInfo})
        })

})

module.exports = router;