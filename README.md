# cnote
A command line note taking application

## Install
yarn install
ln -s cnote.js /usr/local/bin/cnote

## Usage
### Add a note
Add a note applying some markdown and tagging the note as personal and todo
`cnote add "This is **my** first note. Be sure to delete it!" -t personal,todo`

### List notes
List all notes
`cnote list`

List notes with tag todo
`cnote list -t todo`

### Read a note
`cnote read <id>`

### Delete a note
`cnote delete <id>`
