const {MongoMemoryServer}=require("mongodb-memory-server");
const mongoose=require("mongoose");
let mongod;

//Connect to the mongogDB server in virtual not install mongodb database

exports.connect=async()=>{
    if(!mongod){
        mongod=await MongoMemoryServer.create();
        const uri=mongod.getUri();
        const mongooseOpt={
            useUnifiedTopology:true,
            maxPoolSize:10
        }
        await mongoose.connect(uri,mongooseOpt);
    }
}

//close the cnnection form memory-server to start then colse it
exports.closeDatabase=async()=>{
    await mongoose.connection.dropCollection();
    await mongoose.connection.close();
    if(mongod) await mongod.stop();
}

//clear the database from the mongo-memory-server to availbale

exports.clearDataBase=async()=>{
    const collections=await mongoose.connection.collections
    for(const name in collections){
        console.log(name);
        const collection=collections[name];
        await collection.deleteMany();
    }
}
