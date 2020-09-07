const express = require('express');
const cors = require('cors')

const myDB=require('./data.json');

const app=express();
app.use(cors())

app.get('/api/offers',(req,res)=>{
    let data={ offers:myDB.offers }
    res.json(data);
});

app.get('/api/restaurants',(req,res)=>{
    let data={
        restaurantsList:[]
    }
    for(restaurant of myDB.restaurantsList){
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
});

app.get('/api/restaurant/:id',(req,res)=>{
    let data=myDB.restaurantsList.find( el => el.id===req.params.id)
    let {id,name,area,city,imgLink,cuisines,locality,avgRating,noOfRating,duration,discount,menuCategory,recommended}=data;
    let costForTwo=data.others.costForTwo/100;
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
    // console.log(JSON.stringify(data,null,2));
    res.json(result);
});

app.listen(3001);