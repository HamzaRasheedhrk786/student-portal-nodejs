const Router = require('express').Router();
const bcrypt = require('bcryptjs');
// aquring admin model
const {Admin} = require("../../Models");
const { signUpAdminValidator , loginAdminValidator} = require("../../Models/Helpers");

// creating admin sign up
Router.post("/signup",(req,res)=>{
    const {admin} = req.body;
    signUpAdminValidator.validateAsync(admin).then(validated=>
        {
            if(validated){
                Admin.findOne({email:admin.email}).then(findAdmin=>{
                                if(findAdmin !== null){
                                    return res.json({error:{message:"Email Already Exists",errorCode:500},success:false}).status(400);
                                }
                                else{
                                    bcrypt.genSalt(10,(err,salt)=>{
                                        if(err){
                                            return res.json({error:{message:"Error While Generating Salt",errorCode:500},success:false}).status(400);
                                        }
                                        else{
                                            bcrypt.hash(admin.password,salt,(err,hash)=>{
                                                if(err){
                                                    return res.json({error:{message:"Error While Generating Hash",errorCode:500},success:false}).status(400);   
                                                }
                                                else{
                                                    let newRecord = new Admin({
                                                        email:admin.email,
                                                        password:hash
                                                    })
                                                    newRecord.save().then(savedAdmin => {
                                                        return res.json({message:"Record Saved Successfully",admin:savedAdmin,success:true}).status(200);
                                                    }).catch(err=>{
                                                        return res.json({erroe:{message:"Catch Error, While Saving Record",errorCode:500},success:false}).status(400);
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
                return res.json({error:{message:`${err}`,errorCode:500},success:false}).status(200);
            })
    
})
// creating Admin Login 
Router.post("/login",(req,res)=>{
    const {admin} = req.body;
    loginAdminValidator.validateAsync(admin).then(validated =>
        {
            if(validated){
            Admin.findOne({email:admin.email}).then(find =>{
                            if(!find){
                                return res.json({error:{message:"Email Not Found",errorCode:500},success:false}).status(400);
                            }
                            else
                            {
                                bcrypt.compare(admin.password,find.password, (err,match)=>{
                                    if(err){
                                        return res.json({error:{message:"Error In Password",errorCode:500},success:false}).status(400);
                                    }
                                    else if( match === true){
                                        return res.json({message:"Login Successfull",admin:find,success:true}).status(200);
                                    }
                                    else{
                                        return res.json({error:{message:"Login Unsuccessfull",errorCode:500},success:false}).status(400);
                                    }
                                })
                            }
                        }).catch(err =>
                            {
                                return res.json({error:{message:"Catch Error, While Finding Email",errorCode:500},success:false}).status(400);
                            })
                    }
            
        }).catch(err=>
            {
                return res.json({error:{message:`${err}`,errorCode:500},success:false}).status(400); 
            })
})
module.exports =Router;