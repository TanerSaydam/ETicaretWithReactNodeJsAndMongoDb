const mongoose = require("mongoose");
const express = require("express");
const app = express();
const {v4:uuidv4} = require("uuid");
const multer = require("multer");
const cors = require("cors");
const jwt = require("jsonwebtoken")
const path = require("path");

app.use(cors());
app.use(express.json());
app.use("/uploads", express.static(path.join(__dirname, "uploads")));

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
    password: String,
    isAdmin: Boolean
});

const User = mongoose.model("User", userSchema);
//User Collection

//Product Collection
const productSchema = new mongoose.Schema({
    _id: String,
    name: String,
    stock: Number,
    price: Number,
    imageUrl: String,
    categoryName: String
});

const Product = mongoose.model("Product", productSchema);
//Product Collection

//Basket Collection
const basketSchema = new mongoose.Schema({
    _id: String,
    productId: String,
    userId: String,    
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
            password: password,
            isAdmin: false
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

//Product Listesi
app.get("/products", async (req, res) => {
    try {
        const products = await Product.find({}).sort({name: 1});
        res.json(products);
    } catch (error) {
        res.status(500).json({message: error.message});
    }
})
//Product Listesi

//Dosya kayıt işlemi
const storage = multer.diskStorage({
    destination: function(req, file, cb) {
        cb(null, "uploads/")
    },
    filename: function(req,file,cb){
        cb(null, Date.now() + "-" + file.originalname) 
    }
});

const upload = multer({storage: storage});
//Dosya kayıt işlemi

//Add Product İşlemi
app.post("/products/add", upload.single("image"), async (req, res)=>{
    try {
        const {name, categoryName, stock, price} = req.body;
        const product = new Product({
            _id : uuidv4(),
            name: name,
            stock: stock,
            price: price,
            categoryName: categoryName,
            imageUrl: req.file.path
        });

        await product.save();
        res.json({message: "Ürün kaydı başarıyla tamamlandı!"});
    } catch (error) {
        res.status(500).json({message: error.message});
    }
});
//Add Product İşlemi

//Remove Product İşlemi
app.post("/products/remove", async (req, res)=>{
    try {
        const {_id} = req.body;
        await Product.findByIdAndRemove(_id);
        res.json({message: "Silme işlemi başarıyla gerçekleşti"});
    } catch (error) {
        res.status(500).json({message: error.message});
    }
})
//Remove Product İşlemi

//Sepete Ürün Ekleme İşlemi
app.post("/baskets/add", async (req,res)=>{
    try {
        const {productId, userId} = req.body;
        let basket = new Basket({
            _id: uuidv4(),
            userId: userId,
            productId: productId
        });
        await basket.save();

        let product = await Product.findById(productId);
        product.stock = product.stock - 1;
        await Product.findByIdAndUpdate(productId, product);

        res.json({message: "Ürün sepete başarıyla eklendi"});
    } catch (error) {
        res.status(500).json({message: error.message});
    }
})
//Sepete Ürün Ekleme İşlemi

const port = 5000;
app.listen(5000, ()=>{
    console.log("Uygulama http://localhost:" + port + " üzerinden ayakata!");
});

