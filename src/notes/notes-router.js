const express = require('express');
const path = require('path');
const xss = require('xss');
const NotesService = require('./notes-service.js');

const nRouter = express.Router();
const jsonParser = express.json();

const noteFormat = note => ({
  id: note.id,
  note_title: xss(note.note_title),
  note_content: xss(note.note_content),
  date_modified: note.date_modified,
  folder_id: note.folder_id
});

nRouter.route('/')
  .get((req, res, next) => {
    NotesService.getAllNotes( req.app.get('db') )
    .then(notes => { res.json(notes.map(noteFormat)) })
    .catch(next)
  })
  .post(jsonParser, (req, res, next) => {
    const { note_title, note_content, folder_id } = req.body;
    const newNoteInfo = { note_title, note_content, folder_id };

    if (note_title == null) {
      return res.status(400).json({error: {message: 'Note-title is missing'} });
    }
    NotesService.addNewNote( req.app.get('db'), newNoteInfo)
      .then(note => {
        res.status(201)
        .location(path.posix.join(req.originalUrl +`/${note.id}`))
        .json(noteFormat(note))
      })
      .catch(next)
  })

  nRouter.route('/:note_id')
    .all((req, res, next) => {
      NotesService.getNoteById( req.app.get('db'), req.params.note_id )
        .then(note => {
          if(!note) { return res.status(404).json({error: {message: 'Note does not exist'} }) }
          res.note = note;
          next();
        })
        .catch(next)
    })
    .get((req, res, next) => {
      return res.json(noteFormat(note))
    })
    .delete((req, res, next) => {
      NotesService.deleteNote( req.app.get('db'), req.params.note_id )
      .then(() => { res.status(204).end() })
      .catch(next)
    })
    .patch(jsonParser, (req, res, next) => {
      const { note_title, note_content, folder_id } = req.body;
      const noteToUpdate = { note_title, note_content, folder_id };
      const numberOfValues = Object.values(noteToUpdate).filter(Boolean).length;

      if(numberOfValues == 0) {
        return res.status(400).json({ error: {message: `Update request must include note-title or note-content`} })
      }
      NotesService.updateNote(req.app.patch.get('db'), req.params.note_id, noteToUpdate)
        .then(numRowsAffected => { res.status(204).end() })
        .catch(next)
    })

module.exports = nRouter;