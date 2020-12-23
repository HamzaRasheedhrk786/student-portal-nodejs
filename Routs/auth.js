const Router = require('express').Router();

//aquiring section rout
Router.use("/section",require("../Api/Section/section"));
//aquiring class rout
Router.use("/class",require("../Api/Class/class"));
//aquiring teacher rout
Router.use("/teacher",require("../Api/Teacher/teacher"));
//aquiring student rout
Router.use("/student",require("../Api/Student/student"));
//aquiring diary rout
Router.use("/diary",require("../Api/Diary/diary"));
//aquring admin rout
Router.use("/admin",require("../Api/Admin/admin")); 

module.exports =Router;