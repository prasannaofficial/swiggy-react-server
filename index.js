const express = require('express')
const cors = require('cors')

// const myDB=require('./data.json');

const MongoClient = require('mongodb').MongoClient
let url="";
if(process.env.URL){
    url=process.env.URL;
}
else{
    url='mongodb://127.0.0.1:27017';
    console.log(url);
}
const dbName = 'swiggy-replica'

let mongodb;
MongoClient.connect(url, {  
    poolSize: 10
  },function(err, db) {
      mongodb=db;
      }
  );

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

const app=express();
app.use(cors())

app.get('/api/offers',(req,res)=>{
    col = mongodb.db(dbName).collection('offers');
    col.find({}).toArray(function(err,docs){
        let data={
            offers:docs[0].offers
        };
        res.json(data);
    });
});

app.get('/api/restaurants',(req,res)=>{
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
        res.json(data);
    })
});

app.get('/api/restaurant/:id',(req,res)=>{
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
        res.json(result);
    });
})

app.listen(process.env.PORT || 3000,()=>{
    console.log(`Process running on port ${process.env.PORT || 3000}`)
});