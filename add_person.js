const settings = require("./settings"); // settings.json

const knex = require('knex')({
  client: 'pg',
  connection: {
    host     : settings.hostname,
    user     : settings.user,
    password : settings.password,
    database : settings.database,
    port     : settings.port,
    ssl      : settings.ssl
  }
});

firstName = process.argv[2];
lastName = process.argv[3];
birthDate = process.argv[4];

knex.insert({first_name: firstName, last_name: lastName, birthdate: birthDate}).into('famous_people').finally(() => {
  knex.destroy();
})
