const NotesService = {
  getAllNotes(knex) {
    return knex('noteful_notes')
      .select('*')
  },
  addNewNote(knex, newNote) {
    return knex('noteful_notes')
      .insert(newNote)
      .returning('*')
      .then(rows => rows[0])
  },
  getNoteById(knex, noteId) {
    return knex('noteful_notes')
      .select('*')
      .where('id', noteId)
      .first()
  },
  deleteNote(knex, noteId) {
    return knex('noteful_notes')
      .where('id', noteId)
      .delete()
  },
  updateNote(knex, noteId, newNoteData) {
    return knex('noteful_notes')
      .where('id', noteId)
      .update(newNoteData)
  }
}

module.exports = NotesService;