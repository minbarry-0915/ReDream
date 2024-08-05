import express from 'express';
import bcrypt from 'bcryptjs';
import User from '../models/user.js'; // .js 확장자 명시

const router = express.Router();

router.post('/register', (req, res) => {
    const { id, username, password, birthdate } = req.body;
    if (!id || !username || !password || !birthdate) {
        return res.status(400).send('All fields are required');
    }

    // 비밀번호 해싱
    bcrypt.hash(password, 10, (err, hashedPassword) => {
        if (err) {
            return res.status(500).send('Error hashing password');
        }

        // 해싱된 비밀번호로 사용자 생성
        User.create(id, username, hashedPassword, birthdate, (error, results) => {
            if (error) {
                if (error.code === 'ER_DUP_ENTRY') {
                    return res.status(400).send('User ID already exists');
                }
                return res.status(500).send('Error registering user');
            }
            res.status(201).send('User registered successfully');
        });
    });
});

export default router; // ES 모듈에서 default export
