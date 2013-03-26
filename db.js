var mongoose = require( 'mongoose' );
var Schema   = mongoose.Schema;
 
var Task = new Schema({
    user_id  : String,
    title    : String,
    isDone   : Boolean
});
 
mongoose.model( 'Task', Task );
 
mongoose.connect( 'mongodb://localhost/task' );
