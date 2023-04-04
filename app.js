const { json } = require("express"); //for using external api
const express = require("express");
const https = require("https"); //for using api
const bodyParser = require("body-parser"); //for handling post request
const private=require(__dirname+"/private.js");
const app = express();



app.use(bodyParser.urlencoded({ extended: true }));
app.use("/public", express.static("public"));


app.get("/", function (req, res) {
  //web starting point
  res.sendFile(__dirname + "/index.html"); //server send this file on web
});



app.post("/",function (req,res){ //for handling post request if file on web send post request
    // console.log(req.body.cityName);
    // console.log("post request working");
    const query = req.body.cityName; //city name enter by user ,will come's  here
    const apiKey = private.apiKey; //my weathermap api key

    const url =
      "https://api.openweathermap.org/data/2.5/weather?q=" +
      query +
      "&appid=" +
      apiKey +
      "&units=metric"; //ful urlto access data
    https.get(url, function (response) {
      //send request to weathermap api
      console.log(response.statusCode);
      if(response.statusCode==404)
      {
        res.write("<h1>try specific place</h1>");
      }
      if(response.statusCode!=404){
      response.on("data", function (data) {
        //console.log(data);//it gives data in hexadecimal form
        //now convert hexadecimal data in json
        const weatherData = JSON.parse(data); //now data in json format
        const temp = weatherData.main.temp;
        const weatherDescription = weatherData.weather[0].description;
        const icon = weatherData.weather[0].icon;
        const imageURL =
          " https://openweathermap.org/img/wn/" + icon + "@2x.png";
        console.log(temp);
        console.log(weatherDescription);
        res.write(
          "<h1>The temperature of " +
          query +
          " is:" +
          temp +
          "degree celcius.</h1>"
        );
        //you can send only one res.send but can write multiple res.write
        res.write(
          "<h1>weather description is: " + weatherDescription + "</h1>"
        );
        res.write("<img src=" + imageURL + " alt=reload>");
        // res.sendFile(__dirname+"/send.html"); this is not working
      
      });
    }
    });
  }
);



app.listen(3000, function () {
  //for checking your server is working or not
  console.log("server is running on port 3000");
});
