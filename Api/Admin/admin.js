const Router = require('express').Router();
const bcrypt = require('bcryptjs');
// aquring admin model
const {Admin} = require("../../Models");

// creating admin sign up
Router.post("/signup",(req,res)=>{
    try{
        const {admin} = req.body;
        let errorMessage = false;
        let RegularExpression = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
        let passRegex = /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])[0-9a-zA-Z]{8,}$/;
        if( admin.email=== undefined || admin.email === " " || (!RegularExpression.test(String(admin.email)) )){
            errorMessage="Invalid Email";
        }
        else if(admin.password === undefined || admin.password === " " || !passRegex.test(String(admin.password))){
            errorMessage="Invalid Password,It Contains At least 8 Characters Including Lowercase,Upercase & Integers";
        }
        else {
            errorMessage = false;
        }
        if(errorMessage === false){
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
            })

        }
        else{
            return res.json({error:{message:errorMessage,errorCode:500},success:false}).status(400);
        }

    
    }
    catch(err){
        return res.json({error:{message:"Catch Error, While Signup Admin",errorCode:500},success:false}).status(400);
    }
})
// creating Admin Login 
Router.post("/login",(req,res)=>{
    try{
    const {admin} = req.body;
    let errorMessage = false;
        let RegularExpression = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
        let passRegex = /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])[0-9a-zA-Z]{8,}$/;
        if( admin.email=== undefined || admin.email === "" || (!RegularExpression.test(String(admin.email)) )){
            errorMessage="Invalid Email";
        }
        else if(admin.password === undefined || admin.password === "" || !passRegex.test(String(admin.password))){
            errorMessage="Invalid Password,At least 8 Characters Including Lowercase,Upercase & Integers";
        }
        else {
            errorMessage = false;
        }
        if(errorMessage === false){
            Admin.findOne({email:admin.email}).then(find =>{
                if(!find){
                    return res.json({error:{message:"Admin Not Found",errorCode:500},success:false}).status(400);
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
            })

        }
        else{
            return res.json({error:{message:errorMessage,errorCode:500},success:false}).status(400);   
        }
    }
    catch(err){
        return res.json({error:{message:"Catch Error, While Login Admin",errorCode:500},success:false}).status(400);     
    }

})


module.exports =Router;