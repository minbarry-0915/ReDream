import connection from '../db.js'; // .js 확장자 명시


const Book = {
    create: (user_id, title, genre, keyword, description, cover_image_path, callback) => {
        const query = `
            INSERT INTO book (user_id, title, genre, keyword, description,  cover_image_path, create_at) 
            VALUES (?, ?, ?, ?, ?, ?, NOW())`;
        connection.query(query, [user_id, title, genre, keyword, description,cover_image_path], (err, res) => {
            if (err) return callback(err);
            callback(null, res.insertId);
        });    
    },

    view: (user_id, callback) => {
        const query = `
            SELECT * FROM book 
            WHERE user_id = ? 
            ORDER BY create_at DESC`;  // 책들을 최신순으로 정렬
        connection.query(query, [user_id], (err, results) => {
            if (err) return callback(err);
            callback(null, results);
        });
    },

    delete: async (book_id, callback) => {
        try {
            // 트랜잭션 시작
            await new Promise((resolve, reject) => {
                connection.beginTransaction((err) => {
                    if (err) reject(err);
                    else resolve();
                });
            });
    
            // 책이 존재하는지 확인
            const exists = await new Promise((resolve, reject) => {
                const query = 'SELECT COUNT(*) AS count FROM book WHERE book_id = ?';
                connection.query(query, [book_id], (err, results) => {
                    if (err) return reject(err);
                    resolve(results[0].count > 0);
                });
            });
    
            if (!exists) {
                // 책이 존재하지 않으면 트랜잭션을 롤백하고 에러 반환
                await new Promise((resolve, reject) => {
                    connection.rollback(() => {
                        reject(new Error('Book does not exist'));
                    });
                });
                return;
            }
    
            // `paragraph` 테이블에서 해당 `book_id` 삭제
            await new Promise((resolve, reject) => {
                const query = 'DELETE FROM paragraph WHERE book_id = ?';
                connection.query(query, [book_id], (err) => {
                    if (err) {
                        connection.rollback(() => {
                            reject(err);
                        });
                    } else {
                        resolve();
                    }
                });
            });
    
            // `book` 테이블에서 해당 `book_id` 삭제
            await new Promise((resolve, reject) => {
                const query = 'DELETE FROM book WHERE book_id = ?';
                connection.query(query, [book_id], (err) => {
                    if (err) {
                        connection.rollback(() => {
                            reject(err);
                        });
                    } else {
                        resolve();
                    }
                });
            });
    
            // 트랜잭션 커밋
            await new Promise((resolve, reject) => {
                connection.commit((err) => {
                    if (err) {
                        connection.rollback(() => {
                            reject(err);
                        });
                    } else {
                        resolve();
                    }
                });
            });
    
            // 성공 시 콜백 호출
            callback(null);
    
        } catch (error) {
            console.error('Transaction error while deleting book', error);
            callback(error);
        }
    },
    
  
    getBookById: (book_id, callback) => {
        const query = `SELECT * FROM book WHERE book_id = ?`;

        connection.query(query, [book_id], (err, results) => {
             if (err) return callback(err);
            callback(null, results);
        });
    }
};


export default Book; // Default export
