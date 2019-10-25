#!/usr/bin/env node

const db = require(__dirname + '/database');
const args = require(__dirname + '/args')

/**
 * Initialize the database and parse command line arguments
 */
db.initDB().then(function() {
  args.parse();
}).catch(function(err) {
  console.error(err);
});
