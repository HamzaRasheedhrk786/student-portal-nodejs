const Router = require('express').Router();
// aquring diary model
const {Diary ,Class,Student} = require('../../Models');
// aquring variable from storageImage file for uploading
const myUpload = require("../Files/storageImageFile").upload;

// creating request for diary //teacher adding diary of class
Router.post("/detail",myUpload.single('file'),(req,res)=>{
    try{
    const clasS = req.body.clasS;
    if(clasS === undefined || clasS === "")
    {
        return res.json({error:{message:"Invalid Class Name",errorCode:500},success:false}).status(400);
    }
    else
    {
        Class.findOne({_id:clasS}).then(findClass =>{
            if(findClass === null){
                return res.json({error:{message:"Class Id Not Exists",errorCode:500},success:false}).status(400);
            }
            else{
                let newDiary = new Diary({
                    image:`/files/image/${req.file.filename}`,
                    clasS:clasS
                })
                newDiary.save().then(saveDiary=>{
                    return res.json({message:"Diary Saved Successfully",Diary:saveDiary,success:true}).status(200);  
                }).catch(err=>
                    {
                        return res.json({error:{message:"Catch Error, While Saving Diary",errorCode:500},success:false}).status(400); 
                    })
            }
        }).catch(err=>{
            return res.json({error:{message:"Catch Error, While Finding Class",errorCode:500},success:false}).status(400);
        })
    }
}
catch(err){
    return res.json({error:{message:"Catch Error, While Finding Class",errorCode:500},success:false}).status(400);
}
})
// getting the detail of all diarys
Router.get("/detail",(req,res)=>{
    Diary.find().then(diaryRecord=>{
        return res.json({message:"Diary Records In system",Records:diaryRecord,success:true}).status(200);
    }).catch(err=>{
        return res.json({error:{message:"Catch Error,Getting Diary Records",errorCode:500},success:false}).status(400);
    })
})
// Student Request to seeing diary gainst date of ther class
Router.get("/getDiaryStudent/:date",(req,res)=>{
    Student.find().then(students=>{
        if(students.class === null){
            return res.json({error:{message:"No student Class Exists",errorCode:500},success:false}).status(400);
        }
        else{
            Diary.find().then(diarys=>
                {
                    if(diarys.class === null)
                    {
                        return res.json({error:{message:"No Diary Class Exists",errorCode:500},success:false}).status(400);
                    }
                    else if (students.class === diarys.class)
                    {
                        Diary.findOne({date:req.params.date}).then(diary=>{
                            if(!diary){
                                return res.json({error:{message:"No Diary Exist Against This Date",errorCode:500},success:false}).status(400);
                            }
                            else{
                            return res.json({message:"Diary Record Found",Diary:diary,success:true});
                            }
                        }).catch(err=>{
                            return res.json({error:{message:"Catch Error, Getting Diary Against Date",errorCode:500},success:false}).status(400);
                        })
                    }
                }).catch(err =>
                    {
                        return res.json({error:{message:"Catch Error,Whiling Finding Diary Class",errorCode:500},success:false}).status(400); 
                    })
        }
        
    }).catch(err=>
        {
            return res.json({error:{message:"Catch Error,Whiling Finding Student Class",errorCode:500},success:false}).status(400); 
        })
})
// updating Diary by Teacher Against Date
Router.put('/detail/:date',myUpload.single('file'),(req,res)=>{
    Diary.findOneAndUpdate({date:req.params.date}).then(findDiary=>
        {
            if(findDiary === null)
            {
                return res.json({error:{message:"No Dairy Exists Againsts This Date",errorCode:500},success:false}).status(400); 
            }
            else{
                if(findDiary.image !==null)
                {
                findDiary.image = `/files/image/${req.file.filename}`
                }
                findDiary.save().then(updatedDiary =>
                    {
                        return res.json({message:"Diary Updated Successfully",Diary:updatedDiary,success:true}).status(200);
                    })
            }
        })

})
// deleting diary record by teacher against date
Router.delete('/detail/:date',(req,res)=>{
    Diary.findOneAndRemove({date:req.params.date}).then(removed=>
        {
            if(!removed){
                return res.json({error:{message:"No Diary Exist Against This Date",errorCode:500},success:false}).status(400);
            }
            else{
                return res.json({message:"Diary Deleted Successfully",diary:removed,success:true}).status(200);
            }
        }).catch(err=>
            {
                return res.json({error:{message:"Catch Error,Whiling Deleting Diary",errorCode:500},success:false}).status(400);    
            })
})
module.exports =Router;