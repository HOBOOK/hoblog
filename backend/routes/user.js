/* leaf Controller */
const express = require('express');
const cors = require('cors');
let router = express.Router();
const transport = require('../plugins/mail.transport')
const usersController = require('../controller/user.controller');
const config = require('config');
const jwt = require('jsonwebtoken');
const SECRET_KEY = config.get('secretKey');

/* Models */
let users = require("../model/user")

router.post('/login', usersController.createToken);
router.post('/new', usersController.createNewUser);
router.put('/profile', usersController.updateUser);
//회원가입 인증 메일
router.post('/email/signup', (req, res, next) => {
  const email = req.body
  users
    .findOne({ email: email.to })
    .then(users => {
      if (!users) {
        const token = jwt.sign({
          id: email.to
        }, SECRET_KEY, {
          subject: email.type,
          expiresIn: '1h'
        });
        transport.sendMail({
          from: `leeflog <hobookmanager@gmail.com>`,
          to: email.to,
          subject: 'leeflog 회원가입 인증',
          text: 'text',
          html: `
            <div style="text-align: center;">
              <h3 style="color: #FA5882">ABC</h3>
              <br />
              <a href=`+ req.headers.origin + `/sign?token=` + token + `>회원가입</a>
              <br />
              <p>text</p>
            </div>
          `})
          .then(r => {
            res.status(200).json({
              message: "send email success",
              data: r
            });
          })
          .catch(err => {
            console.log(err)
            next(err)
          })
      } else {
        res.status(500).json({
          message: "이미 사용중인 이메일입니다.",
          data: null
        });
      }
      
    })
})

// Read by user Id
router.get("/:id", cors(), function(req, res, next) {
    const userId = req.params.id;
    users
      .findOne({ id: userId })
      .then(users => {
        if (!users) return res.status(404).json({ message: "users not found" });
        console.log("Read Detail 완료");
        res.status(200).json({
          message: "users Detail success",
          data: users
        });
      })
      .catch(err => {
        res.status(500).json({
          message: err
        });
      });
  });

  // Update
router.put("/", cors(), function(req, res, next) {
  const { id, root, keyIndexes } = req.body; // 비구조화 할당

  users
    .findOne({ id: req.body.id })
    .then(leaf => {
      if (!user) return res.status(404).json({message: "user not found"});
      user.root = req.body.root
      user.keyIndexes = req.body.keyIndexes
      user.save().then(output => {
        console.log("success update users > " + user);
        res.status(200).json({
          message: "Update user success",
          data: output
        });
      });
    })
    .catch(err => {
      console.log(err)
      res.status(500).json({
        message: err
      });
    });

  
});

module.exports = router;