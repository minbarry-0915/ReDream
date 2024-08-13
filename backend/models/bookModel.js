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

    delete: async(book_id, callback) => {
        try {
            await new Promise((resolve, reject) =>{
                //데이터 atomicity 보존을 위해 트랜잭션 설정
                connection.beginTransaction((err) => {
                    if(err) reject(err);
                    else resolve();
                });
            });

            await new Promise((resolve, reject) => {
                const query = 'DELETE FROM paragraph WHERE book_id = ?';
                connection.query(query, [book_id],(err) =>{
                    if (err){
                        connection.rollback(()=>{
                            reject(err);
                        });
                    } else{
                        resolve();
                    }
                });
            });

            await new Promise((resolve, reject) =>{
                const query = 'DELETE FROM book WHERE book_id = ?';
                connection.query(query, [book_id], (err) => {
                    if (err){
                        connection.rollback(()=>{
                            reject(err);
                        });
                    }else{
                        resolve();
                    }
                })
            })

            await new Promise((resolve, reject) => {
                // 커밋 트랜잭션
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
    
            // 콜백 함수 호출 성공시
            callback(null);


        }catch(error){
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
