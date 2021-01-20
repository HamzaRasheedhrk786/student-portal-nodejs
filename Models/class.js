const mongoose= require('mongoose');
const Schema = mongoose.Schema;
// defining schema for student
const ClassSchema = new Schema({
    section:{
        type:mongoose.SchemaTypes.ObjectId,
        ref:'tblsections'
    },
    standard:String,
    teacher:{
        type:mongoose.SchemaTypes.ObjectId,
        ref:'tblteachers'
    }
   
})
module.exports = mongoose.model('tblclasses',ClassSchema);