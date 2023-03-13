const mongoose = require("mongoose");
const express = require("express");
const app = express();
const {v4:uuidv4} = require("uuid");
const multer = require("multer");
const cors = require("cors");
const jwt = require("jsonwebtoken")

app.use(cors());
app.use(express.json());

const uri = "mongodb+srv://MongoDb:1@reacteticaretdb.ozezrmx.mongodb.net/?retryWrites=true&w=majority"
mongoose.connect(uri).then(res=>{
    console.log("Database bağlantısı başarılı");
}).catch(err=>{
    console.log(err.message)
});

//User Collection
const userSchema = new mongoose.Schema({
    _id: String,
    name: String,
    email: String,
    password: String
});

const User = mongoose.model("User", userSchema);
//User Collection

//Product Collection
const productSchema = new mongoose.Schema({
    _id: String,
    name: String,
    stock: Number,
    price: Number,
    imageUrl: String
});

const Product = mongoose.model("Product", productSchema);
//Product Collection

//Basket Collection
const basketSchema = new mongoose.Schema({
    _id: String,
    productId: String,
    userId: String,
    count: Number,
    price: Number
});

const Basket = mongoose.model("Basket", basketSchema);
//Basket Collection

//Order Collection
const orderSchema = new mongoose.Schema({
    _id: String,
    productId: String,
    userId: String,
    count: Number,
    price: Number
})

const Order = mongoose.model("Order", orderSchema);
//Order Collection

//Token
const secretKey = "Gizli anahtarım Gizli anahtarım Gizli anahtarım";
const options = {
    expiresIn: "1h"
};
//Token


//Register İşlemi
app.post("/auth/register", async (req, res)=>{
    try {
        const {name, email, password} = req.body;
        let user = new User({
            _id: uuidv4(),
            name: name,
            email: email,
            password: password
        });

        await user.save();
        const payload = {
            user: user
        }
        const token = jwt.sign(payload, secretKey, options);
        res.json({user: user, token: token})
    } catch (error) {
        res.status(500).json({error: error.message})
    }
});

//Login Metodu
app.post("/auth/login", async (req, res)=>{
    try {
        const {email, password} = req.body;
        const users = await User.find({email: email, password: password});
        if(users.length == 0){
            res.status(500).json({message: "Mail adresi ya da şifre yanlış!"});
        }else{
            const payload = {
                user: users[0]
            }
            const token = jwt.sign(payload, secretKey, options);
            res.json({user: users[0], token: token})
        }
    } catch (error) {
        
    }
});

const port = 5000;
app.listen(5000, ()=>{
    console.log("Uygulama http://localhost:" + port + " üzerinden ayakata!");
});

