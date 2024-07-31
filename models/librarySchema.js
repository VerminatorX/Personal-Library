const mongoose = require("mongoose");

const BookModel = new mongoose.Schema({
  title: {
    type: String,
    required: true
  },
  commentcount: {
    type: Number,
    required: true,
    default: 0
  },
  comments: []
})

const Book = mongoose.model("Book", BookModel)

exports.Book = Book;