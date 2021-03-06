const express = require('express'); //import express
const bodyParser = require('body-parser'); //import body parser
const app = express(); //make backend app
 //use body parser for parsing incoming request stream 
 // exposes it on req. body 
 app.use(bodyParser.json());
 //implement Routes-for the api endpoints 
 //to send request to dialogFlow

//import the DialogFlow routes
require('./routes/dialogFlowRoutes')(app);
//require('./routes/dialogFlowRoutes-2')(app);
const PORT = process.env.PORT || 5000;
app.listen(PORT); //app to listen 5000