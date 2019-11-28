const router=require('express').Router();
const bcrypt=require('bcryptjs');
const User=require('../models/user');



router.post('/register',(req,res)=>{
//console.log(req.body);
const {city,password,latitude,longitude}=req.body;
const username=req.body.username.toLowerCase()

User.find({username:username},(err,user)=>{
    
    if(user.length>0){
        res.status(400).send("Sorry, this username has been token. Please change different username")
    }else{
        const newuser=new User();
        bcrypt.genSalt(10,(err,salt)=>{
            bcrypt.hash(password,salt,(err,hash)=>{
                if(err){throw err}
                else{
                    newuser.password=hash;
                    newuser.username=username;
                    newuser.city=city;
                    newuser.latitude=latitude;
                    newuser.longitude=longitude;
                    newuser.save(()=>{
                        res.send('success')
                    })
                }
            })
        })
       
    }
})

})

router.get('/login',(req,res)=>{
    const {username,password}=req.query;
    User.findOne({username:username},(err,user)=>{
        if(user==null){
            res.status(400).send("Sorry, no such a user!")
        }else{
            bcrypt.compare(password,user.password,(err,isMatch)=>{
                if(isMatch){
                    res.status(200).json({
                        username:user.username,
                        latitude:user.latitude,
                        longitude:user.longitude

                    })
                }else{
                    res.status(400).send("Sorry, password is incorrect")
                }
            })
        }
        
    })
    
})


module.exports=router;