const Router = require('express').Router();
// const { MaxKey } = require('mongodb');
// aquiring teacher model
const {Teacher ,Class, Student, Diary} = require('../../Models');
// const section = require('../../Models/section');

// getting teacher record
Router.get("/record",(req,res)=>{
    Teacher.find().then(findTeacher =>{
        return res.json({message:"Teachers Records",teachers:findTeacher,success:true}).status(200);
    }).catch(err =>{
        return res.json({error:{message:"Error While Getting Teachers Record",errorCode:500},success:false}).status(400);
    })
})

// creating teacher request
Router.post("/record",(req,res)=>{
    try{
        const {teacher} = req.body;
        let errorMessage = false;
        if(teacher.name === undefined || teacher.name === ""){
            errorMessage = "Invalid Teacher Name";
        }
        else if(teacher.education === undefined || teacher.education === ""){
            errorMessage = "Invalid Teacher Education";
            
        }
        else if(teacher.subject === undefined || teacher.subject === "")
        {
            errorMessage = "Invalid Teacher Subject";
        }
        else{
            errorMessage = false;
        }
        if(errorMessage === false)
        {

            
           Teacher.findOne().sort({_id:-1}).limit(1).then(find =>
            {
                if(find === null){
                                return res.json({error:{message:"Teacher SchoolId Not Found",errorCode:500},success:false}).status(400);  
                            }
                            else{
                                let sId = find.schoolId;
                                // console.log(sId);
                                let str = sId.split("-");
                                // console.log(str);
                                let num = parseInt(str[1]);
                                num++;
                                // console.log(num)
                                teacher.schoolId = sId+num;
                                // console.log(teacher.schoolId)
                            }
                            let newRecord = new Teacher ( {
                                name:teacher.name,
                                schoolId:teacher.schoolId,
                                education:teacher.education,
                                subject:teacher.subject
                            })
                            newRecord.save().then(saveTeacher =>{
                                return res.json({message:"Teacher Saved Successfully",teacher:saveTeacher,success:true}).status(200);
                            }).catch(err => {
                                return res.json({error:{message:"Catch Error,While Saving Teacher",errorCode:500},success:false}).status(400);
                            })
            })
            
        }
        else{
            return res.json({error:{message:errorMessage,errorCode:500},success:false}).status(400);
        }
    }
    catch(err)
    {
        console.log(err);
        return res.json({error:{message:"Catch Error, While Creating Teacher",errorCode:500},success:false}).status(400);
    }
})

//updation teacher Record against id
Router.put("/record/:id",(req,res)=>{
    try{
        const {teacher} = req.body;
        Teacher.findByIdAndUpdate({_id:req.params.id},{teacher}).then(findTeacher =>{
            if(findTeacher === null){
                return res.json({error:{message:"Teacher Id not Exist",errorCode:500},success:false}).status(400);
            }
            if(teacher.name !=="")
            {
                findTeacher.name = teacher.name;
            }
            if(teacher.education !=="")
            {
                findTeacher.education = teacher.education;
            }
            if(teacher.subject !==""){
                findTeacher.subject = teacher.subject;
            }
            findTeacher.save().then(updatedTeacher => {
                return res.json({message:"Teacher Record Updated",teacher:updatedTeacher,success:true}).status(200);
            }).catch(err=>{
                return res.json({error:{message:"Catch Error, While Saving Updation",errorCode:500},success:false}).status(400);
            })
        })
    }
    
    catch(err)
    {
        return res.json({error:{message:"Catch Error, While Updation",errorCode:500},success:false}).status(400);
    }

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
    Class.findOne({teacher:req.params.id}).then(teacher=>{
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
                        return res.json({error:{message:"Student Class Not Found",errorCode:500},success:false}).status(400);
                    }
                    else{
                        studentclass.save().then(classStatus =>
                            {
                                return res.json({message:"Teacher Activated Students",success:true}).status(200);
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