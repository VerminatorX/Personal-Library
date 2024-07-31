'use strict';

const mongoose = require("mongoose");
const BookModel = require("../models/librarySchema").Book;
const ObjectId = mongoose.Types.ObjectId;

module.exports = function (app) {

  app.route('/api/books')
    .get(async function (req, res){
      //response will be array of book objects
      //json res format: [{"_id": bookid, "title": book_title, "commentcount": num_of_comments },...]
      let allBooks = await BookModel.find({})
      console.log(allBooks)
      res.json(allBooks)
    })
    
    .post(async function (req, res){
      let title = req.body.title;
      //response will contain new book object including atleast _id and title
      const newBook = new BookModel({
        title: title
      });

      if (!title) {
        res.send("missing required field title")
      } else {
        let addNewBook = await BookModel.create({ title: title })
        addNewBook.save()
        res.json({_id: addNewBook._id, title: addNewBook.title})
      }
    })
    
    .delete(async function(req, res){
      //if successful response will be 'complete delete successful'
      BookModel.deleteMany({})
       .then((deleteManyResult) => {
          res.send("complete delete successful")
       })
       .catch((err) => {
        console.log("Error", err)
       })
    });



  app.route('/api/books/:id')
    .get(async function (req, res){
      let bookid = req.params.id;
      console.log(bookid)
      //json res format: {"_id": bookid, "title": book_title, "comments": [comment,comment,...]}
      try {
        let specificBook = await BookModel.findById(bookid);
        if (specificBook === null) {
          res.send("no book exists")
        } else {
          res.json(specificBook)}
      } catch(err) {
        res.send("no book exists")
      }
    })
    
    .post(async function(req, res){
      let bookid = req.params.id;
      let comment = req.body.comment;
      //json res format same as .get
      try {
        let specificBook = await BookModel.findById(bookid);
        if (specificBook === null) {
          res.send("no book exists")
        } else if (!comment) {
          res.send("missing required field comment")
        } else {
          specificBook.comments.push(comment)
          specificBook.commentcount = specificBook.comments.length
          console.log(specificBook)
          specificBook.save()
          res.json(specificBook)
        }
      } catch(err) {
        res.send("no book exists")
      }
    })
    
    .delete(async function(req, res){
      let bookid = req.params.id;
      //if successful response will be 'delete successful'
      let bookToDelete = await BookModel.findById(bookid)

      if (bookToDelete === null) {
        console.log("nullbook:", bookToDelete)
        res.send("no book exists")
      } else {
        console.log("yesbook:", bookToDelete)
        bookToDelete.deleteOne()
        .then((deleteOneResult) => {
          res.send("delete successful")
        })
        .catch((err) => {
          res.send("no book exists")
        })
      }
    });
};
