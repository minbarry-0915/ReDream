import connection from '../db.js';

const Keyword = {
    getKeywordList: (genre_id, callback) => {
        const query = `
            SELECT keyword_id, keyword_name FROM keyword WHERE genre_id = ?
            ORDER BY keyword_id ASC
        `;

        connection.query(query, [genre_id], (err, results) => {
            if (err) {
                return callback(err);
            }
            callback(null, results);
        });
    },
};

export default Keyword;
