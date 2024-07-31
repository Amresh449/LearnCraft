const {Router}=require("express");
const mongoose=require("mongoose");
const {ensureAuth}=require("../middlewares/auth.js");

const Comment=mongoose.model("comments");
const router=new Router();

router.post("/create",ensureAuth,async(req,res)=>{
    try {
        const author=req.user;//author is the person making comment and he is logged in also
        const comment=await Comment.create({
            ...req.body,
            author:author.displayName,
            authorImage:author.image,
        });
        console.log(comment);
        res.status(201).send(comment);  
    } catch (error) {
        console.log("Something went wrong!!",error);
        res.status(500).send({});
    }
});
router.post("/fetch/replies",ensureAuth,async(req,res)=>{
    try {
        const {parentId,parentDepth}=req.body;
        if(!parentId || !parentDepth){
            return res.status(401).send({
                error:"Bad request... id or depth is not found",
            });
        }
        const replyList=await Comment.find({parentId,depth:Number(parentDepth)+1});
        res.status(200).send({replyList});
        
    } catch (error) {
        console.log(error);
        res.status(500).send({
            error:"Something went wrong",
        });
    }
    

});
module.exports=router;