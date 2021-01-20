const Router = require('express').Router();
// aquring the section model
const {Section,Class} = require("../../Models");
const { addSectionValidator ,updateSectionValidator } = require("../../Models/Helpers");

Router.get("/record",(req,res)=>{
    Section.find().then(sections=>{
        return res.json({message:"Sections Are Found",sections:sections,success:true}).status(200);
    }).catch(err => {
        return res.json({error:{message:"Catch Error, While Getting Section",errorCode:500},success:false}).status(400);
    })
})
// creating request for section
Router.post("/record",(req,res)=>{
    let {section} = req.body;
    addSectionValidator.validateAsync( section )
    .then(  validated => {
        // return res.json( validated ); 
        if(validated)
        {
            Section.findOne({name:section.name}).then(sectionFound => {
                            if(sectionFound === null){
                                let newRecord = new Section({
                                    name:section.name
                                })
                                newRecord.save().then(savedSection => {
                                    return res.json({message:"Section Added Successfully",section:savedSection,success:true}).status(200);
                                }).catch(err=> {
                                    return res.json({error:{message:"Catch Error, While Adding Section",errorCode:500},success:false}).status(400);
                                })
                            }
                            else{
                                return res.json({error:{message:"Section Name Already Exists",errorCode:500},success:false}).status(400);
                            }
                       })
                 
        }
    } ).catch( err => {
        return res.json({error:{message:`${err}`,errorCode:500},success:false}).status(400); 

    })
})
// updating section name
Router.put("/record/:id",(req,res)=>{
    let {section} =req.body;
    updateSectionValidator.validateAsync(section).then(validated =>
        {
            if(validated)
            {
                Section.findOne({name:section.name}).then(findSection =>{
                if(findSection !== null){
                    return res.json({error:{message:"Section Name Already Exist",errorCode:500},success:false}).status(400);
                }
                else{
                    Class.findOne({section:req.params.id}).then(classSection=>
                        {
                            if(classSection !== null)
                            {
                                return res.json({error:{message:"You Can't Update Because Class Exists Against This Section",errorCode:500},success:false}).status(400);
                            }
                            else
                            {
                                Section.findByIdAndUpdate({_id:req.params.id},{section}).then(updateSection =>{
                                    if(updateSection === null){
                                        return res.json({error:{message:"Section Not Exist Against Id",errorCode:500},success:false}).status(400);
                                    }
                                    else{
                                        if(section.name !==""){
                                            updateSection.name=section.name;
                                        }
                                        updateSection.save().then(updatedSection =>{
                                            return res.json({message:"Section Name Updated Successfully",section:updatedSection,success:true}).status(200);
                                        }).catch(err => {
                                            return res.json({error:{message:"Catch Error, While Saving Updated Record",errorCode:500},success:false}).status(400);
                                        })
                                    }
                                }).catch(err =>
                                    {
                                        return res.json({error:{message:"Catch Error, While Finding Section Id",errorCode:500},success:false}).status(400);
                                    })
                            }
                        }).catch(err=>{
                            return res.json({error:{message:"Catch Error, While Finding Section In Class ",errorCode:500},success:false}).status(400);
                        })
                    
                }
            }).catch(err=>
                {
                    return res.json({error:{message:"Catch Error,Finding Section Name",errorCode:500},success:false}).status(400);   
                })
        }
          
        }).catch(err =>
            {
                return res.json({error:{message:"Invalid Section Name, It Must Be One Character",errorCode:500},success:false}).status(400);
            })
        })
// Deleting Section Record
Router.delete("/record/:id",(req,res)=>{
    Class.findOne({section:req.params.id}).then(findClass=>
        {
            if(findClass !==null)
            {
                return res.json({error:{message:"You Can't Delete Because Class Exists Against This Section",errorCode:500},success:false}).status(400);
            }
            else{
                Section.findByIdAndRemove({_id:req.params.id}).then(sectionDelete =>{
                    if(!sectionDelete){
                        return res.json({error:{message:"Section Id Not Exists",errorCode:500},success:false}).status(400);
                    }
                    else{
                        return res.json({message:"Section Deleted Successfully",section:sectionDelete,success:true}).status(200);
                    }
                }).catch(err => {
                    return res.json({error:{message:"Catch Error, While Deleting Section",errorCode:500},success:false}).status(400);
                })
            }
        }).catch(err =>{
            return res.json({error:{message:"Catch Error, While Finding Section In Class ",errorCode:500},success:false}).status(400);
        })
    
})

module.exports =Router;