const express = require("express");
const app = express();
const mongoose = require("mongoose");
app.use(express.json());
const bcrypt = require("bcryptjs");
const jwt = require('jsonwebtoken');

const mongoUrl ="mongodb+srv://waleedayub90:admin@cluster0.rubcqng.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0";


const JWT_SECRET ="hvdvay6ert72839289()aiyg8t87qt72393293883uhefiuh78ttq3ifi78272jdsds039[]]pau89ywe";

mongoose
.connect(mongoUrl).then(()=>{
    console.log("Db connected");
})
.catch((e)=>{
console.log(e);
})

require('./Userdata')
const User = mongoose.model("UserInfo");

app.get("/",(req,res)=>{
    res.send({status:"Started"});
});

app.post("/Signup", async (req,res)=>{
 const {name,email,phone,password} = req.body;

 const oldUser = await User.findOne({email:email});
 if(oldUser){
    return res.send({data:"User email already exist"})
 }

 const encryptpassword = await bcrypt.hash(password,10);
 
try {
    await User.create({
        name:name,
        email:email,
        phone,
        password:encryptpassword,
    })
    res.send({status:"ok",data:"User created"});
} 
catch (error) {
    res.send({status:"error", data: error});
}

})

app.post("/Login",async(req,res)=>{
    const {email,password} = req.body;

 const oldUser = await User.findOne({email:email});

 if(!oldUser){
    return res.send({data:"User doesnt exits"});
 }
 if(await bcrypt.compare(password,oldUser.password)){
    const token =jwt.sign({email: oldUser.email},JWT_SECRET);

    if(res.status(201)){
        return res.send({status:"ok" , data:token})
    }
    else{
        return res.send({error:"error"})
    }
 }
});


app.post('/userDetail',async(req,res)=>{
const {token}=req.body;
try {
    const user = jwt.verify(token,JWT_SECRET)
    const useremail = user.email;

    User.findOne({email:useremail}).then((data)=>{
    
    return res.send({status:"ok",data:data})
    });
} catch (error) {
    return res.send({error:error})
}
})

app.listen(5001,()=>{
console.log("server Started");
})