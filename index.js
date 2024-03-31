const express = require("express");
const mongoose = require("mongoose");
const shortUrlModel = require("./models/shortUrl");
const app = express();
require("dotenv").config();

connectDB();
async function connectDB(){
  try{
    const conn = await mongoose.connect(process.env.MONGO_URI);
    console.log("Database connected");
  }catch(err){
    console.log(err);
  }
}

app.set("view engine", "ejs");
app.use(express.urlencoded({extended:false}));

app.get("/", async (req,res)=>{
    const data = await shortUrlModel.find();
    res.render("index", {data: data});
})
app.post("/shortUrls", async (req,res)=>{
    await shortUrlModel.create({fullUrl: req.body.fullUrl});
    res.redirect("/");

})
app.get("/:shortUrl", async (req,res)=>{
    const url = await shortUrlModel.findOne({shortUrl: req.params.shortUrl});
    if(url == null) return res.sendStatus(404);
    url.clickCount++;
    url.save();
    res.redirect(url.fullUrl);
})

app.listen(process.env.PORT || 5000);