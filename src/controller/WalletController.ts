import { database } from 'firebase-admin';

export class WalletController {
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
   * Get the current address index
   */
  public static async getCurrentIndex(): Promise<number> {
    const ref = this.db.ref('wallet/index');
    const result = await ref.once('value');
    return result.val();
  }

  /**
   * Increment the wallet index and return the previous index
   */
  public static async incrementIndexAndReturnPrevious(): Promise<number> {
    const ref = this.db.ref('wallet/index');
    const result = await ref.transaction(currentIndex => {
      return (currentIndex || 0) + 1;
    });
    return result.snapshot.val();
  }
}
