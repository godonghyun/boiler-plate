const { User } = require('../models/user');

let auth = (req, res, next) => {
    // 인증 처리 하는 부분

    // 클라이언트 쿠키에서 토큰을 가져온다.
    let token = req.cookies.x_auth;

    // 토큰을 복호화해서 유저를 찾는다.
    User.findByToken(token, (err, user) => {
        // 유저가 있으면 인증 okay
        // 유저가 없으면 인증 No

        if (err) throw err;
        if (!user) return res.json({ isAuth: false, error: true });

        // req에 token과 user를 넣어서
        // get 실제 부분에서 사용할 수 있도록 함
        req.token = token;
        req.user = user;
        next();
    })
}


module.exports = { auth };