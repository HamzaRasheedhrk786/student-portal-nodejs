const Router = require('express').Router();
// aquring class schema
const {Class , Section ,Teacher} = require("../../Models");
const { addClassValidator ,updateClassValidator } = require("../../Models/Helpers")
// getting class data 
Router.get("/record", (req,res) => {
    Class.find().populate('section','name').populate('teacher','name subject education schoolId')
    .then(classRecord => {
        return res.json({message:"Classes Records",Class:classRecord,success:true}).status(200);
    }).catch(err =>{
        return res.json({error:{message:"Error While Getting Record",errorCode:500},success:false}).status(400)
    })
})

// creating class
Router.post("/record",(req,res)=>{
    const {clasS} = req.body;
    addClassValidator.validateAsync(clasS).then(validated =>
        {
            if(validated){
                 // checking 
            Section.findOne({_id:clasS.section}).then(findSection =>{
                if(!findSection)
                {
                    return res.json({error:{message:"Section Id Not Found",errorCode:500},success:false}).status(400);
                } 
                
                else {
                    // uniqueness of name
                    Class.findOne({standard:`${clasS.standard}:${findSection.name}`}).then(user => {
                        if(user !==null){
                            return res.json({error:{message:"Standard Already Exist",errorCode:500},success:false}).status(400);
                        }
                        else{
                            let newRecord = new Class({
                                section:clasS.section,
                                standard:`${clasS.standard}:${findSection.name}`,
                                teacher:clasS.teacher
                            })
                            newRecord.save().then(savedClass =>{
                                return res.json({message:"Class Added Successfully",Class:savedClass,success:true}).status(200);
                            }).catch(err => {
                                return res.json({error:{message:"Catch Error, While Adding Class",errorCode:500},success:false}).status(400);
                            })
                        }
                    })
                   
                  }    
            }).catch(err =>
                {
                    return res.json({error:{message:"Catch Error, While Finding Section",errorCode:500},success:false}).status(400);
                })
            }
        }).catch(err =>
            {
                return res.json({error:{message:`${err}`,errorCode:500},success:false}).status(400);
            })
    
})
// Updating Class Data // Assign class to teacher
Router.put("/record/:id",(req,res)=>{
    const {clasS} = req.body;
    updateClassValidator.validateAsync(clasS).then(validated =>
        {
            if(validated){
                Teacher.findOne({_id:clasS.teacher}).then(teacher =>{
                                        if(teacher === null){
                                            return res.json({error:{message:"Teacher Id Not Exist",errorCode:500},success:false}).status(400);
                                        }
                                        else
                                        {
                                            Class.findOne({teacher:clasS.teacher}).then(find =>{
                                                if(find !==null){
                                                    return res.json({error:{message:"Teacher Id Already Exist",errorCode:500},success:false}).status(400);  
                                                }
                                                else{
                                                    Class.findByIdAndUpdate({_id:req.params.id},{clasS}).then(updatedClass=>{
                                                        if(updatedClass === null){
                                                            return res.json({error:{message:"Class Id Not Found",errorCode:500},success:false}).status(400);
                                                        }
                                                        if(clasS.teacher !=="")
                                                        {
                                                            updatedClass.teacher = clasS.teacher;
                                                        }
                                                        updatedClass.save().then(updateClass =>{
                                                            return res.json({message:"Class Updated Successfully",clasS:updateClass,success:true}).status(200);
                                                        }).catch(err=>{
                                                            return res.json({error:{message:"Catch Error, While Saving Updation",errorCode:500},success:false}).status(400);
                                                        })
                                                    })
                                                }
                                            }).catch(err=>
                                                {
                                                    return res.json({error:{message:"Catch Error, While Comparing Teacher Id",errorCode:500},success:false}).status(400);
                                                })
                                        }
                                    }).catch(err=>{
                                        return res.json({error:{message:"Invalid Teacher Id",errorCode:500},success:false}).status(400);
                                    }) 
            }
        }).catch(err=>{
            return res.json({error:{message:`${err}`,errorCode:500},success:false}).status(400);
        })
    
})
// Deleting Class 
Router.delete("/record/:id",(req,res)=>{
    Class.findByIdAndRemove({_id:req.params.id}).then(classDelete =>{
        if(!classDelete){
            return res.json({error:{message:"Class Id Not Exists",errorCode:500},success:false}).status(400);
        }
        else{
            return res.json({message:"Class Deleted Successfully",class:classDelete,success:true}).status(200);
        }
    }).catch(err => {
        return res.json({error:{message:"Catch Error, While Deleting Class",errorCode:500},success:false}).status(400);
    })
})

module.exports =Router;