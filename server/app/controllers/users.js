const User = require('../models/user.js');

var jwt        = require("jsonwebtoken");

exports.login = function (req, res) {
  User.findOne({name: req.body.name, password: req.body.password}, function(err, user) {
    if (err) {
      res.json({
        type: false,
        data: "Error occured: " + err
      });
    } else {
      if (user) {
          user.token = jwt.sign(user, 'JWT_SECRET');
          user.save(function (err, user1) {
            if (err) {
              res.json({
                type: false,
                err: err
              })
            } else {
              res.json({
                type: true,
                data: user
              })
            }
          })
      } else {
        res.json({
          type: false,
          data: "User already exists!"
        });
      }
    }
  });
};

exports.signup = function(req, res) {
  User.findOne({name: req.body.name, password: req.body.password}, function(err, user) {
    if (err) {
      res.json({
        type: false,
        data: "Error occured: " + err
      });
    } else {
      if (user) {
        res.json({
          type: false,
          data: "User already exists!"
        });
      } else {
        var userModel = new User();
        userModel.name = req.body.name;
        userModel.password = req.body.password;
        userModel.save(function(err, user) {
          user.token = jwt.sign(user, process.env.JWT_SECRET);
          user.save(function(err, user1) {
            res.json({
              type: true,
              data: user1,
              token: user1.token
            });
          });
        })
      }
    }
  });
}

exports.users = function (req, res) {
  User.find('users', function(err, users) {
    console.log(err, users);
    if (err)
      res.send(err);

    res.json(users);
  });
}
