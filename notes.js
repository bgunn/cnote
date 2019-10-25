const db = require('./database');
const marked = require('marked');
const TerminalRenderer = require('marked-terminal');
const term = require( 'terminal-kit' ).terminal ;
const chalk = require('chalk');

marked.setOptions({
  // Define custom renderer
  renderer: new TerminalRenderer()
});

function getCollection() {
  return db.getCollection('notes');
}

/**
 * Add a note
 * @param {string} note - The note to add
 * @param {Array} addTags - Tags to add to the note
 * @returns {Note}
 */
const add = (note, tags=[]) => {
  getCollection().insert({
    note: note,
    tags: tags
  });
  db.save();
};

/**
 * Add or edit a note in terminal mode
 * @param {integer} id - The note ID to edit
 * @returns {Note}
 */
const edit = (id) => {
  if (id) {
    // foo
  }

  let editString = '';

  const terminate = function(error , input) {
  	term.grabInput( false );
    //console.log(editString);
    console.log('Your input was:\n\n' + input)
  	setTimeout( function() { process.exit() } , 100 ) ;
  }

  term( 'Enter your note:\n\n') ;

  keyBindings = {
  	ENTER: 'newLine',
  	KP_ENTER: 'newLine',
    CTRL_D: 'submit'
  }

  term.inputField({ keyBindings: keyBindings }, terminate);

  /*
  term.bold.cyan( 'Type anything on the keyboard...\n' ) ;
  term.green( 'Hit CTRL-C to quit.\n\n' ) ;

  term.grabInput( { mouse: 'button' } ) ;

  term.on( 'key' , function( name , matches , data ) {
    if ( name === 'CTRL_D' ) { terminate() ; }
    if ( name === 'ENTER' ) {
      editString += '\n';
    } else {
      editString += name;
    }

    console.log(editString);
  } ) ;

  term.on( 'terminal' , function( name , data ) {
  	console.log( "'terminal' event:" , name , data ) ;
  } ) ;

  term.on( 'mouse' , function( name , data ) {
  	console.log( "'mouse' event:" , name , data ) ;
  } ) ;
  */
};

/**
 * Update a note
 * @param {integer} id - The note ID
 * @param {string} note - The updated note
 * @param {Array} addTags - Tags to add to the note
 * @param {Array} delTags - Tags to remove from the note
 * @returns {Note}
 */
const update = (id, note, addTags=[], delTags=[]) => {
  let col = getCollection();
  let obj = col.get(id);

  if (note) {
    obj.note = note;
  }

  // Add the specified tags if any
  if (addTags.length) {
    obj.tags = obj.tags.concat(addTags.filter(function (item) {
        return obj.tags.indexOf(item) < 0;
    }));
  }

  // Delete the specified tags if any
  if (delTags.length) {
    let t = obj.tags;
    delTags.forEach(function(item) {
      if (t.includes(item)) {
        t.splice(t.indexOf(item), 1);
      }
    });
    obj.tags = t;
  }

  col.update(obj);
  db.save();

  return obj;
};

/**
 * Delete a note
 * @param {integer} id - The note ID
 */
const remove = (id) => {
  let col = getCollection();
  let obj = col.get(id);
  col.remove(obj);
  db.save();
};

/**
 * Read a note
 * @param {integer} id - The note ID
 */
const read = (id) => {

  let note = getCollection().get(id);

  let markdown = '';

  if (note) {
    markdown = note.note.replace("\\n", "\n") + ' \n';
    if (note.tags) {
      //markdown +=
      markdown += ' \n`Tags:` ' + `${note.tags.join(', ')}`;
    } else {
      markdown = `Note ID ${id} not found`
    }

    console.log(marked(markdown));
  }
};

/**
 * Get notes
 * @param {Array} tags - The tags to filter on
 * @returns {Collection}
 */
const get = (keyword, tags=[], limit=50, page=1) => {

  let col = getCollection();

  let offset = limit * (page - 1);
  let getter = col.chain()
  let query = {};

  if (keyword) {
    query['note'] = { '$contains' : keyword };
  }

  if (tags.length) {
    query['tags'] = { '$contains' : tags };
  }

  if (Object.keys(query).length >=1) {
    getter = getter.find(query);
  }

  let count = getter.count();

  let docs = getter.offset(offset).limit(limit).data();

  return {
    count: count,
    limit: limit,
    page: page,
    documents: docs
  }
}

const list = (keyword, tags=[], limit, page) => {

  let markdown = '# Notes \n';

  if (tags.length) {
    let tstring = tags.join(', ');
    markdown += '`Tags:` ' + `${tstring} \n`;
  }

  notes = get(keyword, tags, limit, page);

  notes.documents.forEach(function(n) {

    // Build tags string
    let t = '';
    if (n.tags.length) {
      t = '`[' + n.tags.sort().join(', ') + ']` ';
    }

    let line = `- **${n.$loki}:** ${n.note}`;

    if (line.length > 80) {
      line = line.substring(0, 80) + ' ...';
    } else {
      line = line.padEnd(84)
    }

    line += ` ${t} \n`;

    markdown += line;
  });

  if (notes.count > notes.limit) {
    let pages = Math.ceil(notes.count / notes.limit);
    markdown += ` \n\n## Page ${notes.page} of ${pages}`
  }

  console.log(marked(markdown));
}

// Export all methods
module.exports = { add, edit, update, remove, read, list };
