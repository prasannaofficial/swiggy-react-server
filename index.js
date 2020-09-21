const express = require('express')


const cors = require('cors')
const jwt = require("jsonwebtoken")
const bcrypt = require("bcryptjs")
const bodyParser = require("body-parser")
const querystring = require('querystring');

//PROT
const port = process.env.PORT || 3000;

//MongoDB initialization
const MongoClient = require('mongodb').MongoClient
const url=process.env.URL || 'mongodb://127.0.0.1:27017';
const dbName = 'swiggy-replica'
let mongodb;
MongoClient.connect(url, {  
        poolSize: 30,
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
        return res.status(403).send({ verifiedUser:false, message: "No token provided!" });
    }
    jwt.verify(token, secret, (err, decoded) => {
        if (err) {
            return res.status(401).send({ verifiedUser:false,message: "Unauthorized!" });
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
                    if (!err){
                        var token = jwt.sign({ id: data._id,name:data.name,email:data.email },secret, {
                            expiresIn: 86400 // 24 hours
                        });
                        res.json({"userInserted":true,"message":"Account created successfully","token":token})
                    }
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

app.get('/api/isloggedin',verifyToken,(req,res)=>{
    col = mongodb.db(dbName).collection('offers');
    col.find({}).toArray(function(err,docs){
        let data={
            verifiedUser:true,
        };
        res.status(200).send(data);
    });
});

app.get('/api/offers',verifyToken,(req,res)=>{
    col = mongodb.db(dbName).collection('offers');
    col.find({}).toArray(function(err,docs){
        let data={
            verifiedUser:true,
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
            verifiedUser:true,
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
            verifiedUser:true,
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

app.post('/api/placeorder',verifyToken,(req,res)=>{
    col = mongodb.db(dbName).collection('orders');
    let date_ob = new Date();
    col.insertOne({userid:req.userId,date:date_ob,restname:req.body.restname,restarea:req.body.area,restimg:req.body.imglink,orders:JSON.parse(req.body.ordersjson),totalprice:req.body.totalprice}, function(err, data) {
        if (!err){
            res.json({"orderplaced":true,"message":"Order Placed Successfully!!"})
        }
    });
})

app.get('/api/ordershistory',verifyToken,(req,res)=>{
    col = mongodb.db(dbName).collection('orders');
    let {q,limit,offset,sort}=req.query;
    if(!q){
        switch(sort){
            case "new":
                col.find({userid:req.userId}).sort({date:-1}).toArray((err,docs)=>{
                    let result=docs.slice(offset,offset+limit)
                    res.json({arr:result,verifiedUser:true,length:docs.length});
                })
                break;
            case "old":
                col.find({userid:req.userId}).sort({date:1}).toArray((err,docs)=>{
                    let result=docs.slice(offset,offset+limit)
                    res.json({arr:result,verifiedUser:true,length:docs.length});
                })
                break;
            case "asce":
                col.find({userid:req.userId}).sort({restname:1}).toArray((err,docs)=>{
                    let result=docs.slice(offset,offset+limit)
                    res.json({arr:result,verifiedUser:true,length:docs.length});
                })
                break;
            case "desc":
                col.find({userid:req.userId}).sort({restname:-1}).toArray((err,docs)=>{
                    let result=docs.slice(offset,offset+limit)
                    res.json({arr:result,verifiedUser:true,length:docs.length});
                })
                break;
        }
    } 
    else{
        console.log(new RegExp(".*"+q+".*", 'i'))
        col.find({
            "userid":req.userId,
            "restname":{ $regex: new RegExp(".*"+q+".*", 'i')}
        }).toArray((err,docs)=>{
            console.log(docs)
            let result=docs.slice(offset,offset+limit)
            res.json({arr:result,verifiedUser:true,length:docs.length});
        })
    }
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