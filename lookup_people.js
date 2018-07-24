const pg = require("pg");
const settings = require("./settings"); // settings.json

const client = new pg.Client({
  user     : settings.user,
  password : settings.password,
  database : settings.database,
  host     : settings.hostname,
  port     : settings.port,
  ssl      : settings.ssl
});

// User input
const userQuery = process.argv[2];

// Database access function
function dbLookup(getInput, cb) {
  console.log('Searching...');
  const name = getInput();
  client.connect((err) => {
    if (err) {
      return console.error("Connection Error", err);
    }
    client.query("SELECT first_name, last_name, TO_CHAR(birthdate, 'yyyy-mm-dd') AS birthdate, ROW_NUMBER () OVER (ORDER BY first_name) FROM famous_people WHERE first_name LIKE $1::text", [name], (err, result) => {
      if (err) {
        return console.error("error running query", err);
      }
      cb(result.rows, name);
      client.end();
    });
  });
}

function getUserInput() {
  return userQuery;
}

// Input and output function
function logResult(result, query) {
   console.log(`Found ${result.length} person(s) with the name '${query}'`);
   result.forEach(person => {
     console.log(`${person.row_number}: ${person.first_name} ${person.last_name}, born ${person.birthdate}`);
   });
}

dbLookup(getUserInput, logResult);
