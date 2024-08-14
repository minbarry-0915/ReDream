import connection from '../db.js';

const Genre = {
    getGenreList: (callback) => {
        const query = `
            SELECT * FROM genre
            ORDER BY genre_id ASC
        `;

        connection.query(query, (err, results) => {
            if (err) {
                return callback(err);
            }
            callback(null, results);
        });
    },
};

export default Genre;
