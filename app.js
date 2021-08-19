//jshint esversion:6

const express = require("express");
const bodyParser = require("body-parser");
const date = require(__dirname + "/date.js");
const mongoose = require("mongoose");
const app = express();
const _ = require("lodash");

app.set('view engine', 'ejs');

app.use(bodyParser.urlencoded({
  extended: true
}));
app.use(express.static("public"));

mongoose.connect("mongodb+srv://admin-angelknela:Uo186700%3F@cluster0.exlex.mongodb.net/todoListDB?retryWrites=true&w=majority", {
  useNewUrlParser: true,
  useFindAndModify: false,
  useUnifiedTopology: true
});

const itemsSchema = new mongoose.Schema({
  name: String
});

const Item = mongoose.model("Item", itemsSchema);

const item1 = new Item({
  name: "Buy Food"
});

const item2 = new Item({
  name: "Eat Food"
});

const item3 = new Item({
  name: "Cook Food"
});

const defaultItems = [item1, item2, item3];
const listSchema = new mongoose.Schema({
  name: String,
  items: [itemsSchema]
})

const List = mongoose.model("List", listSchema);
const day = date.getDate();

app.get("/", function(req, res) {
  Item.find({}, function(err, results) {
    if (results.length === 0) {
      Item.insertMany(defaultItems, function(err) {
        if (err) {
          console.log(err);
        } else {
          console.log("succesfully added");
        }
      });
      res.redirect("/");
    } else {
      res.render("list", {
        listTitle: day,
        newListItems: results
      });
    }
  });
});

app.get("/:listName", function(req, res) {
  const listName = _.capitalize(req.params.listName);

  List.findOne({
    name: listName
  }, function(err, results) {
    if (!err) {
      if (!results) {
        const list = new List({
          name: listName,
          items: defaultItems
        });
        list.save();
        res.redirect("/" + listName);
      } else {
        res.render("list", {
          listTitle: results.name,
          newListItems: results.items
        });
      }
    }
  })
})

app.post("/:listName", function(req, res) {
  const newList = req.body.newList;
  res.redirect("/" + newList);
});

app.post("/", function(req, res) {

  const itemName = req.body.newItem;
  const listName = req.body.list
  const item = new Item({
    name: itemName
  });

  if (listName === day) {
    item.save();
    res.redirect("/");
  } else {
    List.findOne({
      name: listName
    }, function(err, results) {
      results.items.push(item);
      results.save();
      res.redirect("/" + listName);
    })
  }

});

app.post("/delete", function(req, res) {
  const checkedItemID = req.body.checkbox;
  const listName = req.body.listName;
  if (listName === day) {
    Item.findByIdAndRemove(checkedItemID, function(err) {
      if (!err) {
        console.log("Succesfully deleted item");
        res.redirect("/");
      }
    });
  } else {
    List.findOneAndUpdate({
      name: listName
    }, {
      $pull: {
        items: {
          _id: checkedItemID
        }
      }
    }, function(err, results) {
      if (!err) {
        res.redirect("/" + listName);
      }
    })
  }

});



app.get("/about", function(req, res) {
  res.render("about");
});

 let port = process.env.PORT;
 if (port == null || port =="") {
   port =3000;
 }
app.listen(3000, function() {
  console.log("Server started on port 3000");
});
