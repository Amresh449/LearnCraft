const mongoose=require("mongoose");
// const { MONGODB_CONNECTION_URI } = require("./keys");
const dotenv=require('dotenv');
dotenv.config();
const MONGODB_CONNECTION_URI  = process.env.MONGODB_CONNECTION_URI;
const connectDb=async()=>{
    try {
        const conn=await mongoose.connect(MONGODB_CONNECTION_URI,{
            useNewUrlParser:true,
            useUnifiedTopology:true,
        });
        console.log(`MongoDb is connected with host: ${conn.connection.host}`)
    } catch (error) {
        console.log("Error in setting database",error);
        process.exit();
    }
}
module.exports={
    connectDb,
}