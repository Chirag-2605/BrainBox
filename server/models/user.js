const mongoose = require('mongoose');
const jwt = require('jsonwebtoken');
const Joi = require('joi');
const passwordComplexity = require('joi-password-complexity');

const userSchema = new mongoose.Schema({
    firstName : {
        type:String,
        required:true,
    },
    lastName : {
        type:String,
        required:true,
    },
    email : {
        type:String,
        required:true,
    },
    phone : {
        type:Number,
        required:true,
    },
    password : {
        type:String,
        required:true,
    },
    kanbanTodos: [{
        type: String,
        ref: 'KanbanToDo'
    }]
});

userSchema.methods.generateAuthToken = function() {
    const token = jwt.sign({_id:this._id}, "BrainBoxPrivateKey123",{expiresIn:"7d"});
    return token;
}

const User = mongoose.model("user",userSchema);

const validate = (data) => {
    const schema = Joi.object({
        firstName: Joi.string().required().label("First Name"),
        lastName: Joi.string().required().label("Last Name"),
        email: Joi.string().required().label("Email"),
        phone: Joi.number().required().label("Phone Number"),
        password: passwordComplexity().required().label("Password"),
    });
    return schema.validate(data);
}

module.exports = { User, validate};