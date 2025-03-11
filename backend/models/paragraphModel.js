import connection from '../db.js'; // .js 확장자 명시

// 문단 정보를 삽입하는 함수
const Paragraph = {
  create: (book_id, text, image_path, audio_path, callback) => {
    const query = `
      INSERT INTO paragraph (book_id, text, image_path, audio_path)
      VALUES (?, ?, ?, ?)`;

    connection.query(query, [book_id, text, image_path, audio_path], err => {
      if (err) return callback(err);
      callback(null);
    });
  },

  getParagraphPaths: (book_id, callback) => {
    const query = `
        SELECT audio_path, image_path 
        FROM paragraph 
        WHERE book_id = ?`;

    connection.query(query, [book_id], (err, results) => {
      if (err) return callback(err);
      callback(null, results);
    });
  },

  getParagraphById: (book_id, callback) => {
    const query = `SELECT * FROM paragraph WHERE book_id = ?`;

    connection.query(query, [book_id], (err, results) => {
      if (err) return callback(err);
      callback(null, results);
    });
  },
};

export default Paragraph; // Default export
