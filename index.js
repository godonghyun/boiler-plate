const express = require('express');
const app = express();
const port = 8080;
const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser');
const { User } = require('./models/user');
const config = require('./config/key');

// application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: true }));
// application/json 
app.use(bodyParser.json());
app.use(cookieParser());

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
    const user = new User(req.body);

    user.save((err, userInfo) => {
        if (err) return res.json({ success: false, err });
        return res.status(200).json({ success: true });
    });
})

app.post('/login', (req, res) => {
    // callback function 호출 위치와 인자를 잘 생각해야될 듯
    
    // 요청된 이메일을 데이터베이스에서 있는지 찾는다.
    User.findOne({ email: req.body.email }, (err, user) => {
        // 이메일이 존재하지 않음
        if (!user) {
            return res.json({
                loginSuccess: false,
                message: "제공된 이메일에 해당하는 유저가 없습니다."
            })
        }

        // comparePassword함수는 user schema 코드에서 구현한 함수
        // 요청된 이메일이 데이터베이스에 있다면 비밀번호가 같은지 확인한다.
        user.comparePassword(req.body.password, (err, isMatch) => {
            if (!isMatch)
                return res.json({
                    loginSuccess: false,
                    message: "비밀번호가 틀렸습니다."
                });
            
            // 비밀번호까지 맞다면 토큰을 생성하기
            user.generateToken((err, user) => {
                if (err) return res.status(400).send(err);

                // 토큰을 저장한다. 
                res.cookie("x_auth", user.token).status(200).json({
                    loginSuccess: true,
                    userId: user._id
                });
            });
        });
    });
})

app.listen(port,() => {
    console.log("hello this is my server");
})