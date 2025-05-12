import mysql from 'mysql';

export class Database {
  connection = null;

  constructor() {
    this.connection = mysql.createConnection({
      host: 'localhost',
      user: 'pagerep',
      password: 'pagerep',
      database: 'page_replacement'
    });

    this.connection.connect(err => {
      if (err) {
        return console.error('Connection error: ' + err.stack);
      }

      console.log('Connected as ID ' + this.connection.threadId);
      this.initializeTables();
    });
  }

  initializeTables() {
    const bookTableStatement = `
      CREATE TABLE IF NOT EXISTS books (
        id INT AUTO_INCREMENT PRIMARY KEY,
        title VARCHAR(255) NOT NULL,
        url VARCHAR(255) NOT NULL
      );`;

    const recentsTableStatement = `
      CREATE TABLE IF NOT EXISTS recents (
        id INT NOT NULL,
        age INT DEFAULT 0,
        FOREIGN KEY (id) REFERENCES books(id)
      );`;

    this.connection.query(bookTableStatement, (error, results) => {
      if (error) {
        console.error('Error creating table: ' + error.stack);
      } else {
        console.log('Books table initialized');
      }
    });

    this.connection.query(recentsTableStatement, (error, results) => {
      if (error) {
        console.error('Error creating table: ' + error.stack);
      } else {
        console.log('Recents table initialized');
      }
    });
  }

    getBooks() {
      return new Promise((resolve, reject) => {
        this.connection.query('SELECT * FROM books', (error, results) => {
          if (error) {
            return reject(error);
          }
          resolve(results);
        });
      });
    }

    getRecents() {
      const recentsQuery = `
        SELECT
          books.id,
          books.title,
          books.url,
          recents.age
        FROM books
        JOIN recents
          ON books.id = recents.id
      `;
    
    
      return new Promise((resolve, reject) => {
        this.connection.query(recentsQuery, (error, results) => {
          if (error) {
            return reject(error);
          }
          resolve(results);
        });
      });
    }
}

