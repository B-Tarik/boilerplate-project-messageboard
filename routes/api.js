/*
*
*
*       Complete the API routing below
*
*
*/

'use strict';

const {getThreads, newThread, reportThread, deleteThread} = require('../handlers/thread')
const {getReplies, newReply, reportReply, deleteReply} = require('../handlers/reply')

module.exports = function (app) {
  
  app.route('/api/threads/:board')
    .get(getThreads)
    .post(newThread)
    .put(reportThread)
    .delete(deleteThread);
    
  app.route('/api/replies/:board')
    .get(getReplies)
    .post(newReply)
    .put(reportReply)
    .delete(deleteReply);

};
