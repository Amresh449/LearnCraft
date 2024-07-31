const {Router}=require("express");
const { ensureAuth } = require("../middlewares/auth.js");
const { ensureSignup, ensureCreator } = require("../middlewares/user.js");
const mongoose=require("mongoose");

const Post=mongoose.model("posts");
const User=mongoose.model("users");
const Comment=mongoose.model("comments");
const moment=require('moment');

const router=new Router();

router.get("/create",ensureAuth,ensureSignup,ensureCreator,(req,res)=>{
    const user=req.user;
    res.locals.user=user;
    res.render("create-post.ejs");
});

router.post("/create",ensureAuth,ensureSignup,ensureCreator,async(req,res)=>{
    try {
        const post=await Post.create({
            // title:req.body.title,
            // subTitle:req.body.subTitle,
            // description:req.body.description,
            ...req.body,
            userId:req.user._id,
        });

        console.log(post);
        res.status(201).send({
            id:post._id,
        });
        
        
    } catch (error) {
        console.log("Error in creating post",error);
        res.status(500).send({
            message:"Something went wrong",
        });
    }
})
router.get("/view/:postId",async (req,res)=>{
    
    try {
        // console.log("here");
        const postId=req.params.postId;
        console.log(postId);
        const post=await Post.findById(postId);
        if(!post){
            res.redirect("/page-not-found");
        }
        // console.log("here2")
        //what we need to show a post: post related data + authors related data
        const authorId=post.userId;
        const author=await User.findById(authorId);
        const commentList=await Comment.find({postId,depth:1});

        res.locals.commentList=commentList;
        res.locals.user=req.user;
        res.locals.post=post;
        res.locals.author=author;
        console.log(post.createdAt);
        const postDate= moment(post.createdAt).format("dddd, MMMM Do YYYY");
        console.log(postDate);
        res.locals.postDate=postDate;
        // console.log("here3")
        res.render("post.ejs");
        
    } catch (error) {
      console.log(error);
      res.status(500).send({message:"Something went wrong!"});  
    }
})
module.exports=router;