import TwitterSDK from 'twitter';
import { config } from '../config';

export class Twitter {
  /**
   * Get a new twitter client instance for a specific user
   * @param tokenKey The oauth token key
   * @param tokenSecret The oauth token secret
   */
  public static client(tokenKey: string, tokenSecret: string) {
    const { clientId, clientSecret } = config.twitter();
    return new TwitterSDK({
      consumer_key: clientId,
      consumer_secret: clientSecret,
      access_token_key: tokenKey,
      access_token_secret: tokenSecret,
    });
  }
}
