const mongoose= require('mongoose');
const Schema = mongoose.Schema;
// defining schema for student
const StudentSchema = new Schema({
    firstName:String,
    lastName:String,
    class:{
        type:mongoose.SchemaTypes.ObjectId,
        ref:'tblclasses'
    },
    registration: String,
    email:String,
    password:String,
    status:{
        type:String,
        default:"Inactive"
    }
})
module.exports = mongoose.model('tblstudents',StudentSchema);