
const {Router}=require("express");
const router=new Router();
const {ensureAuth}=require("../middlewares/auth.js");
const {S3Client,PutObjectCommand}=require("@aws-sdk/client-s3");
const {getSignedUrl}=require("@aws-sdk/s3-request-presigner");

const {v4:uuid}=require("uuid");
// const { AWS_ACCESS_KEY, AWS_SECRET_ACCESS_KEY } = require("../config/keys.js");
const bucket=new S3Client({
    region:"ap-south-1",
    credentials:{
        accessKeyId:process.env.AWS_ACCESS_KEY,
        secretAccessKey:process.env.AWS_SECRET_ACCESS_KEY,
    },
});

const getPresignedUrl=async(fileName,fileType)=>{
    console.log(fileName,fileType);
    const uniqueFileName=fileName.split(".")[0]+"-"+uuid()+"."+fileType.split("/")[1];
    console.log(uniqueFileName);
    const command=new PutObjectCommand({
        Bucket:"learnflow449",
        Key:uniqueFileName,
        ContentType:fileType,
    });
    const url=await getSignedUrl(bucket,command,{expiresIn:3600});
    return {
        url,
        fileName:uniqueFileName,
    };
};

//router 
router.get("/presignedUrl",ensureAuth,async(req,res)=>{
    try {
        const {fileName,fileType}=req.query;
        if(!fileName || !fileType){
            return res.status(500).send({error:"something went wrong!!"});
        }
        const urlResponse=await getPresignedUrl(fileName,fileType);
        res.status(200).send(urlResponse);
        
    } catch (error) {
        console.log(error);
        res.status(500).send({error:"Something went wrong!!"});
    }
});

module.exports=router;

// (async()=>{
//     //will get a url in response
//     const res=await getPresignedUrl("xyz.jpg","image/jpg");
//     console.log(res);
// })();