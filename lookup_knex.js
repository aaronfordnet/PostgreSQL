const knexConfig = require('./knexfile');
const env = 'development';
const knex = require('knex')(knexConfig[env]);

// const settings = require("./settings"); // settings.json
//
// const knex = require('knex')({
//   client: 'pg',
//   connection: {
//     host     : settings.hostname,
//     user     : settings.user,
//     password : settings.password,
//     database : settings.database,
//     port     : settings.port,
//     ssl      : settings.ssl
//   }
// });

// User input
const userQuery = process.argv[2];

function getInput() {
  return userQuery;
}

function postOutput(result, query) {
  let counter = 1;
  console.log(`Found ${result.length} person(s) with the name '${query}'`);
  result.forEach(person => {
   console.log(`${counter}: ${person.first_name} ${person.last_name}, born ${person.birthdate}`);
   counter++;
  });
}

function queryDatabase(getInput, postOutput) {
  console.log('Searching...');
  const name = getInput();

  knex('famous_people')
    .select('first_name', 'last_name', 'birthdate')
    .select(knex.raw("TO_CHAR(birthdate, 'yyyy-mm-dd') AS birthdate"))
    .where('first_name', name)
    .asCallback((err, rows) => {
    if (err) {
      console.error(err);
      return false;
    }
    postOutput(rows, name);
    }).finally(() => {
      knex.destroy();
    });
}

queryDatabase(getInput, postOutput);
