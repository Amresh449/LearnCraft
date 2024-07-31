const express=require("express");
const {connectDb}=require("./config/db.js");
const dotenv = require('dotenv');
dotenv.config();
const mongoose=require("mongoose");
//create the session //store for storing the session
const session=require("express-session");
const passport=require("passport");
const MongoStore=require("connect-mongo")(session);


const app=express();
const PORT=process.env.URI || 3000;
app.set("view-engine","ejs");
app.use(express.static("public")); //this is for static resource that we will be using and path will be wrt public file
app.use(express.json()); //this tells the app to call middleware whenever any request using app is made.
//when we will pass data as request body we need to convert req body to json this allow the json data to be passed as body
connectDb();
//configuring the User.js to register the schema with mongoose instance
require("./models/User.js");
require("./models/Post.js");
require("./models/Comment.js");


app.use(session({
    secret:"mysecretkey",
    resave:false,
    saveUninitialized:true,
    store: new MongoStore({mongooseConnection:mongoose.connection}),
}))
require("./config/passport.js");
app.use(passport.initialize());  //set the passport as middleware
app.use(passport.session());  //takes care of session related stuffs like fetching session information,deserialization

//it is necessary to set all routes related to authentication after setting up the session
app.use("/auth",require("./routes/auth.js"));
app.use("/",require("./routes/index.js"));
app.use("/post",require("./routes/post.js"));
app.use("/comment",require("./routes/comment.js"));
app.use("/upload",require("./routes/upload.js"));

app.get("/internal-server-error",(req,res)=>{
    res.render("error-500.ejs");
});
app.get("/*",(req,res)=>{
    res.render("error-404.ejs");
})

// app.get("/",(req,res)=>{
//     // if(req.session.visitCnt)req.session.visitCnt++;
//     // else req.session.visitCnt=1;
//     res.send("Hello");
// })
app.listen(PORT,()=>{
    console.log(`Server is listening on ${PORT}`);
});