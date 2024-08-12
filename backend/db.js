import mysql from 'mysql2';
import dotenv from 'dotenv';

dotenv.config();


const connection = mysql.createConnection({
    host: process.env.MYSQL_HOST,
    user: process.env.MYSQL_USER,
    password: process.env.MYSQL_PASSWORD,
    database: process.env.MYSQL_DATABASE_NAME
});

connection.connect(error => {
    if (error) {
        console.error('Database connection failed: ', error);
        return;
    }
    console.log('Connection Success');
});

export default connection; // ES 모듈에서 default export
