const loki = require('lokijs')
const lfsa = require(__dirname + '/node_modules/lokijs/src/loki-fs-structured-adapter.js');

const db = new loki(__dirname + '/data/cnote.db', { adapter : new lfsa() });

module.exports = {

  initDB: function() {
    return new Promise(function(resolve, reject) {
      db.loadDatabase({}, function() {
        resolve();
      });
    })
  },

  getCollection: function(name) {
    collection = db.getCollection(name);
    if (!collection) {
      console.log(`Creating collection ${name}`)
      collection = db.addCollection(name);
    }

    return collection;
  },

  save: function() {
    db.saveDatabase();
  }
}
