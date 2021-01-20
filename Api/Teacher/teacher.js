const Router = require('express').Router();
const bcrypt = require('bcryptjs');

// aquiring teacher model
const {Teacher ,Class, Student} = require('../../Models');
const { addTeacherValidator ,loginTeacherValidator, updateTeacherValidator} = require("../../Models/Helpers")

// getting teacher record
Router.get("/record",(req,res)=>{
    Teacher.find().select("-password").then(findTeacher =>{
        return res.json({message:"Teachers Records",teachers:findTeacher,success:true}).status(200);
    }).catch(err =>{
        return res.json({error:{message:"Error While Getting Teachers Record",errorCode:500},success:false}).status(400);
    })
})

// creating teacher request
Router.post("/signUp",(req,res)=>{
    const {teacher} = req.body;
    addTeacherValidator.validateAsync(teacher).then(validated =>
        {
            if(validated){
                Teacher.findOne({email:teacher.email}).then(findAdmin=>{
                    if(findAdmin !== null){
                        return res.json({error:{message:"Email Already Exists",errorCode:500},success:false}).status(400);
                    }
                    else{
                        bcrypt.genSalt(10,(err,salt)=>{
                            if(err){
                                return res.json({error:{message:"Error While Generating Salt",errorCode:500},success:false}).status(400);
                            }
                            else{
                                bcrypt.hash(teacher.password,salt,(err,hash)=>{
                                    if(err){
                                        return res.json({error:{message:"Error While Generating Hash",errorCode:500},success:false}).status(400);   
                                    }
                                    else{ // getting last teacher entry value
                                        Teacher.findOne().sort({_id:-1}).limit(1).then(find =>
                                         {
                                             if(find === null){
                                                 let newTeacher = new Teacher({
                                                     name:teacher.name,
                                                     schoolId:teacher.schoolId,
                                                     education:teacher.education,
                                                     subject:teacher.subject,
                                                     email:teacher.email,
                                                     password:hash
                                                 })
                                                 newTeacher.save().then(savedTeacher =>
                                                     {
                                                         return res.json({message:"Teacher Saved Successfully",Teacher:savedTeacher,success:true}).status(200);
                                                     }).catch(err =>
                                                         {
                                                             return res.json({error:{message:"Catch Error Saving First Teacher Data",errorCode:500},success:false}).status(400);
                                                         })
                                                              
                                                         }
                                                         else{
                                                             let sId = find.schoolId;
                                                             let getPart = sId.replace ( /[^\d.]/g, '' ); // returns 001
                                                             let num = parseInt(getPart); // returns 1
                                                             let newVal = num+1; // returns 2
                                                             let reg = new RegExp(num); // create dynamic regexp
                                                             teacher.schoolId = sId.replace ( reg, newVal ); // returns T-002
                                                         }
                                                         let newRecord = new Teacher ( {
                                                             name:teacher.name,
                                                             schoolId:teacher.schoolId,
                                                             education:teacher.education,
                                                             subject:teacher.subject,
                                                             email:teacher.email,
                                                             password:hash
                                                         })
                                                         newRecord.save().then(saveTeacher =>{
                                                             return res.json({message:"Teacher Saved Successfully",teacher:saveTeacher,success:true}).status(200);
                                                         }).catch(err => {
                                                             return res.json({error:{message:"Catch Error,While Saving Teacher",errorCode:500},success:false}).status(400);
                                                         })
                                         }).catch(err=>
                                             {
                                                 return res.json({error:{message:"Catch Error,While Finding Last Teacher Record",errorCode:500},success:false}).status(400);
                                             })
                                
                           }
                    })
               }
            })            
        }
    }).catch(err=>
        {
            // console.log(err)
            return res.json({error:{message:"Catch Error, While Finding Email",errorCode:500},success:false}).status(400);
        }) 
    }
        }).catch(err =>
            {
                // console.log(err)
                return res.json({error:{message:`${err}`,errorCode:500},success:false}).status(400);
            })
})
// Login In Teacher
Router.post('/login',(req,res)=>
{
    // try{
    const {teacher}= req.body;
    loginTeacherValidator.validateAsync(teacher).then(validated =>
        {
            if(validated){
                Teacher.findOne({email:teacher.email}).then(findTeacher =>{
                    if(findTeacher === null){
                        return res.json({error:{message:"Teacher Not Found",errorCode:500},success:false}).status(400);
                    }
                    else{
                        bcrypt.compare(teacher.password,findTeacher.password, (err,match)=>{
                            if(err){
                                return res.json({error:{message:"Error In Password",errorCode:500},success:false}).status(400);
                            }
                            else if( match === true){
                                return res.json({message:"Login Successfull",teacher:findTeacher,success:true}).status(200);
                            }
                            else{
                                return res.json({error:{message:"Login Unsuccessfull",errorCode:500},success:false}).status(400);
                            }
                        })
                    }
                }).catch(err =>{
                    return res.json({error:{message:"Catch Error, While Finding Email",errorCode:500},success:false}).status(400);
                })
            }
        }).catch(err =>
            {
                return res.json({error:{message:`${err}`,errorCode:500},success:false}).status(400);
            })
        // }
        // catch(err){
        //     return res.json({error:{message:"Catch Error, While Login",errorCode:500},success:false}).status(400);
        // }       
})
//updation teacher Record against id
Router.put("/record/:id",(req,res)=>{
    const {teacher} = req.body;
    updateTeacherValidator.validateAsync(teacher).then(validated =>
        {
            if(validated){
               Teacher.findByIdAndUpdate({_id:req.params.id},{teacher}).then(findTeacher=>{
                   if(findTeacher === null){
                       return res.json({error:{message:"Teacher Id Not Found",errorCode:500},success:false}).status(400);
                   }
                   else{
                       if(teacher.name !=="")
                       {
                           findTeacher.name = teacher.name
                       }
                       if(teacher.education !=="")
                       {
                           findTeacher.education = teacher.education
                       }
                       if(teacher.subject !=="")
                       {
                           findTeacher.subject = teacher.subject
                       }
                       findTeacher.save().then(updatedTeacher =>
                        {
                            return res.json({message:"Teacher Updated Successfully",Teacher:updatedTeacher,success:true}).status(200);
                        }).catch(err =>
                            {
                                return res.json({error:{message:"Catch Error, While Updating Teacher",errorCode:500},success:false}).status(400);
                            })
                   }
               }).catch(err=>
                {
                    return res.json({error:{message:"Catch Error, While Finding Teacher Id",errorCode:500},success:false}).status(400);
                })
            }

        }).catch(err =>
            {
                return res.json({error:{message:`${err}`,errorCode:500},success:false}).status(400);
            })
    
})
// deleting teacher record
// Deleting Section Record
Router.delete("/record/:id",(req,res)=>{
    Class.findOne({teacher:req.params.id}).then(findTeacherClass=>
        {
            if(findTeacherClass !==null){
                return res.json({error:{message:"You Can't Delete Because Class Exists Against This Teacher",errorCode:500},success:false}).status(400);
            }
            else{
                Teacher.findByIdAndRemove({_id:req.params.id}).then(teacherDelete =>{
                    if(!teacherDelete){
                        return res.json({error:{message:"Teacher Id Not Exists",errorCode:500},success:false}).status(400);
                    }
                    else{
                        return res.json({message:"Teacher Deleted Successfully",teacher:teacherDelete,success:true}).status(200);
                    }
                }).catch(err => {
                    return res.json({error:{message:"Catch Error, While Deleting Teacher",errorCode:500},success:false}).status(400);
                })
            }
        }).catch(err=>{
            return res.json({error:{message:"Catch Error, While Finding Teacher From Class",errorCode:500},success:false}).status(400);
        })
    
})
// finding class against teacher
Router.get("/findClass/:id",(req,res)=>{
    Class.findOne({teacher:req.params.id}).populate("teacher","name subject email").then(teacher=>{
        if(teacher === null){
            return res.json({error:{message:"No Class Exist Against Teacher",errorCode:500},success:false}).status(400);
        }
        else{
            return res.json({message:"Class Exist Against Teacher",teacherClass:teacher,success:true}).status(200);
        }
    }).catch(err=>{
        console.log(err);
        return res.json({error:{message:"Catch Error, While Getting Teacher Class",errorCode:500},success:false}).status(400);
    })
})
// getting teacher class all inactive student
Router.get("/teacherInactiveStudent/:id",(req,res)=>{
    Class.findOne({teacher:req.params.id}).then(classFind =>{
        if(classFind === null){
            return res.json({error:{message:"No Class Exist Against Teacher",errorCode:500},success:false}).status(400);
        }
        else{
            Student.find({class:classFind._id}).where({"status":"Inactive"}).then(teacherStudents=>{
                if(teacherStudents === null){
                    return res.json({error:{message:"No Teacher Student Exist Teacher Class",errorCode:500},success:false}).status(400);
                }
                else
                {
                    return res.json({message:"Teacher Class Inactive Student List",students:teacherStudents,success:true}).status(200);
                }
            })
        }
    }).catch(err=>{
        return res.json({error:{message:"Catch Error While Finding Teacher Class",errorCode:500},success:false}).status(400);
    })

})
// Tecaher Active Student
Router.get("/teacheractiveStudent/:id",(req,res)=>{
    Class.findOne({teacher:req.params.id}).then(classFind =>{
        if(classFind === null){
            return res.json({error:{message:"No Class Exist Against Teacher",errorCode:500},success:false}).status(400);
        }
        else{
            Student.find({class:classFind._id}).where({"status":"active"}).then(teacherStudents=>{
                if(teacherStudents === null){
                    return res.json({error:{message:"No Teacher Student Exist Teacher Class",errorCode:500},success:false}).status(400);
                }
                else
                {
                    return res.json({message:"Teacher Class Active Student List",students:teacherStudents,success:true}).status(200);
                }
            })
        }
    }).catch(err=>{
        return res.json({error:{message:"Catch Error While Finding Teacher Class",errorCode:500},success:false}).status(400);
    })

})
// Active Student by Teacher
Router.put("/activateStudent/:id",(req,res)=>{
    const {teacher} = req.body;
    if(teacher.status === undefined || teacher.status === ""){
        return res.json({error:{message:"Invalid Status",errorCode:500},success:false}).status(400);
    }
    else{
        Class.findOne({teacher:req.params.id}).then(classFound => {
            if(classFound === null){
                return res.json({error:{message:"Teacher Class Not Found",errorCode:500},success:false}).status(400);   
            }
            else{
                Student.findOneAndUpdate({class:classFound._id},{status:teacher.status}).where({"status":"Inactive"}).then(studentclass =>{
                    if(studentclass === null){
                        return res.json({error:{message:"No Inactive Student Exist Against Teacher",errorCode:500},success:false}).status(400);
                    }
                    else{
                        if(teacher.status !=="")
                        {
                            studentclass.status = teacher.status
                        }
                        studentclass.save().then(classStatus =>
                            {
                                return res.json({message:"Teacher Activated Students",ActiveStudent:classStatus,success:true}).status(200);
                            }).catch(err =>
                                {
                                    return res.json({error:{message:"Catch Error, While Activating Teacher Students",errorCode:500},success:false}).status(400);
                                })
                        
                    }
                    
                }).catch(err =>
                    {
                        return res.json({error:{message:"Catch Error, While Finding Inactive Teacher Student",errorCode:500},success:false}).status(400); 
                    })
            }
        }).catch(err=>{
            return res.json({error:{message:"Catch Error, While Finding Teacher Class",errorCode:500},success:false}).status(400);
        })
    }
})
module.exports =Router;