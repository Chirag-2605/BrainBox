const router = require('express').Router();
const { valid } = require('joi');
const {User} = require("../models/user");
const Joi = require('joi');
const bcrypt = require("bcrypt");
const jwt = require('jsonwebtoken');

const jwtSecret = process.env.JWT_SECRET;

router.post('/', async(req,res)=>{ 
    try{
        const {error} = validate(req.body);
        if(error){
            return res.status(400).send({message: error});
        }

        const user = await User.findOne({email:req.body.email});
        if(!user) {
            return res.status(401).send({message : 'Invalid email or password'}); 
        }

        const validPassword = await bcrypt.compare(
            req.body.password, user.password
        );
        if(!validPassword) {
            return res.status(401).send({message : "Invalid email or password"});
        }

        const token = jwt.sign({_id: user._id, userId:user._id}, jwtSecret, {expiresIn: '1h'});

        console.log(`User logged in: userId=${user._id}`);

        res.status(200).send({data:token, message:'Logged in successfully'});
    }catch(err) {
        console.log(err)
        res.status(500).send({message:"internal server error"});
    }
});

const validate = (data)=> {
    const schema = Joi.object({
        email: Joi.string().email().required().label("Email"),
        password: Joi.string().required().label("Password"),
    });
    return schema.validate(data);
}

module.exports = router;