import db from '../db.js'; // .js 확장자 명시

const createBook = (user_id, title, genre, keyword, description, callback) => {
    const bookQuery = `
        INSERT INTO book (user_id, title, genre, keyword, description, create_at) 
        VALUES (?, ?, ?, ?, ?, NOW())`;

    db.query(bookQuery, [user_id, title, genre, keyword, description], (err, res) => {
        if (err) return callback(err);
        callback(null, res.insertId);
    });
};

export default createBook; // Default export
