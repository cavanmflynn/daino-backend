import { database } from 'firebase-admin';
import { User, Website } from '../types';

export class UserController {
  private static _db: database.Database;

  /**
   * The firebase db instance
   */
  private static get db() {
    if (!this._db) {
      this._db = database();
    }
    return this._db;
  }

  /**
   * Attempt to get a user record
   */
  public static async get(website: Website, username: string): Promise<User> {
    const ref = this.db.ref(`websites/${website}/users/${username}`);
    const user = await ref.once('value');
    return user.val();
  }

  /**
   * Get all user records for a specific website
   */
  public static async getAllOnWebsite(website: Website): Promise<any> {
    const ref = this.db.ref(`websites/${website}/users`);
    const userValues: User[] = [];
    const users = await ref.once('value', snapshot => {
      const users = [];
      snapshot.forEach(childSnapshot => {
        userValues.push(childSnapshot.val());
      });
      return users;
    });
    return userValues;
  }

  /**
   * Insert a new user record
   */
  public static async set(
    website: Website,
    username: string,
    newUser: User,
  ): Promise<void> {
    const ref = this.db.ref(`websites/${website}/users/${username}`);
    await ref.set(newUser);
  }

  /**
   * Update an existing user record
   */
  public static async update(
    website: Website,
    username: string,
    user: User,
  ): Promise<void> {
    const ref = this.db.ref(`websites/${website}/users/${username}`);
    await ref.update(user);
  }

  /**
   * Attempt to find a user in the database, insert a new one if not found
   */
  public static async findOrCreate(
    website: Website,
    username: string,
    newUser: User,
  ): Promise<User> {
    const ref = this.db.ref(`websites/${website}/users/${username}`);
    const result = await ref.transaction(currentUser => {
      if (!currentUser) {
        return newUser;
      }
    });
    return result.snapshot.val();
  }
}
