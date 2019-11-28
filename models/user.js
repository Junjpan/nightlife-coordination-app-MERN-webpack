const mongoose=require('mongoose');

const userSchema=mongoose.Schema({
    username:{
        type:String,
        trim:true
    },
    password:String,
    city:String,
    latitude:'',
    longitude:'',
})

module.exports=mongoose.model("User",userSchema);