const express = require('express');
const app = express();
const port = 8080;

const mongoose = require('mongoose');
mongoose.connect('mongodb+srv://admin:admin1234@cluster0.bqvgn.mongodb.net/Cluster0?retryWrites=true&w=majority', {
    useNewUrlParser: true, useUnifiedTopology: true, useCreateIndex: true, useFindAndModify: false
}).then(() =>
    console.log('MongoDB connected...')
).catch(err =>
    console.log(err)
);


app.get('/', (req, res) => {
    res.sendFile(__dirname + '/index.js');
})

app.listen(port,() => {
    console.log("hello this is my server");
})