const User = require("../models/user.model");
const { userTypes } = require("../utils/constants");
const constants = require("../utils/constants");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const config = require("../configs/auth.config");

exports.signup = async (req, res) => {
    let userStatus
    if (req.body.userType == userTypes.engineer ||
        req.body.userType == userTypes.admin) {
        userStatus = constants.userStatus.pending
    } else {
        userStatus = constants.userStatus.approved
    }
    const userObj={
        name:req.body.name,
        userId:req.body.userId,
        email:req.body.email,
        userType:req.body.userType,
        password:bcrypt.hashSync(req.body.password,8),
        userStatus:userStatus
    }
    try {
        const userCreated=await User.create(userObj);
        const postResponse={
            name:userCreated.name,
            userId:userCreated.userId,
            email:userCreated.email,
            userTypes:userCreated.userType,
            userStatus:userCreated.userStatus
        }
        res.status(201).send(postResponse);
        
    } catch (error) {
        res.status(500).send({
            message:"some internal error while inserting the element"
        })
    }


}


exports.signin=async(req,res)=>{
    const user= await User.findOne({userId:req.body.userId})
    if(!user){
        res.status(400).send({
            message:"Failed UserId doesn't exit!"
        })
        return;
    }
    if(user.userStatus!=constants.userStatus.approved){
        res.status(403).send({
            message:`Can't allow login as user is in status: [${user.userStatus}]`
        })
    }
    let passwordValid=bcrypt.compareSync(
        req.body.password,
        user.password

    )
    if(!passwordValid){
        res.status(401).send({
            message:"Invalid Password!"

        })
        return;
    }
    let token=jwt.sign({userId:user.userId},config.secret,{
        expiresIn:86400//24 hours
    })
    // let data={
    //     name:user.name,
    //     userId:user.userId,
    //     email:user.email,
    //     userTypes:user.userType,
    //     userStatus:user.userStatus,
    //     accessToken:token
    // }
    // console.log(data)
    res.status(200).send({
        name:user.name,
        userId:user.userId,
        email:user.email,
        userTypes:user.userType,
        userStatus:user.userStatus,
        accessToken:token
    })
}