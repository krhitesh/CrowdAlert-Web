/* eslint-disable import/no-mutable-exports */
/* Using PouchDB APIs to access IndexedDB for storing incidents for quick load times. */
import PouchDB from 'pouchdb-browser';
import PouchDBFind from 'pouchdb-find';

PouchDB.plugin(PouchDBFind);

/**
 * [Creates/Opens a named pouch DB instance]
 */
let db = null;
if (process.env.BROWSER) {
  db = new PouchDB('crowdalert-4fa46');
  db.createIndex({
    index: {
      fields: ['_id'],
    },
  });
}
export default db;
