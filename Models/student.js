const mongoose= require('mongoose');
const Schema = mongoose.Schema;
// defining schema for student
const StudentSchema = new Schema({
    firstName:{
        type:String,
        required:true
    },
    lastName:{
        type:String,
        required:true
    },
    class:{
        type:mongoose.SchemaTypes.ObjectId,
        ref:'tblclasses',
        required:true
    },
    registration:
    {
        type:String,
        required:true
    },
    status:{
        type:String,
        default:"Inactive"
    }
})
module.exports = mongoose.model('tblstudents',StudentSchema);