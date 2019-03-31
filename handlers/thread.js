const db = require('../models')

async function getThreads(req, res) {
  try {
    const {board} = req.params;
    let data = await db.Thread.find(
      {board}, 
      {replies: { $slice: -3 }},
      {
        reported: 0,
        delete_password: 0,
        "replies.delete_password": 0,
        "replies.reported": 0
      }
    )
      .sort({bumped_on: -1})
      .limit(10)
      .lean()
    
    data.forEach(elm => elm.replycount = elm.replies.length)

    res.json(data);
    
  } catch(err) {
    res.send(err)
  }
 
};

async function newThread(req, res) {
  try {
    const {board} = req.params;
    const {text, delete_password} = req.body
    const thread = {
      board,
      text,
      delete_password,
      created_on: new Date(),
      bumped_on : new Date(),
      reported : false,
      replies : []
    };
  
    await db.Thread.create(thread)
    res.redirect('/b/'+ board + '/');
    
  } catch(err) {
    res.send(err)
  }
    
}

async function reportThread(req, res) {
  try {
    const thread_id = req.body.report_id;
    const data = await db.Thread.findByIdAndUpdate(thread_id, {reported: true})
    
    if(data) res.send('success');
    
  } catch(err) {
    res.send(err)
  }
}

async function deleteThread(req, res) {
  const _id = req.body.thread_id;
  const {delete_password} = req.body;
  const data = await db.Thread.findOneAndDelete({_id, delete_password})
  
  if(data) return res.send('success');
        
  res.send('incorrect password')
  
}

module.exports = {getThreads, newThread, reportThread, deleteThread}
