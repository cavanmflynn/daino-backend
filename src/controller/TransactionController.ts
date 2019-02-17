import { database } from 'firebase-admin';
import uuidv4 from 'uuid/v4';
import { Transaction, User, Website } from '../types';

export class TransactionController {
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
   * Get all transactions for a specific user
   */
  public static async getAll(
    website: Website,
    username: string,
  ): Promise<User> {
    const ref = this.db.ref(
      `websites/${website}/users/${username}/transactions`,
    );
    const user = await ref.once('value');
    return user.val();
  }

  /**
   * Insert a new transaction record
   */
  public static async set(
    website: Website,
    username: string,
    newTransaction: Transaction,
  ): Promise<void> {
    const ref = this.db.ref(
      `websites/${website}/users/${username}/transactions/${uuidv4()}`,
    );
    await ref.set(newTransaction);
  }
}
