const express=require("express");
const app=express();
const mongoose=require("mongoose");
const Listing=require("./models/listing.js");
const path=require("path");
const methodOverride=require("method-override");
const ejsMate=require("ejs-mate");
const port=8080;
const MONGO_URL="mongodb://127.0.0.1:27017/StaySphere";
main()
.then(()=>{
    console.log("connected to DB");
})
.catch((err)=>{
    console.log(err);
});
async function main(){
    await mongoose.connect(MONGO_URL);
} 
app.engine("ejs",ejsMate);
app.set("view engine","ejs");
app.set("views",path.join(__dirname,"views"));
app.use(express.urlencoded({extended:true}));
app.use(methodOverride("_method")); 
app.use(express.static(path.join(__dirname,"/public")));


app.get("/",(req,res)=>{
    res.send("Hi i am root")
});
//index route 
app.get("/listings",async(req,res)=>{
    const allListings=await Listing.find({});
    res.render("listings/index.ejs",{allListings});
})
//New route
app.get("/listings/new",(req,res)=>{
    res.render("listings/new.ejs")
})

//show route
app.get("/listings/:id",async(req,res)=>{
    let {id}=req.params;
    const listing= await Listing.findById(id);
    res.render("listings/show.ejs",{listing});
});
app.post("/listings",async(req,res)=>{
    const newListing= new Listing(req.body.listing);
    await newListing.save();
    res.redirect("/listings")
})
//edit route
app.get("/listings/:id/edit",async(req,res)=>{
     let {id}=req.params;
    const listing= await Listing.findById(id); 
    res.render("listings/edit.ejs",{listing});
})
//Update route
app.put("/listings/:id",async(req,res)=>{
    let {id}=req.params;
    await Listing.findByIdAndUpdate(id,{...req.body.listing}); 
    res.redirect(`/listings/${id}`);
});

//Delete route
app.delete("/listings/:id",async(req,res)=>{
    let {id}=req.params;
    let deletedListing=await Listing.findByIdAndDelete(id);
    console.log(deletedListing);
    res.redirect("/listings");
});

// app.get("/testListening",async(req,res)=>{
//     let SampleListing=new Listing({
//         title:"My new Villa",
//         description:"By the beach",
//         price:1500,
//         location:"calangute,Goa",
//         country:"India",
//     });
//     await SampleListing.save();
//     console.log("sample was saved");
//     res.send("Succesful testing");
// });
app.listen(port,()=>{
    console.log(`Server  is listening on port:-${port}`)
});
  
