import db from '../db.js'; // .js 확장자 명시

// 문단 정보를 삽입하는 함수
const createParagraph = (book_id, text, audio_path, callback) => {
  const paragraphQuery = `
    INSERT INTO Paragraph (book_id, text, audio_path)
    VALUES (?, ?, ?)`;

  db.query(paragraphQuery, [book_id, text, audio_path], (err) => {
    if (err) return callback(err);
    callback(null);
  });
};

export default createParagraph; // Default export
