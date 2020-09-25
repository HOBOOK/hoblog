/* article Controller */

var express = require('express');
var cors = require('cors');
var router = express.Router();

/* Models */
var articles = require("../model/article")

// Create
router.post("/", cors(), function(req, res, next) {
    const { title, content, author, thunbmail, private, prominent, water } = req.body; // 비구조화 할당
  
    console.log(req.body);
  
    new articles(req.body)
      .save()
      .then(newArticle => {
        console.log("Create 완료 > " + newArticle);
        res.status(200).json({
          message: "Create success",
          data: {
            article: newArticle
          }
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
  router.get("/", cors(), function(req, res, next) {
    let page = Math.max(1, req.query.page);
    var limit = 10;
  
    articles.countDocuments({}, (err,count) => {
      if(err) return res.json({success:false, message:err});
      var skip = (page-1) * limit;
      var maxPage = Math.ceil(count/limit);
      if(page > maxPage) return res.json({success:false, message: "last"});
      articles
        .find()
        .skip(skip)
        .limit(limit)
        .then(articles => {
          console.log("articles Read All 완료 " + articles.length);
          res.status(200).json({
            message: articles.length < limit ? "last" : "Read All success",
            data: {
              articles
            }
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
  router.get("/:article_id", cors(), function(req, res, next) {
    const articleId = req.params.article_id;
  
    articles
      .findOne({ _id: articleId })
      .then(post => {
        if (!post) return res.status(404).json({ message: "article not found" });
        console.log("Read Detail 완료");
        res.status(200).json({
          message: "article Detail success",
          data: {
            article: article
          }
        });
      })
      .catch(err => {
        res.status(500).json({
          message: err
        });
      });
  });

  module.exports = router;
  