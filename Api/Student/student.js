const Router = require('express').Router();
// aquiring student model
const {Student , Class} = require("../../Models");

// creating student record
Router.post("/record",(req,res)=>{
    try{
        const {student} = req.body;
        let regExpReg= /[\d]{2}-[ntu|NTU]{3}-[\d]{4}/;
        let errorMessage = false;
        if(student.firstName === undefined || student.firstName === "")
        {
            errorMessage = "Invalid First Name";
        }
        else if(student.lastName === undefined || student.lastName === "")
        {
            errorMessage = "Invalid Last Name";
        }
        else if(student.class === undefined || student.class === "")
        {
            errorMessage = "Invalid Class";
        }
        else if(student.registration === undefined || student.registration === "" || !regExpReg.test(String(student.registration)))
        {
            errorMessage = "Invalid Registration";
        }
        else
        {
            errorMessage = false;
        }
        if(errorMessage === false)
        {
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
                                registration : student.registration 
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
            })
        }
        else
        {
            return res.json({error:{message:errorMessage,errorCode:500},success:false}).status(400);
        }
        
    }
    catch(err)
    {
        return res.json({error:{message:"Catch Error, While Creating Student",errorCode:500},success:false}).status(400);
    }
})
// Getting the Record of All Student
Router.get("/record/all",(req,res)=>{
    Student.find().populate("class","standard").then(records=>{
        return res.json({message:"All Students Records",students:records,success:true}).status(200);
    }).catch(err=>{
        return res.json({error:{message:"Catch Error, While Getting All Student",errorCode:500},success:false}).status(400);
    })
})
// Getting the Record of All Inactive Student
Router.get("/record/inactive",(req,res)=>{
   Student.find({"status": "Inactive"}).populate("class","standard").then(inactive=>{
    return res.json({message:"All Inactive Students Records",students:inactive,success:true}).status(200);
   }).catch(err=>{
    return res.json({error:{message:"Catch Error, While Getting All Inactive Student",errorCode:500},success:false}).status(400);
   })
})
// getting all active student record
Router.get("/record/active",(req,res)=>{
    Student.find({"status": "active"}).populate("class","standard").then(active=>{
        return res.json({message:"All active Students Records",students:active,success:true}).status(200);
    }).catch(err=>{
        return res.json({error:{message:"Catch Error, While Getting All active Student",errorCode:500},success:false}).status(400);
    })
})

module.exports =Router;