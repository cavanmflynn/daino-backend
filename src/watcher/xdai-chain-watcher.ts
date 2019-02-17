import Big from 'big.js';
import TwitterSDK from 'twitter';
import { config } from '../config';
import {
  TransactionController as Transaction,
  UserController as User,
  WalletController as Wallet,
} from '../controller';
import { Blockscout, Twitter } from '../services';
import { Website } from '../types';
import { HdWallet } from '../utils';

export class XDaiChainWatcher {
  private static _twitterClient: TwitterSDK;

  public static init() {
    setInterval(this.compareBalances, config.chainWatcherIntervalMs());

    // Initial call
    this.compareBalances();
  }

  /**
   * Compare balances of addresses and update accordingly
   */
  private static async compareBalances() {
    const currentWalletIndex = await Wallet.getCurrentIndex();

    let addressCount = 0;
    let addressList: string = '';
    const addressLists: string[] = [];

    // Chunk user addresses so each call contains 20 max
    for (let i = 0; i <= currentWalletIndex; i++) {
      const address = HdWallet.getAddressAtIndex(i);
      addressList += `${address},`;

      addressCount++;

      if (addressCount >= 20) {
        addressLists.push(addressList.substring(0, addressList.length - 1));
        addressList = '';
        addressCount = 0;
      }
    }

    if (addressList) {
      addressLists.push(addressList.substring(0, addressList.length - 1));
    }

    // Get balances for all addresses
    const balanceResultArrays = await Promise.all(
      addressLists.map(l => {
        return Blockscout.getBalances(l);
      }),
    );

    // Map result arrays to obect for easier comparison
    const balanceResults: { [address: string]: number } = {};
    balanceResultArrays.filter(Boolean).forEach(arr => {
      arr.forEach(result => {
        balanceResults[result.account.toLowerCase()] = Number(
          new Big(result.balance).div(10e18),
        );
      });
    });

    const twitterUsers = await User.getAllOnWebsite(Website.TWITTER);

    for (const user of twitterUsers) {
      // Convert to lowercase for matching
      user.address = user.address.toLowerCase();

      let shouldUpdateBalance = false;
      if (balanceResults[user.address] > user.balance) {
        // User had incoming transaction
        shouldUpdateBalance = true;
        Transaction.set(Website.TWITTER, user.username, {
          dateString: new Date(Date.now()).toISOString(),
          amount: balanceResults[user.address] - user.balance,
          inbound: true,
        });
        if (!user.hasLoggedIn) {
          const { botId, botSecret } = config.twitter();
          Twitter.client(botId, botSecret).post(
            'statuses/update',
            {
              status: `@${
                user.username
              } You've received a tip on Daino! Claim your funds once we host this app :)`,
            },
            (error, tweet, response) => {
              if (error) throw error;
              console.log(tweet); // Tweet body.
              console.log(response); // Raw response object.
            },
          );
        }
      } else if (balanceResults[user.address] < user.balance) {
        // User cashed out and balance was not updated (precautionary)
        shouldUpdateBalance = true;
        Transaction.set(Website.TWITTER, user.username, {
          dateString: new Date(Date.now()).toISOString(),
          amount: user.balance - balanceResults[user.address],
          inbound: false,
        });
      }

      if (shouldUpdateBalance) {
        const updatedUser = {
          ...user,
          balance: balanceResults[user.address],
        };
        User.update(Website.TWITTER, user.username, updatedUser);
      }
    }

    const githubUsers = await User.getAllOnWebsite(Website.GITHUB);

    for (const user of githubUsers) {
      // Convert to lowercase for matching
      if (user.address) {
        user.address = user.address.toLowerCase();
      }

      let shouldUpdateBalance = false;
      if (balanceResults[user.address] > user.balance) {
        // User had incoming transaction
        shouldUpdateBalance = true;
        Transaction.set(Website.GITHUB, user.username, {
          dateString: new Date(Date.now()).toISOString(),
          amount: balanceResults[user.address] - user.balance,
          inbound: true,
        });
      } else if (balanceResults[user.address] < user.balance) {
        // User cashed out and balance was not updated (precautionary)
        shouldUpdateBalance = true;
        Transaction.set(Website.GITHUB, user.username, {
          dateString: new Date(Date.now()).toISOString(),
          amount: user.balance - balanceResults[user.address],
          inbound: false,
        });
      }

      if (shouldUpdateBalance) {
        const updatedUser = {
          ...user,
          balance: balanceResults[user.address],
        };
        User.update(Website.GITHUB, user.username, updatedUser);
      }
    }
  }
}
