const mongoose= require('mongoose');
const Schema = mongoose.Schema;
// defining schema for student
const TeacherSchema = new Schema({
    name:{
        type:String,
        required:true
    },
    schoolId:{
        type:String,
        default: true
    },
    education:{
        type:String,
        required:true
    },
    subject:
    {
        type:String,
        required:true
    },
    joiningDate:{
        type:Date,
        required:true,
        default:Date.now()
    }
})
module.exports = mongoose.model('tblteachers',TeacherSchema);