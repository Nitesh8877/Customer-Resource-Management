const mongoose=require("mongoose");
const authController=require("./controllers/auth.controller");
const express=require('express');
const dbConfig=require("./configs/db.config")
const app=express();
const constants=require("./utils/constants");
const User=require('./models/user.model');
const bcrypt=require("bcryptjs");

async function init() {
    let user = await User.findOne({ userId: "admin" })

    if (user) {
        console.log("Admin user already present", user)
        return
    }

    try {
        let user = await User.create({ 
            name: "nitesh",
            userId: "admin",
            email: "kumarnitesh88441@gmail.com",
            userType: "ADMIN",
            password: bcrypt.hashSync("Welcome1", 8),
            userStatus: constants.userStatus.approved
        })
        console.log(user)
    } catch (err) {
        console.log(err.message)
    }
}

 app.use(express.json());
// mongoose.connect(dbConfig.DB_URL);
// app.use(express.json());
// const db=mongoose.connection
// db.on("error",()=>console.log("Can't connect to DB"));
// db.once("open",()=>
// {
//     console.log("Connected to mongo DB");
//     init();
// })
console.log("before mongodb connect");
mongoose.set('strictQuery', true);
mongoose.connect(dbConfig.DB_URL)
  .then(() => {
    console.log("DB Connetion Successfull");
        init();
  })
  .catch((err) => {
    console.log(err, "something went wrong in mongodb connection");
  });
console.log("After mongodb connected")
const AuthRouter=require('./routes/auth.route');
AuthRouter(app);
const userRouter=require('./routes/user.route');
userRouter(app);
const ticketRouter=require("./routes/ticket.routes");
ticketRouter(app);

module.exports= app.listen(3000,()=>console.log("server is started port number: 3000"))
