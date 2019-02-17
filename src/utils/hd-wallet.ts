import * as ethers from 'ethers';
import { JsonRpcProvider } from 'ethers/providers';
import { config } from '../config';

export class HdWallet {
  private static _provider: JsonRpcProvider;

  /**
   * Get the address at a specified index
   * @param index The address index
   */
  public static getAddressAtIndex(index: number) {
    if (!this._provider) {
      this._provider = new ethers.providers.JsonRpcProvider(
        config.rpcProvider(),
      );
    }

    const seed = ethers.utils.HDNode.fromMnemonic(
      config.walletSeed(),
    ).derivePath(`m/44'/60'/0'/0/${index}`);
    const wallet = new ethers.Wallet(seed.privateKey, this._provider);
    return wallet.address;
  }
}
