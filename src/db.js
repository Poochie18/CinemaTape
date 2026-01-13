import Dexie from 'dexie';

export class CinemaDatabase extends Dexie {
  constructor() {
    super('CinemaTapeDB');
    
    // Version 1: Initial schema with only watchedFilms
    this.version(1).stores({
      watchedFilms: '++id, title, watchDate, rating'
    });

    // Version 2: Added watchLater table
    this.version(2).stores({
      watchedFilms: '++id, title, watchDate, rating',
      watchLater: '++id, title, addedDate, rating'
    });

    this.watchedFilms = this.table('watchedFilms');
    this.watchLater = this.table('watchLater');
  }
}

export const db = new CinemaDatabase();
