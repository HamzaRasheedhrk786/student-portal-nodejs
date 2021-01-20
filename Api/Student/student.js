const Router = require('express').Router();
const bcrypt = require("bcryptjs")
// aquiring student model
const {Student , Class} = require("../../Models");
const { addStudentValidator , loginStudentValidator } = require("../../Models/Helpers")

// creating student record
Router.post("/signUp",(req,res)=>{
    const {student} = req.body;
    addStudentValidator.validateAsync(student).then(validated =>
        {
            if(validated){
                Student.findOne({email:student.email}).then(findAdmin=>{
                    if(findAdmin !== null){
                        return res.json({error:{message:"Email Already Exists",errorCode:500},success:false}).status(400);
                    }
                    else{
                        bcrypt.genSalt(10,(err,salt)=>{
                            if(err){
                                return res.json({error:{message:"Error While Generating Salt",errorCode:500},success:false}).status(400);
                            }
                            else{
                                bcrypt.hash(student.password,salt,(err,hash)=>{
                                    if(err){
                                        return res.json({error:{message:"Error While Generating Hash",errorCode:500},success:false}).status(400);   
                                    }
                                    else{
                                        Class.findOne({_id:student.class}).then(findClass=>{
                                            if(findClass === null){
                                                return res.json({error:{message:"Class Against Id Not Found",errorCode:500},success:false}).status(400);
                                            }
                                            else{
                                                Student.findOne({registration:student.registration}).then(findStudent =>{
                                                    if(findStudent !== null){
                                                        return res.json({error:{message:"Regisration number Already Exists",errorCode:500},success:false}).status(400);
                                                    }
                                                    else{
                                                        let newRecord = new Student({
                                                            firstName : student.firstName,
                                                            lastName : student.lastName,
                                                            class: student.class,
                                                            registration : student.registration,
                                                            email:student.email,
                                                            password:hash
                                                        })
                                                        newRecord.save().then(saveStudent=>{
                                                            return res.json({message:"Student Added Successfully",student:saveStudent,success:true}).status(200);
                                                        }).catch(err=>{
                                                            return res.json({error:{message:"Catch Error, While Adding Student",errorCode:500},success:false}).status(400);
                                                        })
                                                    }
                                    
                                                }).catch(err=>{
                                                    return res.json({error:{message:"Catch Error, While Matching Regisrtation",errorCode:500},success:false}).status(400);
                                                })
                                            }
                                        }).catch(err =>
                                            {
                                                return res.json({error:{message:"Catch Error, While Finding Class",errorCode:500},success:false}).status(400);
                                            })
                                        
                           }
                    })
               }
            })         
       }
    }).catch(err=>
        {
            return res.json({error:{message:"Catch Error, While Finding Email",errorCode:500},success:false}).status(400);
        })
               
            }
           
        }).catch(err =>
            {
                return res.json({error:{message:`${err}`,errorCode:500},success:false}).status(400);
            })
    
})
// Login Student Rout
Router.post('/login',(req,res)=>{
    const {student} = req.body;
    loginStudentValidator.validateAsync(student).then(validated =>{
        if(validated){
            Student.findOne({email:student.email}).then(findStudent=>{
                if(findStudent === null){
                    return res.json({error:{message:"Student Not Found",errorCode:500},success:false}).status(400);
                }
                else{
                    bcrypt.compare(student.password,findStudent.password, (err,match)=>{
                        if(err){
                            return res.json({error:{message:"Error In Password",errorCode:500},success:false}).status(400);
                        }
                        else if( match === true){
                            return res.json({message:"Login Successfull",student:findStudent,success:true}).status(200);
                        }
                        else{
                            return res.json({error:{message:"Login Unsuccessfull",errorCode:500},success:false}).status(400);
                        }
                    })
                }
            }).catch(err =>{
                return res.json({error:{message:"Catch Error, While Finding Student Against Email",errorCode:500},success:false}).status(400);
            })
        }
    }).catch(err =>{
        return res.json({error:{message:`${err}`,errorCode:500},success:false}).status(400)
    })
})
// Getting the Record of All Student
Router.get("/record/all",(req,res)=>{
    Student.find().select("-password").populate("class","standard").then(records=>{
        return res.json({message:"All Students Records",students:records,success:true}).status(200);
    }).catch(err=>{
        return res.json({error:{message:"Catch Error, While Getting All Student",errorCode:500},success:false}).status(400);
    })
})
// Getting the Record of All Inactive Student
Router.get("/record/inactive",(req,res)=>{
   Student.find({"status": "Inactive"}).select("-password").populate("class","standard").then(inactive=>{
    return res.json({message:"All Inactive Students Records",students:inactive,success:true}).status(200);
   }).catch(err=>{
    return res.json({error:{message:"Catch Error, While Getting All Inactive Student",errorCode:500},success:false}).status(400);
   })
})
// getting all active student record
Router.get("/record/active",(req,res)=>{
    Student.find({"status": "active"}).select("-password").populate("class","standard").then(active=>{
        return res.json({message:"All active Students Records",students:active,success:true}).status(200);
    }).catch(err=>{
        return res.json({error:{message:"Catch Error, While Getting All active Student",errorCode:500},success:false}).status(400);
    })
})

module.exports =Router;