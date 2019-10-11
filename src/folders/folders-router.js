const express = require('express');
const path = require('path');
const xss = require('xss');
const FoldersService = require('./folders-service.js');

const nRouter = express.Router();
const jsonParser = express.json();

const folderFormat = folder => ({
  id: folder.id,
  folder_title: xss(folder.folder_title)
});

fRouter.route('/')
  .get((req, res, next) => {
    FoldersService.getAllFolders( req.app.get('db') )
    .then(folders => { res.json(folders.map(folderFormat)) })
    .catch(next)
  })
  .post(jsonParser, (req, res, next) => {
    const { folder_title } = req.body;
    const newFolderName = folder_title;

    if (folder_title == null) {
      return res.status(400).json({error: {message: 'Folder-title is missing'} });
    }
    FoldersService.addNewFolder( req.app.get('db'), newFolderName)
      .then(folder => {
        res.status(201)
        .location(path.posix.join(req.originalUrl +`/${folder.id}`))
        .json(folderFormat(folder))
      })
      .catch(next)
  })

  fRouter.route('/:folder_id')
    .all((req, res, next) => {
      FoldersService.getFolderById( req.app.get('db'), req.params.folder_id )
        .then(folder => {
          if(!folder) { return res.status(404).json({error: {message: 'Folder does not exist'} }) }
          res.folder = folder;
          next();
        })
        .catch(next)
    })
    .get((req, res, next) => {
      return res.json(folderFormat(folder))
    })
    .delete((req, res, next) => {
      FoldersService.deleteFolder( req.app.get('db'), req.params.folder_id )
      .then(() => { res.status(204).end() })
      .catch(next)
    })
    .patch(jsonParser, (req, res, next) => {
      const { folder_title } = req.body;
      const folderToUpdate = folder_title;

      if(folder_title == 0) {
        return res.status(400).json({ error: {message: `Update request must include folder-title`} })
      }
      FoldersService.updateFolder(req.app.patch.get('db'), req.params.folder_id, folderToUpdate)
        .then(numRowsAffected => { res.status(204).end() })
        .catch(next)
    })

module.exports = fRouter;