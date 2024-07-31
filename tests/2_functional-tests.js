/*
*
*
*       FILL IN EACH FUNCTIONAL TEST BELOW COMPLETELY
*       -----[Keep the tests in the same order!]-----
*       
*/

const chaiHttp = require('chai-http');
const chai = require('chai');
const assert = chai.assert;
const server = require('../server');

chai.use(chaiHttp);

suite('Functional Tests', function() {

  /*
  * ----[EXAMPLE TEST]----
  * Each test should completely test the response of the API end-point including response status code!
  */
  /* test('#example Test GET /api/books', function(done){
     chai.request(server)
      .get('/api/books')
      .end(function(err, res){
        assert.equal(res.status, 200);
        assert.isArray(res.body, 'response should be an array');
        assert.property(res.body[0].commentcount, 'commentcount', 'Books in array should contain commentcount');
        assert.property(res.body[0].title, 'title', 'Books in array should contain title');
        assert.property(res.body[0]._id, '_id', 'Books in array should contain _id');
        done();
      });
  }); */
  /*
  * ----[END of EXAMPLE TEST]----
  */


  let bookTitle;
	let bookID
  suite('Routing tests', function() {


    suite('POST /api/books with title => create book object/expect book object', function() {
      
      test('Test POST /api/books with title', function(done) {
        chai
        .request(server)
        .keepOpen()
        .post("/api/books")
        .send({ 
          title: "test title"
        })
        
        .end(function(err, res) {
          //console.log("POST 1:", res.body)
          assert.equal(res.status, 200)
          bookTitle = res.body.title;
					bookID = res.body._id
					console.log(bookID)
          assert.equal(res.body.title, bookTitle)
        })
        done();
      });
      
      test('Test POST /api/books with no title given', function(done) {
        chai
        .request(server)
        .keepOpen()
        .post("/api/books")
        .send({
        })
        .end(function (err, res) {
          //console.log("POST2:", res.body)
          assert.equal(res.status, 200)
          assert.equal(res.body.error, "missing required field title")
        })
        done();
      });
      
    });


    suite('GET /api/books => array of books', function(){
      
      test('Test GET /api/books',  function(done){
        chai
        .request(server)
        .keepOpen()
        .get("/api/books")
        .end(function (err, res) {
          //console.log("GET1:", res.body)
          assert.equal(res.status, 200)
          assert.equal(res.type, "application/json")
          assert.isArray(res.body, "it is an array")
        })
        done();
      });      
      
    });


    suite('GET /api/books/[id] => book object with [id]', function(){
      
      test('Test GET /api/books/[id] with id not in db',  function(done){
        chai
        .request(server)
        .keepOpen()
        .get("/api/books/fakeid8be444013031f7289a")
        .end(function (err, res) {
					console.log("BLOO:", bookTitle)
          //console.log("GET2:", res.body)
          assert.equal(res.status, 200)
          assert.equal(res.body.error, "no book exists")
        })
        done();
      });
      
      test('Test GET /api/books/[id] with valid id in db',  function(done){
        chai
        .request(server)
        .keepOpen()
        .get("/api/books/" + bookID)
        .end(function (err, res) {
					
          //console.log("GET3:", res.body)
          assert.equal(res.status, 200)
          assert.equal(res.body.title, bookTitle.title)
        })
        done();
      });
      
    });


    suite('POST /api/books/[id] => add comment/expect book object with id', function(){
      
      test('Test POST /api/books/[id] with comment', function(done){
        chai
        .request(server)
        .keepOpen()
        .post("/api/books/" + bookID)
        .send({
          comment: "test comment"
        })
        .end(function (err, res) {
          assert.equal(res.status, 200)
          assert.equal(res.body.comments, "test comment")
        })
        done();
      });

      test('Test POST /api/books/[id] without comment field', function(done){
        chai
        .request(server)
        .keepOpen()
        .post("/api/books/" + bookID)
        .send({
          comment: ""
        })
        .end(function (err, res) {
          assert.equal(res.status, 200)
          assert.equal(res.body.error, "missing required field comment")
        })
        done();
      });

      test('Test POST /api/books/[id] with comment, id not in db', function(done){
        chai
        .request(server)
        .keepOpen()
        .post("/api/books/fakeid8be444013031f7289a")
        .send({
          comment: "test comment"
        })
        .end(function (err, res) {
          assert.equal(res.status, 200)
          assert.equal(res.body.error, "no book exists")
        })
        done();
      });
      
    });

    suite('DELETE /api/books/[id] => delete book object id', function() {

      test('Test DELETE /api/books/[id] with valid id in db', function(done){
        chai
        .request(server)
        .keepOpen()
        .delete("/api/books/" + bookID)
        .end(function (err, res) {
          assert.equal(res.status, 200)
          assert.equal(res.body.result, "delete successful")
        })
        done();
      });

     test('Test DELETE /api/books/[id] with  id not in db', function(done){
        chai
        .request(server)
        .keepOpen()
        .delete("/api/books/fakeid8be444013031f7289a")
        .end(function (err, res) {
          assert.equal(res.status, 200)
          assert.equal(res.body.error, "no book exists")
        })
        done();
      });

    });

  });

});
