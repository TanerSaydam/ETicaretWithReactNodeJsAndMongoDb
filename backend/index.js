const mongoose = require("mongoose");
const express = require("express");
const app = express();
const {v4:uuidv4} = require("uuid");
const multer = require("multer");
const cors = require("cors");

app.use(cors());
app.use(express.json());

const uri = "mongodb+srv://MongoDb:1@reacteticaretdb.ozezrmx.mongodb.net/?retryWrites=true&w=majority"
mongoose.connect(uri).then(res=>{
    console.log("Database bağlantısı başarılı");
}).catch(err=>{
    console.log(err.message)
});


const port = 5000;
app.listen(5000, ()=>{
    console.log("Uygulama http://localhost:" + port + " üzerinden ayakata!");
});

