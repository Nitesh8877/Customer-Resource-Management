const mongoose = require('mongoose')

// mongoose.set('strictQuery', false);
mongoose.connect("mongodb://127.0.0.1:27017/test",
    () => { console.log("Connected To MongoDB") },
    err => { console.log("Error :", err.message) })
let cars = mongoose.model('Cars',
    mongoose.Schema({
        brand: String,
        model: String
    }))

cars.create({ "brand": "Maruti", "model": "Swift" })
    .then(data => console.log("Success"))
    .catch(err => console.log("Error",err))



// let id = mongoose.Types.ObjectId("63a092b93c0de97a1da59c09")

// cars.updateOne({ _id: id },
//     { brand: "Audi2" })
//     .then(console.log)
//     .catch(console.log)



// const mongoose = require("mongoose");

// mongoose.set('strictQuery', false);
// mongoose.connect("mongodb://localhost:27017/fruitsDB", { useNewUrlParser: true });

// const fruitSchema = new mongoose.Schema({
//   name: String,
//   rating: Number,
//   review: String
// });

// const Fruit = mongoose.model("Fruit", fruitSchema);

// const fruit = new Fruit({
//     name: "Apple",
//     rating: 7,
//     review: "Taste Good"
// });

// fruit.save();