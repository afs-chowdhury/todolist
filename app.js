const express = require("express");
const bodyParser = require("body-parser");
const my_day = require(__dirname+"/date.js")

const app = express();

const items = [];
const work_items = [];

app.set("view engine", "ejs");

app.use(
  bodyParser.urlencoded({
    extended: true,
  })
);

app.use(express.static("public"));

app.get("/", function (req, res) {
  
  const day = my_day.getDate()

  res.render("list", { list_title: day, new_items: items });
});

app.get("/work", function (req, res) {
  res.render("list", { list_title: "Work List", new_items: work_items });
  work_items.push(item);
  res.redirect("/work");
});

app.get("/about",function(req,res){
  res.render("contact")
  
})

app.post("/", function (req, res) {
  let item = req.body.newItem;

  
if (req.body.list_name === 'Work'){
  work_items.push(item)
  res.redirect("/work")
} else{
  items.push(item)
  res.redirect("/")
}

});



app.listen(3000, function (res, req) {
  console.log("server is running on port 3000");
});
