const NotificationController=require("../controllers/ticketNotification.controller");

module.exports=function (app){
    app.post("/crm/api/notification",NotificationController.acceptNotificationRequest);
    app.get("/crm/api/notification/:id",NotificationController.getNotificationStatus)
}
