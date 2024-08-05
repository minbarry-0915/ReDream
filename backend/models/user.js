import connection from '../db.js'; // .js 확장자 명시
import bcrypt from 'bcryptjs';

const User = {
    // 사용자 생성
    create: (id, username, password, birthdate, callback) => {
        const query = 'INSERT INTO user (id, username, password, birthdate) VALUES (?, ?, ?, ?)';
        connection.query(query, [id, username, password, birthdate], callback);       
    },

    login: (id, password, callback) => {
        const query = 'SELECT * FROM user WHERE id = ?';
        connection.query(query, [id], (error, results) => {
            if (error) {
                return callback(error);
            }

            // id가 db에 없을 때
            if (results.length === 0) {
                return callback(null, false, { message: 'User not found' });
            }

            // 조회된 결과를 user에 저장
            const user = results[0];

            // 입력된 password와 db의 password 비교
            bcrypt.compare(password, user.password, (err, isMatch) => {
                if (err) {
                    return callback(err);
                }
                if (isMatch) {
                    return callback(null, user);
                } else {
                    return callback(null, false, { message: 'Incorrect password' });
                }
            });
        });
    } 
};

export default User; // ES 모듈에서 default export
