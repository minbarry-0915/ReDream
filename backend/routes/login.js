import express from 'express';
import User from '../models/user.js'; // .js 확장자 명시

const router = express.Router();

router.post('/login', (req, res) => {
    const { id, password } = req.body;
    if (!id || !password) {
        return res.status(400).send('ID and password are required');
    }

    User.login(id, password, (error, user, info) => {
        // 성공하면 user를 돌려줌
        if (error) {
            return res.status(500).send('Error logging in');
        }
        if (!user) {
            return res.status(401).send(info.message);
        }

        // 로그인 성공
        res.status(200).send('Login successful');
    });
});

export default router; // ES 모듈에서 default export
