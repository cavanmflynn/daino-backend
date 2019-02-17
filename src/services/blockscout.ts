import fetch from 'node-fetch';

export class Blockscout {
  private static readonly _apiBase = 'https://blockscout.com/poa/dai/api';

  /**
   * Get balances for ther passed addresses
   * @param delimitedAddresses A string of addresses delimited by commas
   */
  public static async getBalances(delimitedAddresses: string) {
    try {
      const result = await fetch(
        `${
          this._apiBase
        }?module=account&action=balancemulti&address=${delimitedAddresses}`,
        {
          method: 'get',
        },
      );
      return (await result.json()).result;
    } catch (error) {
      return [];
    }
  }
}
