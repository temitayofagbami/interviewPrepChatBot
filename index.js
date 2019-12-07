const express = require('express');
const app = express(); //make backend app

app.get('/', (req, res)=>{
res.send({'hello' :'there'})
});//root handler, add callback fn


const PORT = process.env.PORT || 5000;
app.listen(PORT); //app to listen 5000