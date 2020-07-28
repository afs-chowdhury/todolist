const express = require('express')
const bodyParser = require('body-parser')

const app = express()

app.set("view engine", "ejs")


var today = new Date()

var current_day = today.getDay()



var day = ""
app.use(bodyParser.urlencoded(
    {
        extended: true
    }
))

app.get("/", function (req, res) {
    
    switch (current_day) {
        case 0:
            day = "Sunday"
            break;
        case 1:
            day = "Monday"
            break;
        case 2:
            day = "Tuesday"
            break;
        case 3:
            day = "Wednesday"
            break;
        case 4:
            day = "Thursday"
            break;
        case 5:
            day = "Friday"
            break;
        case 6:
            day = "Saturday"
            break;
        default:
            console.log("Error found , current day is : "+current_day)


    }
    res.render("list", { any_day: day });
    


})


app.listen(3000, function (res, req) {
    console.log("server is running on port 3000")
})