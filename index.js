const express = require('express')
const cors = require('cors')
const jwt = require("jsonwebtoken")
const bcrypt = require("bcryptjs")
const bodyParser = require("body-parser")

//PROT
const port = process.env.PORT || 3000;

//MongoDB initialization
const MongoClient = require('mongodb').MongoClient
const url=process.env.URL || 'mongodb://127.0.0.1:27017';
const dbName = 'swiggy-replica'
let mongodb;
MongoClient.connect(url, {  
        poolSize: 10,
        useUnifiedTopology: true
    },function(err, db) {
            mongodb=db;
        }
    );

//bcrypt and JWT initialization
const saltRounds=8;
const secret = process.env.secret || 'helloworld';
verifyToken = (req, res, next) => {
    let token = req.headers["x-access-token"];
    if (!token) {
        return res.status(403).send({ message: "No token provided!" });
    }
    jwt.verify(token, secret, (err, decoded) => {
        if (err) {
            return res.status(401).send({ message: "Unauthorized!" });
        }
        req.userId = decoded.id;
        req.userName = decoded.name;
        req.userEmail = decoded.email;
        next();
    });
};

const app=express();
app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

app.post('/api/auth/signup',(req,res)=>{
    // console.log(req.body);
    bcrypt.hash(req.body.password, saltRounds).then(function(hash) {
        col = mongodb.db(dbName).collection('user');
        col.findOne({email:req.body.email},(err,data)=>{
            if(!data){
                col.insertOne({name:req.body.name,email:req.body.email,password:hash}, function(err, data) {
                    if (!err)
                        res.json({"userInserted":true,"message":"Account created successfully!! Please Login"})
                });
            }
            else{
                res.json({"userInserted":false,"message":"Email ID already exists please try login!!"})
            }
        })
    });
})

app.post('/api/auth/login',(req,res)=>{
    col = mongodb.db(dbName).collection('user');
    col.findOne({email:req.body.email},(err,data)=>{
        if(data){
            bcrypt.compare(req.body.password, data.password).then(function(result) {
                if(result){
                    var token = jwt.sign({ id: data._id,name:data.name,email:data.email },secret, {
                        expiresIn: 86400 // 24 hours
                    });
                    // console.log(token)
                    res.json({"loggedin":true,"message":"user loggedin successfully","token":token})
                }
                else{
                    res.json({"loggedin":false,"message":"Incorrect Email ID or Password!!"})
                }
            });
        }
        else{
            res.json({"loggedin":false,"message":"Incorrect Email ID or Password!!"})
        }
    })
})

app.get('/api/offers',verifyToken,(req,res)=>{
    col = mongodb.db(dbName).collection('offers');
    col.find({}).toArray(function(err,docs){
        let data={
            offers:docs[0].offers
        };
        // res.json(data);
        res.status(200).send(data);
    });
});

app.get('/api/restaurants',verifyToken,(req,res)=>{
    col = mongodb.db(dbName).collection('restaurants');
    col.find({}).toArray((err,docs)=>{
        let data={
            restaurantsList:[]
        }
        for(restaurant of docs){
            let {id,imgLink,name,cuisines,avgRating,duration,costForTwoString,shortDiscount,menuCategory,recommended,locality,area,veg}=restaurant;
            let menu=[]
            if(menuCategory.length<=7){
                menu=menuCategory;
            }
            else{
                for(i=0;i<6;i++){
                    menu.push(menuCategory[i]);
                }
                menu.push(`+${menuCategory.length-6} More`)
            }
            let quickView=recommended.map((item,i)=>{
                if(i<6){
                    let newTemp={
                        id:item.id,
                        name:item.name,
                        imgLink:item.imgLink
                    }
                    return newTemp;
                }
            }).filter(item=>{if(item) return item});
            let temp={
                id,
                imgLink,
                name,
                cuisines:cuisines.join(', '),
                avgRating,
                duration,
                costForTwoString,
                shortDiscount,
                locality,
                area,
                menuCategory:menu,
                quickView,
                veg
            }
            data.restaurantsList.push(temp)
        }
        // res.json(data);
        res.status(200).send(data);
    })
});

app.get('/api/restaurant/:id',verifyToken,(req,res)=>{
    col = mongodb.db(dbName).collection('restaurants');
    col.find({"id":req.params.id}).toArray(function(err,docs){
        docs=docs[0];
        let {id,name,area,city,imgLink,cuisines,locality,avgRating,noOfRating,duration,discount,menuCategory,recommended}=docs;
        let costForTwo=docs.others.costForTwo/100;
        cuisines=cuisines.join(', ');
        let items=recommended.map(el=>{
            let temp={
                id:el.id,
                name:el.name,
                imgLink:el.imgLink,
                price:el.price/100
            }
            return temp;
        }).filter(el => el)
        let result={
            id,
            name,
            area,
            city,
            imgLink,
            cuisines,
            locality,
            avgRating,
            noOfRating,
            duration,
            costForTwo,
            discount,
            menuCategory,
            recommended:items
        }
        // res.json(result);
        res.status(200).send(result);
    });
})

app.listen(port,()=>{
    console.log(`Process running on port ${port}`)
});


//-------Template---------
// MongoClient.connect(url, { useUnifiedTopology: true }, (err, client) => {
//     if (err) return console.log(err)
//     db = client.db(dbName)
//     col=db.collection('------');
//     col.find({}).toArray(function(err,docs){
//         let data={};
//         res.json(data);
//     });
// })
//-------------------------

// const MongoClient = require('mongodb').MongoClient;
// const uri = "mongodb+srv://<name>:<pwd>@prasanna.6bywy.gcp.mongodb.net/swiggy-replica?retryWrites=true&w=majority";
// const client = new MongoClient(uri, { useUnifiedTopology: true });
// client.connect(err => {
//     const collection = client.db("swiggy-replica").collection("offers");
//     console.log(collection.find({}));
//     client.close();
// });