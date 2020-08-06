const express = require("express");
const bodyParser = require("body-parser");
const my_day = require(__dirname + "/date.js");
const mongoose = require("mongoose");
const _ = require("lodash");
const app = express();

// const items = [];
// const work_items = [];

mongoose.connect("mongodb://localhost:27017/todolistDB", {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

const item_schema = {
  name: String,
};

const Item = mongoose.model("Item", item_schema);

const list_schema = {
  name: String,
  items: [item_schema],
};

const List = mongoose.model("List", list_schema);

const item1 = new Item({
  name: "Welcome to our todolist",
});
const item2 = new Item({
  name: "Press + to add items ",
});
const item3 = new Item({
  name: "<-- to delete items",
});

const defaultItem = [item1, item2, item3];

app.set("view engine", "ejs");

app.use(
  bodyParser.urlencoded({
    extended: true,
  })
);

app.use(express.static("public"));

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

app.get("/:custom_list_name", function (req, res) {
  const custom_list_name = _.capitalize(req.params.custom_list_name);
  //console.log(custom_list_name);

  List.findOne({ name: custom_list_name }, function (err, found_list) {
    if (!err) {
      if (!found_list) {
        console.log("Doesn't match");
        const list = new List({
          name: custom_list_name,
          items: defaultItem,
        });
        list.save();
        res.redirect("/" + custom_list_name);
      } else {
        console.log(found_list.name);
        res.render("list", {
          list_title: found_list.name,
          new_items: found_list.items,
        });
      }
    }
  });
});

// app.get("/work", function (req, res) {
//   res.render("list", { list_title: "Work List", new_items: work_items });
//   work_items.push(item);
//   res.redirect("/work");
// });

app.get("/about", function (req, res) {
  res.render("contact");
});

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

  // if (req.body.list_name === "Work") {
  //   work_items.push(item);
  //   res.redirect("/work");
  // } else {
  //   items.push(item);
  //   res.redirect("/");
  // }
});

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

app.listen(process.env.PORT || 3000, function (res, req) {
  console.log("server is running on port 3000");
});
