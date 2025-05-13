import mysql from 'mysql2/promise';

export class Database {
  connection = null;

  maxRecents = 5;

  constructor() {
    this.connect()
      .then(() => {
        console.log('Database connected');

        this.initializeTables();
      })
      .catch((error) => {
        console.error('Error connecting to database: ' + error.stack);
      });
  }

  async connect() {
    this.connection = await mysql.createConnection({
      host: 'localhost',
      user: 'pagerep',
      password: 'pagerep',
      database: 'page_replacement'
    });

    console.log('Connected as ID ' + this.connection.threadId);
  }


  async initializeTables() {
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

    try {
      await this.connection.query(bookTableStatement);
      console.log('Books table initialized');

      await this.connection.query(recentsTableStatement);
      console.log('Recents table initialized');
    } catch (error) {
      console.error('Error creating tables: ' + error.stack);
    }
  }

  async getBooks() {
    try {
      let [books] = await this.connection.query('SELECT * FROM books');

      return books;
    } catch (error) {
      console.error('Error fetching books: ' + error.stack);
      return [];
    }
  }

  async getRecents() {
    const recentsQuery = `
        SELECT
          books.id,
          books.title,
          books.url,
          recents.age
        FROM books
        JOIN recents
          ON books.id = recents.id
        ORDER BY recents.age ASC
      `;

    try {
      let [recents] = await this.connection.query(recentsQuery);

      return recents;
    }
    catch (error) {
      console.error('Error fetching recents: ' + error.stack);
      return [];
    }
  }

  async markAsRecent(id) {
    const checkIfExists = `
        SELECT COUNT(*) AS count
        FROM recents
        WHERE id = ?
      `;
    
    const renewListing = `
        UPDATE recents
        SET age = 0
        WHERE id = ?
    `;

    const addToRecents = `
        INSERT INTO recents (id)
        VALUES (?)
      `;

    const updateAges = `
        UPDATE recents
        SET age = age + 1
      `;

    const checkCount = `
        SELECT COUNT(*) AS count
        FROM recents
      `;
    
    const getOldest = `
        SELECT id
        FROM recents
        ORDER BY age DESC
        LIMIT 1
      `;

    const removeOldest = `
        DELETE FROM recents
        WHERE id = ?
      `;

    /*
      Outline:
        - Check if in recents, if is, exit
        - Check if full, if is, remove oldest
        - Add to recents
        - Increment ages
    */
    
    try {
      const [checkResult] = await this.connection.execute(checkIfExists, [id]);
      console.log('Check result:', checkResult[0].count);

      if (checkResult[0].count > 0) {
        await this.connection.execute(renewListing, [id]);

        console.log('Already in recents, renewing listing');
      } else {
        const [countResult] = await this.connection.query(checkCount);


        console.log('Count result:', countResult[0].count);

        if (countResult[0].count >= this.maxRecents) {
          const [oldestResult] = await this.connection.query(getOldest);
          const oldestId = oldestResult[0].id;

          await this.connection.execute(removeOldest, [oldestId]);
          console.log(`Removed oldest entry with id "${oldestId}" from recents`);
        }

        await this.connection.query(addToRecents, [id]);
        console.log(`Added id "${id}" to recents`);
      }

      await this.connection.query(updateAges);
      console.log('Incremented ages of recents');
    } catch (error) {
      console.error('Error marking as recent: ' + error.stack);
    }
  }
}

