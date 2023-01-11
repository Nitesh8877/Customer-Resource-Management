/**
 * Controllers for the user resources.
 * Only the user of type ADMIN should be able to perform the operations
 * defined in the User Controller
 */
const User=require("../models/user.model");
const ObjectConverter=require("../utils/objectConverter")

/**
 * fetch the data by using name
 */
const fetchByName=async(userNameReq,res)=>{
    let users
     try {
        users=await User.find({
            name:userNameReq
        });
        return users;
     } catch (error) {
        res.status(500).send({
            message:"Some internal error occured"
        })
     }
     
}
/** 
 * Fetch all the data in database
*/
const fetchAll=async(res)=>{
    let users
    try {
        users=await User.find()
        return users;
    } catch (error) {
        res.status(500).send({
            message:"Some internal error occured"
        })
    }
   
}
/** 
 * Fetch all the data by type of status and which type of data like admin,engineer,student
 * 
 */
const fetchByTypeAndStatus= async(userTypeReq,userStatusReq,res)=>{
    let users

    try {
        users=await User.find({
            userType:userTypeReq,
            userStatus:userStatusReq
        })
        return users;
        
    } catch (error) {
        res.status(500).send({
            message:"Some internal error occured"
        })
    }
    
}

/** 
 * Fetch the data by using which type of the data
 */
const fetchByType=async(userTypeReq,res)=>{

    let user
    try {
        user=await User.find({
            userType:userTypeReq
        })
        return user;
        
    } catch (error) {
        res.status(500).send({
            message:"Some internal error occured"
        })
    }


}

/**
 * Fetch the data by status like->pending,approved
 */
const fetchByStatus=async(userStatusReq,res)=>{
    let users
    try {
        users=await User.find({
            userStatus:userStatusReq
        })
        return users;
    } catch (error) {
        res.status(500).send({
            message:"Some internal error occured"
        })
    }
    
}

/**
 * Fetch the list of all users
 */

exports.findAll=async (req,res)=>{
    let users
   let userTypeReq=req.query.userType;
   let userStatusReq=req.query.userStatus;
   let userNameReq=req.query.name;
   if(userNameReq){
    users=await fetchByName(userNameReq,res);
   }else if(userTypeReq && userStatusReq){
    users=await fetchByTypeAndStatus(userTypeReq,userStatusReq,res);
   }
   else if(userTypeReq){
    users=await fetchByType(userTypeReq,res);
   }else if(userStatusReq){
    users=await fetchByStatus(userStatusReq,res);
   }else{
    users=await fetchAll(res);
   }
   if(users){
    res.status(200).send(ObjectConverter.userResponse(users));
   }
}


/**
 * Fetch the user by using ID
 * 
 */

exports.findById=async(req,res)=>{
    const userIdReq=req.params.userId;

    let user
    try {
        user=await User.find({
            userId:userIdReq
        })
        if(user.length>0){
            res.status(200).send(ObjectConverter.userResponse(user));
    }else{
        res.status(200).send({
            message:`User with this id [${userIdReq}] is not present`
        })
    }
    } catch (error) {
        res.status(500).send({
            message:"Some internal error occured ! find by id side"
        })
    }
    
}


/**
 * Update the user pending Status
 */

exports.update=async(req,res)=>{
    const userIdReq=req.params.userId;
    try {
        const user=await User.findOneAndUpdate({
            userId:userIdReq
        },{
            userStatus:req.body.userStatus
        }).exec();
        if(user){
            res.status(200).send({
                message:`User record has been updated successfully`
            })
        }else{
            res.status(200).send({
                message:"No user with id found!"
            })
        }
        
    } catch (error) {
        res.status(500).send({
            message:"Some internal error occured! in update function"
        })
        
    }
}