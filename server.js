const express = require('express');
const app = express();
const mongoose = require('mongoose');
// aquiring url from config
const url = require("./CONFIG/dbConfig").mongodbonline;
// middleware for
app.use(express.json());
app.use(express.urlencoded({extended:true,useNewUrlParser:true}))
// connnection with mongoose
mongoose.connect(url,{useNewUrlParser:true,useUnifiedTopology:true,useFindAndModify:false})
.then(m=>{
    console.log("Database Is Connected");
    // aquiring routs
   app.use("/auth",require("./Routs/auth"));
   //aquirnig files
   app.use('/files',require('./Api/Files/getImageFile'));
   // getting server response
   app.get("/",(req,res)=>{
       return res.json({message:"Server Is Running",success:true}).status(200);
   })
})
// defining port using env variable
const Port = process.env.PORT || 5000;
app.listen(Port, () => {
    console.log(`App Is Listening At Port ${Port}`);
})