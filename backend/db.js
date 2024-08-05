import mysql from 'mysql2';

const connection = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: '1234',
    database: 'redream'
});

connection.connect(error => {
    if (error) {
        console.error('Database connection failed: ', error);
        return;
    }
    console.log('Connection Success');
});

export default connection; // ES 모듈에서 default export
