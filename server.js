const mysql = require('mysql')

const connection = mysql.createConnection({
  host: 'localhost',
  user: 'pagerep',
  password: 'pagerep',
  database: 'page_replacement'
});

// Connect
connection.connect(err => {
  if (err) {
    return console.error('Connection error: ' + err.stack);
  }
  console.log('Connected as ID ' + connection.threadId);
});

// Example query
// connection.query('SELECT * FROM your_table', (err, results) => {
//   if (err) throw err;
//   console.log(results);
// });

// Close the connection
connection.end();