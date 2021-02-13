const express = require('express');
const app = express();
const port = 8080;
const bodyParser = require('body-parser');
const { User } = require('./models/user');
const config = require('./config/key');

// application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: true }));
// application/json 
app.use(bodyParser.json());

const mongoose = require('mongoose');
mongoose.connect(config.mongoURI, {
    useNewUrlParser: true, useUnifiedTopology: true, useCreateIndex: true, useFindAndModify: false
}).then(() =>
    console.log('MongoDB connected...')
).catch(err =>  
    console.log(err)
);


app.get('/', (req, res) => {
    res.sendFile(__dirname + '/index.js');
})

app.post('/register', (req, res) => {
    // 회원 가입시 필요 정보를 client에서 가져오기
    // 그것들을 데이터베이스에 입력
    console.log(req.body);
    const user = new User(req.body);

    user.save((err, userInfo) => {
        if (err) return res.json({ success: false, err });
        return res.status(200).json({ success: true });
    });
})

app.listen(port,() => {
    console.log("hello this is my server");
})