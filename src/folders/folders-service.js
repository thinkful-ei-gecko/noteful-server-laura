const FoldersService = {
  getAllFolders(knex) {
    return knex.select('*').from('noteful_folders')
  },
  addFolder(knex, newFolder) {
    return knex('noteful_folders')
      .insert(newFolder)
      .returning('*')
      .then(rows => rows[0])
  },
  getById(knex, folderId) {
    return knex('noteful_folders')
      .select('*')
      .where('id', folderId)
      .first()
  },
  deleteFolder(knex, folderId) {
    return knex('noteful_folders')
      .where({folderId})
      .delete()
  },
  updateFolder(knex, folderId, newFolderInfo) {
    return knex('noteful_folders')
      .where({folderId})
      .update(newFolderInfo)
  }
}

module.exports = FoldersService;