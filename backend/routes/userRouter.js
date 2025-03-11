import express from 'express';
import User from '../models/userModel.js'; // .js 확장자 명시
import Book from '../models/bookModel.js';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken'; // JWT 라이브러리 사용
import dotenv from 'dotenv';

dotenv.config();

const secretKey = process.env.JWT_SECRET_KEY;
const router = express.Router();

// Middleware to check for JWT token
const authenticateToken = (req, res, next) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];

  if (token == null) return res.sendStatus(401); // Token not found

  jwt.verify(token, secretKey, (err, user) => {
    if (err) return res.sendStatus(403); // Token invalid or expired
    req.user = user;
    next();
  });
};

router.post('/user/register', (req, res) => {
  const {id, username, password, birthdate} = req.body;

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
  const {id, password} = req.body;

  if (!id || !password) {
    return res.status(400).send('ID and password are required');
  }

  User.login(id, password, (error, user, info) => {
    if (error) {
      return res.status(500).send('Error logging in');
    }
    if (!user) {
      return res.status(401).send(info.message);
    }

    // 로그인 성공 -> JWT 토큰 생성
    const token = jwt.sign(
      {userId: user.id, username: user.username}, // 토큰에 포함할 정보 (userId, username 등)
      secretKey, // 비밀키
      {expiresIn: '1h'}, // 토큰 만료 시간 설정
    );

    // 사용자 정보와 토큰을 JSON으로 응답
    res.status(200).json({
      user: {
        id: user.id,
        username: user.username,
        // 다른 사용자 정보가 필요하면 추가 가능
      },
      token, // 클라이언트가 사용할 토큰
    });
  });
});

router.delete('/user/delete/:id', authenticateToken, async (req, res) => {
  const {id} = req.params;

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
        Book.delete(book_id, error => {
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
