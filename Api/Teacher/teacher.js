const Router = require('express').Router();
// aquiring teacher model
const {Teacher ,Class, Student} = require('../../Models');
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
            // defining school id
            teacher.schoolId ="T001";
            // let str1 = "T001";
            // teacher.schoolId = "T"+(parseInt(str1.substring(001,str1.lastIndexOf()))+1)

            let newRecord = new Teacher ( {
                name:teacher.name,
                schoolId:teacher.schoolId+1,
                education:teacher.education,
                subject:teacher.subject
            })
            newRecord.save().then(saveTeacher =>{
                return res.json({message:"Teacher Saved Successfully",teacher:saveTeacher,success:true}).status(200);
            }).catch(err => {
                return res.json({error:{message:"Catch Error,While Saving Teacher",errorCode:500},success:false}).status(400);
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
        else
        {
            errorMessage = false
        }
        if(errorMessage === false){
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
    else{
        return res.json({error:{message:errorMessage,errorCode:500},success:false}).status(400);
    }
        
    }
    catch(err)
    {
        return res.json({error:{message:"Catch Error, While Updation",errorCode:500},success:false}).status(400);
    }

})
// deleting teacher record
// Deleting Section Record
Router.delete("/record/:id",(req,res)=>{
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
        // console.log(err);
        return res.json({error:{message:"Catch Error, While Getting Teacher Class",errorCode:500},success:false}).status(400);
    })
})
// getting teacher class all student
Router.get("/teacherStudent/:id",(req,res)=>{
    Class.findOne({teacher:req.params.id}).then(classFind =>{
        if(classFind === null){
            return res.json({error:{message:"No Class Exist Against Teacher",errorCode:500},success:false}).status(400);
        }
        else{
            Student.find({class:classFind._id}).populate('class','standard').then ( studentFind =>{
                if(studentFind === null)
                {
                    return res.json({error:{message:"No Student Exist Against Class",errorCode:500},success:false}).status(400);
                }
                else{
                    // studentFind.status = "inactive"
                   return res.json({message:"Students Of Teacher Class",Student:studentFind,success:true}).status(200);
                }
            })
        }
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
                Student.findOne({class:classFound._id},{"status":"inactive"}).then(studentclass =>{
                    if(studentclass === null){
                        return res.json({error:{message:"Student Class Not Found",errorCode:500},success:false}).status(400);
                    }
                    else{
                        Student.findOneAndUpdate({status:teacher.status},{teacher}).then(updated =>{
                            return res.json({message:"Student Active Successfully",ActiveStudent:updated,success:true});
                        }).catch(err =>{
                            return res.json({error:{message:"Catch Error, While Activate Student",errorCode:500},success:false}).status(400);
                        })
                    }
                })
            }
        }).catch(err=>{
            return res.json({error:{message:"Catch Error, While Finding Teacher Class",errorCode:500},success:false}).status(400);
        })
    }
})
// getting all the list of teacher class active student
Router.get('/activeStudentList/:id',(req,res)=>{
    
})
module.exports =Router;