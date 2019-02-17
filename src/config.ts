import NodeConfig from 'config';
import { env } from 'process';

export const config = {
  /**
   * Retrieve the config value using the key for the active environment
   * @param key The config key
   */
  value<T = string>(key: string): T | string {
    const value = NodeConfig.has(key) ? NodeConfig.get<T>(key) : env[key];
    if (value) {
      return value as T;
    }
    throw new Error(`Environment variable not found: ${key}`);
  },

  /**
   * The port of the local server
   */
  serverPort(): string {
    return config.value('server_port');
  },

  /**
   * Github oauth config params
   */
  github(): { id: string; secret: string } {
    return {
      id: config.value('github.client_id'),
      secret: config.value('github.client_secret'),
    };
  },

  /**
   * Twitter oauth config params
   */
  twitter(): {
    clientId: string;
    clientSecret: string;
    botId: string;
    botSecret: string;
  } {
    return {
      clientId: config.value('twitter.client_id'),
      clientSecret: config.value('twitter.client_secret'),
      botId: config.value('twitter.bot_access_token_id'),
      botSecret: config.value('twitter.bot_access_token_secret'),
    };
  },

  /**
   * Get the server wallet seed phrase
   */
  walletSeed(): string {
    return config.value('wallet_seed');
  },

  /**
   * The rpc provider url
   */
  rpcProvider(): string {
    return config.value('rpc_provider');
  },

  /**
   * The chain watcher poll interval
   */
  chainWatcherIntervalMs(): number {
    return Number(config.value('chain_watcher_interval_ms'));
  },
};
