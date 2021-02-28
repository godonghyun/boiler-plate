const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const saltRounds = 10;  // salt 글자 수

const userSchema = mongoose.Schema({
    name: {
        type: String,
        maxlength: 50
    },
    email: {
        type: String,
        trim: true,
        unique: true
    },
    password: {
        type: String,
        maxlength: 100
    },
    role: {
        type: Number,
        default: 0
    },
    image: String,
    token: {
        type: String
    },
    tokenExp: {
        type: Number
    }
});

// save 하기 전에 실행하는 작업
userSchema.pre('save', function (next) {
    let user = this;

    if (user.isModified('password')) {
        // 비밀번호 암호화
        bcrypt.genSalt(saltRounds, function (err, salt) {
            if (err) return next(err);
            bcrypt.hash(user.password, salt, function (err, hash) {
                if (err) return next(err);
                
                user.password = hash;
                next();
            });
        });
    } else {
        next();
    }
});

userSchema.methods.comparePassword = function (plainPassword, cb) {
    bcrypt.compare(plainPassword, this.password, (err, isMatch) => {
        if (err) return cb(err);
        else cb(null, isMatch);
    });
}

userSchema.methods.generateToken = function (cb) {
    let user = this;
    
    // jsonwebtoken을 이용해서 token을 생성하기
    let token = jwt.sign(user._id.toHexString(), 'secretToken');
    // id와 secretToken을 합해서 새로운 토큰을 만듬
    
    user.token = token;
    user.save((err, user) => {
        if (err) return cb(err);
        cb(null, user);
    })
    // 나중에 secretToken을 넣음
}

userSchema.statics.findByToken = function (token, cb) {
    var user = this;

    // 토큰을 decode 한다.
    jwt.verify(token, 'secretToken', function (err, decoded) {
        // 유저 아이디를 이용해서 유저를 찾은 다음에
        // 클라이언트에서 가져온 token과 DB에 보관된 토큰이 일치하는지 확인
       
        user.findOne({ '_id': decoded, "token": token }, (err, user) => {
            if (err) return cb(err);
            cb(null, user);
        });
    });
}

const User = mongoose.model('user', userSchema);

module.exports = { User };