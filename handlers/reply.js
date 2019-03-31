const db = require('../models')

async function getReplies(req, res) {
  try {
    const _id = req.query.thread_id;
    const data = await db.Thread.findOne(
      {_id},
      {
        reported: 0,
        delete_password: 0,
        "replies.delete_password": 0,
        "replies.reported": 0
      }
    )

    res.json(data);

  } catch(err) {
    res.send(err)
  }
}

async function newReply(req, res) {
  try {
    const {board} = req.params;
    const {thread_id:_id, text, delete_password} = req.body;
    const reply = {
      text,
      delete_password,
      created_on : new Date(),
      reported : false,
    }

    const data = await db.Thread.findOneAndUpdate({_id}, {$set: {bumped_on: new Date()}, $push: {replies: reply}})
    if(data) res.redirect('/b/'+ board + '/');

  } catch(err) {
    res.send(err)
  }
}

async function reportReply(req, res) {
  try {
   const {thread_id, reply_id} = req.body;
   const data = await db.Thread.findOneAndUpdate({_id: thread_id, "replies._id": reply_id}, {"replies.$.reported": true})
   
   if(data) res.send('success');
    
  } catch(err) {
    res.send(err)
  }
}

async function deleteReply(req, res) {
  try {
   const {thread_id, reply_id, delete_password} = req.body;
   const data = await db.Thread.findOneAndUpdate({
     _id: thread_id, replies : {
       $elemMatch: { _id: reply_id, delete_password}
     }
   }, {"replies.$.text": "[deleted]"})
   
   if(data) return res.send('success');
   return res.send('incorrect password')
    
  } catch(err) {
    res.send(err)
  }
}

module.exports = {getReplies, newReply, reportReply, deleteReply}
