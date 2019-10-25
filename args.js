const program = require('commander');
const notes = require('./notes');

function list(val) {
  return val.split(',');
}

program
  .version('0.0.1', '-v, --version')
  .description('A command line note application');

  //.option('-l, --list', 'List notes')
  //.option('-d, --delete <id>', 'Delete a note by ID')

program
  .command('add <note>')
  .alias('a')
  .description('Add a note')
  .option('-t, --tags <tags>', 'A comma delimited list of tags to add to the note', list)
  .action((note, options) => {
    notes.add(note, options.tags);
  });

  program
    .command('edit [id]')
    .alias('e')
    .description('Add or edit a note in terminal mode')
    .action((id) => {
      notes.edit(id);
    });

program
  .command('update <id>')
  .alias('u')
  .description('Update a note')
  .option('-n, --note <note>', 'The updated note')
  .option('-t, --tags <tags>', 'A comma delimited list of tags to add to the note', list)
  .option('-d, --delete-tags <tags>', 'A comma delimited list of tags to remove from the note', list)
  .action((id, options) => {
    notes.update(id, options.note, options.tags, options.deleteTags);
  });

program
  .command('delete <id>')
  .alias('d')
  .description('Delete a note')
  .action((id) => {
    notes.remove(id);
  });

program
  .command('archive <id>')
  .alias('v')
  .description('Archive a note hiding it from list view')
  .action((id) => {
    notes.archive(id);
  });

program
  .command('read <id>')
  .alias('r')
  .description('Read a note')
  .action((id) => {
    notes.read(id);
  });

program
  .command('list [keyword]')
  .alias('l')
  .description('List notes searching on an optional keyword')
  .option('-t, --tags <tags>', 'A comma delimited list of tags to filter on', list)
  .option('-l, --limit <limit>', 'Limit number of results returned. Default 50.')
  .option('-p, --page <page>', 'Display results from the specified page number.')
  .action((keyword, options) => {
    notes.list(keyword, options.tags, options.limit, options.page)
  });

module.exports = {

  parse: function(collection) {
    program.parse(process.argv)
    if (!program.args.length) program.help();
  }
}
