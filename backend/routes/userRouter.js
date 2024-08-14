import express from 'express';
import User from '../models/userModel.js'; // .js 확장자 명시
import Book from '../models/bookModel.js';
import bcrypt from 'bcryptjs';

const router = express.Router();

router.post('/user/register', (req, res) => {
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

router.post('/user/login', (req, res) => {
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

router.delete('/user/delete/:id', async (req, res) => {
    const { id } = req.params;

    if (!id) {
        return res.status(400).send('User ID is required');
    }

    try {
        // 사용자와 관련된 모든 책 조회
        const books = await new Promise((resolve, reject) => {
            Book.view(id, (error, results) => {
                if (error) return reject(error);

                //book id만 추출해서 결과로 설정
                resolve(results.map(book => book.book_id));
            });
        });

        // 관련된 책을 삭제
        for (const book_id of books) {
            await new Promise((resolve, reject) => {
                //책 paragraph삭제
                Book.delete(book_id, (error) => {
                    if (error) return reject(error);
                    resolve();
                });
            });
        }

        // 사용자 삭제
        await new Promise((resolve, reject) => {
            User.delete(id, (error, results) => {
                if (error) return reject(error);
                resolve(results);
            });
        });

        res.status(200).send('User and related books deleted successfully');
    } catch (error) {
        console.error('Error deleting user and related books:', error);
        res.status(500).send('Error deleting user and related books');
    }
});

export default router; // ES 모듈에서 default export
    