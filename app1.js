require("./crons/cron")
const dbConfig = require("./configs/db.config.notification");
const mongoose = require("mongoose");
const express = require("express");
const app = express();
app.use(express.json());

mongoose.connect(dbConfig.DB_URL,
    () => { console.log("database is connected! ") },
    err => { console.log("Error", err.message) }
);

const NotificationRouter=require("./routes/ticketNotification.routes");
NotificationRouter(app);

app.listen(3030,()=>{
    console.log("Application started on port this : 3030");
})

