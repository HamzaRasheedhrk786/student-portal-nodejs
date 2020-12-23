const mongoose= require('mongoose');
const Schema = mongoose.Schema;
// defining schema for student
const DiarySchema = new Schema({
    image:{
        type:String,
        required:true
    },
    clasS:{
        type:mongoose.SchemaTypes.ObjectId,
        ref:'tblclasses',
        required:true
    },
    date:{
        type:Date,
        required:true,
        default:Date.now()
    }
})
module.exports = mongoose.model('tbldiarys',DiarySchema);