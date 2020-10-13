const Restaurants = require("../models/restaurantsSchema");
const Offers = require("../models/offersSchema");

const isloggedin = (req, res) => {
  let data = {
    verifiedUser: true,
  };
  res.status(200).send(data);
};

const restaurants = (req, res) => {
  Restaurants.find({}).then((result) => {
    let data = {
      verifiedUser: true,
      restaurantsList: [],
    };
    for (eachRestaurant of result) {
      let {
        id,
        imgLink,
        name,
        cuisines,
        avgRating,
        duration,
        costForTwoString,
        shortDiscount,
        menuCategory,
        recommended,
        locality,
        area,
        veg,
      } = eachRestaurant;
      let menu = [];
      if (menuCategory.length <= 7) {
        menu = menuCategory;
      } else {
        for (i = 0; i < 6; i++) {
          menu.push(menuCategory[i]);
        }
        menu.push(`+${menuCategory.length - 6} More`);
      }
      let quickView = recommended
        .map((item, i) => {
          if (i < 6) {
            let newTemp = {
              id: item.id,
              name: item.name,
              imgLink: item.imgLink,
            };
            return newTemp;
          }
        })
        .filter((item) => {
          if (item) return item;
        });
      let temp = {
        id,
        imgLink,
        name,
        cuisines: cuisines.join(", "),
        avgRating,
        duration,
        costForTwoString,
        shortDiscount,
        locality,
        area,
        menuCategory: menu,
        quickView,
        veg,
      };
      data.restaurantsList.push(temp);
    }
    res.status(200).send(data);
  });
};

const offers = (req, res) => {
  Offers.find({}).then((result) => {
    let data = {
      verifiedUser: true,
      offers: result[0].offers,
    };
    res.status(200).send(data);
  });
};

const restaurant = (req, res) => {
  Restaurants.find({ id: req.params.id }).then((result) => {
    result = result[0];
    let {
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
      discount,
      menuCategory,
      recommended,
    } = result;
    let costForTwo = result.others.costForTwo / 100;
    cuisines = cuisines.join(", ");
    let items = recommended
      .map((el) => {
        let temp = {
          id: el.id,
          name: el.name,
          imgLink: el.imgLink,
          price: el.price / 100,
        };
        return temp;
      })
      .filter((el) => el);
    let response = {
      verifiedUser: true,
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
      recommended: items,
    };
    res.status(200).send(response);
  });
};

module.exports = {
  isloggedin,
  restaurants,
  offers,
  restaurant,
};
