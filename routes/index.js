var mongoose = require( 'mongoose' );
var Task     = mongoose.model( 'Task' );
var utils    = require( 'connect' ).utils;

exports.list = function ( req, res, next ) {
  Task.
    find({ user_id : req.cookies.user_id }).
    exec( function ( err, tasks, count ){
      if( err ) return next( err );
      res.send(tasks);
    });
};

exports.save = function ( req, res, next ) {
  var tasks = req.body.tasks
  for(var task in tasks) {
    if (tasks.hasOwnProperty(task)) {
      if(tasks[task]._destroy && tasks[task].id) {
        destoryTask(tasks[task].id, res, req);
      } else if(!tasks[task]._destroy) {
        createOrUpdateTask(tasks[task].id, req.cookies.user_id, tasks[task].title, tasks[task].isDone);
      }
    }
  }
  res.redirect( '/' );
};

function createOrUpdateTask( taskId, userId, title, isDone ) {
  Task.findById(taskId, function(err, data) {
    if (!data) {
      console.log("Creating task [" + title + "]");
      new Task({
        user_id  : userId,
        title    : title,
        isDone   : isDone
      }).save( function ( err, raw, count ) {
        if( err ) return next( err );
      });
    } else {
      console.log("Updating task [" + title + "]" + "[" + taskId + "]");
      Task.findByIdAndUpdate(taskId, {
        user_id  : userId,
        title    : title,
        isDone   : isDone
      }, { upsert : true }, function (err, raw) {
        if (err) return next(err);
      });
    }
  });
}

function destoryTask( taskId, res, req ) {
  console.log("Deleting task[" + taskId + "]")
  Task.findById( taskId, function ( err, task ){
    if( task.user_id !== req.cookies.user_id ){
      return utils.forbidden( res );
    }
 
    task.remove( function ( err, raw ){
      if( err ) return next( err );
    });
  });
};
 
// ** express turns the cookie key to lowercase **
exports.current_user = function ( req, res, next ){
  if( !req.cookies.user_id ){
    res.cookie( 'user_id', utils.uid( 32 ));
  }
  next();
};
