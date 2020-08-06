const express = require("express");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");
const _ = require("lodash");
const app = express();
// const my_day = require(__dirname + "/date.js");     add date functionality later on

// connection to the mongoose database

mongoose.connect(
  "mongodb+srv://afschowdhury:Thisismyatlaspassword@cluster0.lr0vq.mongodb.net/todolistDB?retryWrites=true&w=majority",
  {
    useNewUrlParser: true,
  }
);

// item schema and model initialization

const item_schema = {
  name: String,
};

const Item = mongoose.model("Item", item_schema);

// custom list schema and model initialization

const list_schema = {
  name: String,
  items: [item_schema],
};

const List = mongoose.model("List", list_schema);

// default items to all the list

const item1 = new Item({
  name: "Welcome to our todolist",
});
const item2 = new Item({
  name: "Press + to add items ",
});
const item3 = new Item({
  name: "<-- hit this to delete items",
});

const defaultItem = [item1, item2, item3];

// connecting ejs to app

app.set("view engine", "ejs");

app.use(
  bodyParser.urlencoded({
    extended: true,
  })
);

app.use(express.static("public"));

// get methods for root route

app.get("/", function (req, res) {
  // const day = my_day.getDate();

  Item.find({}, function (err, items) {
    if (err) {
      console.log(err);
    } else {
      if (items.length === 0) {
        Item.insertMany(defaultItem, function (err) {
          if (err) {
            console.log(err);
          } else {
            console.log(
              "Default items has been added successfully to todolistDB"
            );
          }
        });

        res.redirect("/");
      } else {
        res.render("list", { list_title: "Today", new_items: items });
      }
    }
  });
});

// custom list get method

app.get("/:custom_list_name", function (req, res) {
  const custom_list_name = _.capitalize(req.params.custom_list_name);

  List.findOne({ name: custom_list_name }, function (err, found_list) {
    if (!err) {
      if (!found_list) {
        const list = new List({
          name: custom_list_name,
          items: defaultItem,
        });
        list.save();
        res.redirect("/" + custom_list_name);
      } else {
        res.render("list", {
          list_title: found_list.name,
          new_items: found_list.items,
        });
      }
    }
  });
});

app.get("/about", function (req, res) {
  res.render("contact");
});

// post methods

app.post("/", function (req, res) {
  let item_name = req.body.newItem;

  let list_name = req.body.list_name;

  const item = new Item({
    name: item_name,
  });

  if (list_name === "Today") {
    item.save();
    res.redirect("/");
  } else {
    List.findOne({ name: list_name }, function (err, found_list) {
      found_list.items.push(item);
      found_list.save();
      res.redirect("/" + list_name);
    });
  }
});

// for deleting

app.post("/delete", function (req, res) {
  const checked_item_id = req.body.checkbox;
  const list_name = req.body.list_name;
  if (list_name === "Today") {
    Item.findByIdAndRemove(checked_item_id, function (err) {
      if (err) {
        console.log(err);
      } else {
        console.log("item has been deleted successfully");
        res.redirect("/");
      }
    });
  } else {
    List.findOneAndUpdate(
      { name: list_name },
      { $pull: { items: { _id: checked_item_id } } },
      function (err, found_list) {
        if (err) {
          console.log(err);
        } else {
          res.redirect("/" + list_name);
        }
      }
    );
  }
});

// connecting app to ports

let port = process.env.PORT;
if (port == null || port == "") {
  port = 3000;
}
app.listen(port,function(req,res){
  console.log("server has started successsfully !");
});

// app.listen(process.env.PORT || 3000, function (res, req) {
//   console.log("server has started successfully !");
// });
