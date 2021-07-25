const { Owner } = require('../models/Owner');

let auth = (req, res, next) => {
  let token = req.cookies.w_auth;

  Owner.findByToken(token, (err, owner) => {
    if (err) throw err;
    if (!owner)
      return res.json({
        isAuth: false,
        error: true
      });

    req.token = token;
    req.owner = owner;
    next();
  });
};

module.exports = { auth };
