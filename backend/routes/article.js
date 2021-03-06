/* article Controller */

var express = require('express');
var cors = require('cors');
var router = express.Router();

/* Models */
var articles = require("../model/article")
var users = require("../model/user")

// Create
router.post("/", cors(), function(req, res, next) {
    const { title, content, author, thunbmail, private, prominent, water, comments, view } = req.body; // 비구조화 할당
  
    new articles(req.body)
      .save()
      .then(newArticle => {
        res.status(200).json({
          message: "Create success",
          data: newArticle
        });
      })
      .catch(err => {
        console.log(err)
        res.status(500).json({
          message: err
        });
      });
  });

//update
router.put("/", cors(), function(req, res, next) {
  const { id, title, content, author, thunbmail, private, prominent, water, comments, view } = req.body;

  articles
    .findOne({ id: req.body.id })
    .then(article => {
      if (!article) return res.status(404).json({message: "leaf not found"});
      
      article.title = req.body.title;
      article.content = req.body.content;
      article.thunbmail = req.body.thunbmail;
      article.private = req.body.private;
      article.comments = req.body.comments;
      article.view = req.body.view

      article.save().then(output => {
        res.status(200).json({
          message: "Update article success",
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
  
  // Read All
  router.get("/", cors(), async (req, res, next)=>{
    let page = Math.max(1, req.query.page);
    var limit = 10;
    articles.countDocuments({}, async (err,count) => {
      if(err) return res.json({success:false, message:err});
      var skip = (page-1) * limit;
      var maxPage = Math.ceil(count/limit);
      if(page > maxPage) return res.json({success:false, message: "last"});
      
      let data = []
      await articles
        .find()
        .skip(skip)
        .limit(limit)
        .sort({date: -1})
        .then(a => {
          data = JSON.parse(JSON.stringify(a))
        })
        .catch(err => {
          res.status(500).json({
            message: err
          });
        });

      for(let i = 0; i < data.length; i++) {
        await users.findOne({
          id: data[i].author
        })
        .then(u =>{
          data[i].authorModel = u
        })
      }
      res.status(200).json({
        message: data.length < limit ? "last" : "Read All success",
        data: data
      });
      console.log("articles Read All 완료 " + data.length);
    })
  });

  // Read All By Id
  router.get("/:id", cors(), function(req, res, next) {
    let id = req.params.id;
    let page = Math.max(1, req.query.page);
    var limit = 10;
    articles.countDocuments({ author: id }, (err,count) => {
      if(err) return res.json({success:false, message:err});
      var skip = (page-1) * limit;
      var maxPage = Math.ceil(count/limit);
      if(page > maxPage) return res.json({success:false, message: "last"});
      articles
        .find({author: id})
        .skip(skip)
        .limit(limit)
        .sort({date: -1})
        .then(articles => {
          console.log("articles Read All 완료 " + articles.length);
          res.status(200).json({
            message: articles.length < limit ? "last" : "Read All success",
            data: articles
          });
        })
        .catch(err => {
          res.status(500).json({
            message: err
          });
        });
    })
  });

  // Read by id
  router.get("/:id/:article", cors(), function(req, res, next) {
    articles
      .findOne({ author: req.params.id, title: req.params.article })
      .then(article => {
        if (!article) return res.status(404).json({ message: "article not found" });
        res.status(200).json({
          message: "article Detail success",
          data: article
        });
      })
      .catch(err => {
        res.status(500).json({
          message: err
        });
      });
  });

  // Delete
  router.delete("/:id/:article", cors(), function(req, res, next) {
    articles
      .deleteOne({ author: req.params.id, title: req.params.article })
      .then(output => {
        if (output.n === 0) return res.status(404).json({ message: "article not found" });
        res.status(200).json({
          message: "article delete success",
          data: true
        });
      })
      .catch(err => {
        res.status(500).json({
          message: err
        });
      });
  });

  module.exports = router;
  