
const mongoose=require("mongoose");

const ticketNotificationSchema=new mongoose.Schema({
    subject:{
        type:String,
        required:true,
    },
    ticketId:{
        type:String,
        required:true,
    },
    content:{
        type:String,
        required:true,
    },
    receipientEmails:{
        type:[String],
        required:true,
    },
    sendStatus:{
        type:String,
        required:true,
        default:"UN_SENT"
    },
    requester:{
        type:String,
    },
    createdAt: {
        type: Date,
        immutable: true,
        default: () => Date.now(),
    },
    updatedAt: {
        type: Date,
        default: () => Date.now()
    },
    
})
module.exports=mongoose.model("TicketNotification",ticketNotificationSchema)