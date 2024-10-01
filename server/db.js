import mongoose from "mongoose";

const connect=()=>{
    
       
        mongoose.set("strictQuery", true);
        mongoose.connect(process.env.MONGO_DB_URL).then((res)=>{
            console.log("Connected to MONGODB")
        }).catch((err)=>[
            console.log(err)
        ])
  
}

export default connect