const authJwt=require("../middleware/authJwt");
const UserController=require("../controllers/user.controller")
module.exports=function(app){
    app.get("/crm/api/users",[authJwt.verifyToken,authJwt.isAdmin],UserController.findAll)
    
    app.get("/crm/api/users/:userId",[authJwt.verifyToken,authJwt.isAdmin],UserController.findById)

    app.put("/crm/api/users/:userId",[authJwt.verifyToken,authJwt.isAdmin],UserController.update);
  
}