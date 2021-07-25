const express = require('express');
const router = express.Router();
const { Owner } = require("../models/Owner");

const { auth } = require("../middleware/authOwner");

//=================================
//             Owner
//=================================

router.get("/auth/owner", auth, (req, res) => {
    res.status(200).json({
        _id: req.owner._id,
        isAdmin: req.owner.role === 0 ? false : true,
        isAuth: true,
        email: req.owner.email,
        name: req.owner.name,
        lastname: req.owner.lastname,
        role: req.owner.role,
        image: req.owner.image,
    });
});

router.post("/register/owner", (req, res) => {

    const owner = new Owner(req.body);

    owner.save((err, doc) => {
        if (err) return res.json({ success: false, err });
        return res.status(200).json({
            success: true
        });
    });
});

router.post("/login/owner", (req, res) => {
    Owner.findOne({ email: req.body.email }, (err, owner) => {
        if (!owner)
            return res.json({
                loginSuccess: false,
                message: "Auth failed, email not found"
            });

            owner.comparePassword(req.body.password, (err, isMatch) => {
            if (!isMatch)
                return res.json({ loginSuccess: false, message: "Wrong password" });

                owner.generateToken((err, owner) => {
                if (err) return res.status(400).send(err);
                res.cookie("w_authExp", owner.tokenExp);
                res
                    .cookie("w_auth", owner.token)
                    .status(200)
                    .json({
                        loginSuccess: true, ownerId: owner._id
                    });
            });
        });
    });
});

router.get("/logout", auth, (req, res) => {
    Owner.findOneAndUpdate({ _id: req.owner._id }, { token: "", tokenExp: "" }, (err, doc) => {
        if (err) return res.json({ success: false, err });
        return res.status(200).send({
            success: true
        });
    });
});

module.exports = router;
