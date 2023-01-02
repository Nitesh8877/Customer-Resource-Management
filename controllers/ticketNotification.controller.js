const TicketNotificationModel=require("../models/ticketNotification.model");

/**
 * This controller adds a new unsent notification to our db
 */
exports.acceptNotificationRequest=async(req,res)=>{
    const notificationObject={
        subject:req.body.subject,
        content:req.body.content,
        receipientEmails:req.body.receipientEmails,
        sendStatus:req.body.sendStatus,
        requester:req.body.requester,
        ticketId:req.body.ticketId
    }
    try {
        const notification=await TicketNotificationModel.create(
            notificationObject
        )
        console.log(notification);
        res.status(200).send({
            requestId:notification.ticketId,
            status:"Accepted Request Notification"
        })

    } catch (error) {
        res.status(500).send({
            message:"Some internal error occured while using notification request"
        })
    }
}


/**
 * This contreller tells the client the current status of a notification
 * 
 */
exports.getNotificationStatus=async(req,res)=>{
    const reqId=req.params.id;

    try {
        const notification=await TicketNotificationModel.findOne({
            ticketId:reqId
        })
       
        res.status(200).send({
            requestId:notification.ticketId,
            subject:notification.subject,
            content:notification.content,
            receipientEmails:notification.receipientEmails,
            sendStatus:notification.sendStatus
        })
    } catch (error) {
        res.status(500).send({
            message:"Some internal error occured! while inside status notification"
        })
    }
}