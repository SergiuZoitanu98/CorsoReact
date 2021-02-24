const express = require('express');
const cors = require("cors");
const app = express();
const bodyParser = require('body-parser');
const mongoose = require("mongoose");

app.use(cors());
app.use(bodyParser.json())
app.use(bodyParser.urlencoded({ extended: true }));

mongoose.connect('mongodb://localhost:27017/node-espress-api', {useNewUrlParser: true});

const port = 8000;
const postApi = require('./routes/posts')

app.use('/api/post', postApi);

app.listen(port, () => {
  console.log(`Example app listening at http://localhost:${port}`)
})
