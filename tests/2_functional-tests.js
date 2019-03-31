/*
*
*
*       FILL IN EACH FUNCTIONAL TEST BELOW COMPLETELY
*       -----[Keep the tests in the same order!]-----
*       (if additional are added, keep them at the very end!)
*/

var chaiHttp = require('chai-http');
var chai = require('chai');
var assert = chai.assert;
var server = require('../server');

chai.use(chaiHttp);

suite('Functional Tests', function() {
  
  let Id; 
  let Id2; 
  let Id3; 

  suite('API ROUTING FOR /api/threads/:board', function() {
    
    suite('POST', function() {
      
       test('creating 2 new threads', function(done) {
        chai.request(server)
        .post('/api/threads/test')
        .send({text:'new text', delete_password:'pass'})
        .end(function(err, res){
          assert.equal(res.status, 200);
        });
         
        chai.request(server)
        .post('/api/threads/test')
        .send({text:'new text 2', delete_password:'pass'})
        .end(function(err, res){
          assert.equal(res.status, 200);
          done();
        });
      });
      
    });
    
    suite('GET', function() {
      
      test('get 10 recent threads with max 3 replies', function(done){
        chai.request(server)
        .get('/api/threads/test')
        .query({})
        .end(function(err,res){
          assert.equal(res.status, 200);
          
          assert.isAtMost(res.body.length, 10);
          assert.isAtMost(res.body[0].replies.length, 3);
          
          assert.property(res.body[0], '_id');
          assert.property(res.body[0], 'created_on');
          assert.property(res.body[0], 'bumped_on');
          assert.property(res.body[0], 'text');
          assert.property(res.body[0], 'replies');
          
          Id = res.body[0]._id;
          Id2 = res.body[1]._id;
          
          done();
        })
      })
      
    });
    
    suite('DELETE', function() {
      
      test('delete thread with good password', function(done) {
        chai.request(server)
        .delete('/api/threads/test')
        .send({thread_id:Id, delete_password:'pass'})
        .end(function(err, res){
          assert.equal(res.status, 200);
          assert.equal(res.text, 'success');
          done();
        });
      });
      
      test('delete thread with bad password', function(done) {
        chai.request(server)
        .delete('/api/threads/test')
        .send({thread_id: Id2, delete_password: 'nopass'})
        .end(function(err, res){
          assert.equal(res.status, 200);
          assert.equal(res.text, 'incorrect password');
          done();
        });
      });
      
    });
    
    suite('PUT', function() {
      
      test('report thread', function(done) {
        chai.request(server)
        .put('/api/threads/test')
        .send({report_id:Id2})
        .end(function(err, res){
          assert.equal(res.status, 200);
          assert.equal(res.text, 'success');
          done();
        });
      });
      
    });
    

  });
  
  suite('API ROUTING FOR /api/replies/:board', function() {
    
    suite('POST', function() {
      
      test('reply to thread', function(done) {
        chai.request(server)
        .post('/api/replies/test')
        .send({thread_id: Id2, text:'a new reply', delete_password:'pass'})
        .end(function(err, res){
          assert.equal(res.status, 200);
          done();
        });
      });
      
    });
    
    suite('GET', function() {
      
      test('Get all replies for 1 thread', function(done) {
        chai.request(server)
        .get('/api/replies/test')
        .query({thread_id: Id2})
        .end(function(err, res){
          assert.equal(res.status, 200);
          assert.equal(res.body.replies[res.body.replies.length-1].text, 'a new reply');
          
          assert.property(res.body, '_id');
          assert.property(res.body, 'created_on');
          assert.property(res.body, 'bumped_on');
          assert.property(res.body, 'text');
          assert.property(res.body, 'replies');
          
          Id3 = res.body.replies[0]._id;
          
          done();
        });
      });
      
    });
    
    suite('PUT', function() {
      
      test('report reply', function(done) {
        chai.request(server)
        .put('/api/replies/test')
        .send({thread_id:Id2 ,reply_id:Id3})
        .end(function(err, res){
          assert.equal(res.status, 200);
          assert.equal(res.text, 'success');
          done();
        });
      });
      
    });
    
    suite('DELETE', function() {
      
      test('delete reply with bad password', function(done) {
        chai.request(server)
        .delete('/api/replies/test')
        .send({thread_id: Id2 ,reply_id: Id3, delete_password: 'nopass'})
        .end(function(err, res){
          assert.equal(res.status, 200);
          assert.equal(res.text, 'incorrect password');
          done();
        });
      });
      
      test('delete reply with valid password', function(done) {
        chai.request(server)
        .delete('/api/replies/test')
        .send({thread_id: Id2 ,reply_id: Id3, delete_password: 'pass'})
        .end(function(err, res){
          assert.equal(res.status, 200);
          assert.equal(res.text, 'success');
          done();
        });
      });
      
    });
    
  });

});
