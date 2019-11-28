const mongoose=require('mongoose');

const barSchema=mongoose.Schema({
    barid:String,
    comments:[mongoose.Schema.Types.Mixed],
    numberOfPeople:Number
})


module.exports=mongoose.model('Bar',barSchema)