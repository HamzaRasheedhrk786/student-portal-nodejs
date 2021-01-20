const mongoose= require('mongoose');
const Schema = mongoose.Schema;
// defining schema for student
const TeacherSchema = new Schema({
    name:String,
    education:String,  
    subject:String,
    email:String,
    password:String,
    schoolId:{
        type:String,
        default: "T-001"
    },
    joiningDate:{
        type:Date,
        required:true,
        default:Date.now()
    }
})
module.exports = mongoose.model('tblteachers',TeacherSchema);